import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext.tsx";
import Container from "../components/ui/Container.tsx";
import Input from "../components/ui/Input.tsx";
import Button from "../components/ui/Button.tsx";
import { GoogleGenAI, Type } from "@google/genai";
import { Sparkles, Upload, PlusCircle, CheckCircle, AlertCircle } from "lucide-react";
import { getColorsForDevice } from '../constants';
import { createClient } from "@supabase/supabase-js";
import { uploadInvoiceDocument } from '../utils/fileUpload';
import { getSecureConfig, secureLogger, validators, sanitizers } from '../utils/security';
import { performCompleteFileValidation } from '../utils/fileSecurity';
import { logInvoiceUpload } from '../utils/invoiceManager';

// Get secure configuration from environment variables
const { supabaseUrl, supabaseAnonKey, geminiApiKey } = getSecureConfig();
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: "public",
  },
  global: {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  },
});

const AddDevicePage: React.FC = () => {
  const { addDevice, t, currentUser } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const reportType = queryParams.get("type");
  const isLostReport = reportType === "lost";

  const [deviceModels, setDeviceModels] = useState<string[]>([]);
  const [loadingModels, setLoadingModels] = useState(true);
  const [model, setModel] = useState(""); // Initialize with empty string, will be set after fetching
  const [serialNumber, setSerialNumber] = useState("");
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");
  const [rewardAmount, setRewardAmount] = useState<number | undefined>();
  const [marketValue, setMarketValue] = useState<number | undefined>();
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // For AI suggestions and form submission
  const [error, setError] = useState("");

  const fetchDeviceModels = useCallback(async () => {
    setLoadingModels(true);
    try {
      const { data, error } = await supabase
        .from("device_models")
        .select("name")
        .order("name", { ascending: true });
      
      if (error) {
        console.error("Error fetching device models:", error.message);
        setError(t("failedToLoadDeviceModels"));
      } else if (data) {
        const models = data.map((item) => item.name);
        setDeviceModels(models);
        if (models.length > 0) {
          setModel(models[0]); // Set initial model to the first fetched model
        }
      }
    } catch (err) {
      console.error("Error in fetchDeviceModels:", err);
      setError(t("failedToLoadDeviceModels"));
    } finally {
      setLoadingModels(false);
    }
  }, [t]);

  useEffect(() => {
    fetchDeviceModels();
  }, [fetchDeviceModels]);

  // Memoized available colors based on selected model
  const availableColors = useMemo(() => {
    if (model) {
      return getColorsForDevice(model);
    }
    return [];
  }, [model]);

  // Update color when model changes
  useEffect(() => {
    if (model && availableColors.length > 0) {
      // Reset color selection when model changes
      if (!availableColors.includes(color)) {
        setColor(availableColors[0]);
      }
    }
  }, [model, availableColors, color]);

  const title = isLostReport ? t("addLostDevice") : t("reportFoundDevice");

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Enhanced security validation
      setIsUploadingFile(true);
      setError("");
      
      try {
        const securityValidation = await performCompleteFileValidation(file);
        
        if (!securityValidation.valid) {
          setError(securityValidation.error || "File validation failed");
          setIsUploadingFile(false);
          return;
        }

        // Log security warnings if any
        if (securityValidation.warnings && securityValidation.warnings.length > 0) {
          console.warn("File upload security warnings:", securityValidation.warnings);
        }

        setInvoiceFile(file);

        // Upload file immediately when selected
        if (currentUser) {
          const result = await uploadInvoiceDocument(file, currentUser.id, model);
          
          if (result.success && result.url) {
            setUploadedFileUrl(result.url);
            
            // Log invoice upload for audit trail
            await logInvoiceUpload({
              userId: currentUser.id,
              deviceId: "", // Will be set when device is created
              fileName: result.url,
              originalFileName: file.name,
              filePath: result.url,
              fileSize: file.size,
              mimeType: file.type,
              deviceModel: model,
            }, file);
            
            secureLogger.info("File uploaded successfully", {
              userId: currentUser.id,
              fileSize: file.size,
              hasWarnings: securityValidation.warnings && securityValidation.warnings.length > 0
            });
          } else {
            setError(result.error || "Failed to upload file. Please try again.");
            setInvoiceFile(null);
          }
        }
      } catch (error) {
        secureLogger.error("File upload error", error);
        setError("Failed to upload file. Please try again.");
        setInvoiceFile(null);
      } finally {
        setIsUploadingFile(false);
      }
    }
  };

  const handleAiSuggestion = async () => {
    if (!model) {
      setError("Please enter a device model first.");
      return;
    }
    setIsLoading(true);
    setError("");
    setRewardAmount(undefined);
    setMarketValue(undefined);

    try {
      if (!geminiApiKey) {
        setError("AI service is not available. Please contact support.");
        return;
      }
      const ai = new GoogleGenAI({ apiKey: geminiApiKey });
      const prompt = `As an expert on Apple products, analyze the following device: Model: "${model}", Color: "${color}".`;
      let schema;
      let finalPrompt = prompt;

      if (isLostReport) {
        schema = {
          type: Type.OBJECT,
          properties: {
            description: {
              type: Type.STRING,
              description:
                "A brief, helpful description for a lost and found report.",
            },
            rewardAmount: {
              type: Type.INTEGER,
              description:
                "A suggested fair reward in Turkish Lira (TL), about 10-20% of the used market value.",
            },
            marketValue: {
              type: Type.INTEGER,
              description:
                "The estimated used market value in Turkish Lira (TL).",
            },
          },
          required: ["description", "rewardAmount", "marketValue"],
        };
        finalPrompt +=
          " Provide a suggested description, reward amount, and estimated market value in TL.";
      } else {
        // isFinder
        schema = {
          type: Type.OBJECT,
          properties: {
            description: {
              type: Type.STRING,
              description:
                "A brief, helpful description for a found device report, focusing on identifying details.",
            },
          },
          required: ["description"],
        };
        finalPrompt +=
          " Provide a suggested description for a found device report.";
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: finalPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      });

      const jsonStr = response.text.trim();
      const result = JSON.parse(jsonStr);

      if (result.description) setDescription(result.description);
      if (isLostReport && result.rewardAmount)
        setRewardAmount(result.rewardAmount);
      if (isLostReport && result.marketValue)
        setMarketValue(result.marketValue);
    } catch (e) {
      console.error("Error calling Gemini API", e);
      setError(t("aiError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Input validation and sanitization
    const sanitizedModel = sanitizers.text(model);
    const sanitizedSerialNumber = sanitizers.text(serialNumber);
    const sanitizedColor = sanitizers.text(color);
    const sanitizedDescription = sanitizers.text(description);

    if (!sanitizedModel || !sanitizedSerialNumber || !sanitizedColor) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!validators.serialNumber(sanitizedSerialNumber)) {
      setError("Please enter a valid serial number (8-12 characters, letters and numbers only).");
      return;
    }

    // Use uploaded file URL instead of Base64
    const deviceData = {
      model: sanitizedModel,
      serialNumber: sanitizedSerialNumber,
      color: sanitizedColor,
      description: sanitizedDescription,
      rewardAmount,
      marketValue,
      invoice_url: uploadedFileUrl || undefined, // Use Supabase Storage URL
    };

    console.log(
      "AddDevicePage: Current User ID before addDevice call:",
      currentUser?.id
    );
    console.log("AddDevicePage: Device data with invoice URL:", deviceData);
    
    try {
      const success = await addDevice(deviceData, isLostReport);
      console.log("AddDevicePage: addDevice returned:", success);
      
      if (success) {
        console.log("AddDevicePage: Success! Navigating to dashboard...");
        navigate("/dashboard");
      } else {
        console.error("AddDevicePage: addDevice returned false");
        setError(t("failedToAddDevice"));
      }
    } catch (error) {
      console.error("AddDevicePage: Unexpected error in addDevice:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Container className="max-w-2xl">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-brand-gray-600 mb-6">
          {title}
        </h2>
        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-md text-sm mb-4">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t("deviceSerialNumber")}
            id="serialNumber"
            type="text"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            required
          />
          <div className="w-full">
            <label
              htmlFor="color"
              className="block text-sm font-medium text-brand-gray-600 mb-1"
            >
              {t("deviceColor")}
            </label>
            <select
              id="color"
              name="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="block w-full px-3 py-2 border border-brand-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
              required
              disabled={availableColors.length === 0}
            >
              {availableColors.length === 0 && (
                <option value="">{t("selectModelFirst")}</option>
              )}
              {availableColors.map((colorOption) => (
                <option key={colorOption} value={colorOption}>
                  {colorOption}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full">
            <label
              htmlFor="model"
              className="block text-sm font-medium text-brand-gray-600 mb-1"
            >
              {t("deviceModel")}
            </label>
            {loadingModels ? (
              <p className="text-brand-gray-500">{t("loadingDeviceModels")}</p> // Add this translation key
            ) : (
              <select
                id="model"
                name="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="block w-full px-3 py-2 border border-brand-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                required
                disabled={deviceModels.length === 0}
              >
                {deviceModels.length === 0 && (
                  <option value="">{t("noModelsAvailable")}</option>
                )}{" "}
                // Add this translation key
                {deviceModels.map((deviceModel) => (
                  <option key={deviceModel} value={deviceModel}>
                    {deviceModel}
                  </option>
                ))}
              </select>
            )}
          </div>

          {isLostReport && (
            <div>
              <label
                htmlFor="invoice-upload"
                className="block text-sm font-medium text-brand-gray-600 mb-1"
              >
                {t("deviceInvoice")}
              </label>
              <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${
                uploadedFileUrl ? 'border-green-300 bg-green-50' : 
                isUploadingFile ? 'border-blue-300 bg-blue-50' : 
                'border-brand-gray-300'
              }`}>
                <div className="space-y-1 text-center">
                  {isUploadingFile ? (
                    <div className="animate-spin mx-auto h-12 w-12 text-blue-500">
                      <Upload className="h-12 w-12" />
                    </div>
                  ) : uploadedFileUrl ? (
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                  ) : (
                    <Upload className="mx-auto h-12 w-12 text-brand-gray-400" />
                  )}
                  
                  <div className="flex text-sm text-brand-gray-600">
                    <label
                      htmlFor="invoice-upload"
                      className={`relative cursor-pointer bg-white rounded-md font-medium hover:text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-blue px-1 ${
                        uploadedFileUrl ? 'text-green-600' : 'text-brand-blue'
                      }`}
                    >
                      <span>
                        {isUploadingFile ? 'Uploading...' : 
                         uploadedFileUrl ? 'File uploaded successfully' : 
                         'Upload a file'}
                      </span>
                      <input
                        id="invoice-upload"
                        name="invoice-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept="image/*,.pdf"
                        disabled={isUploadingFile}
                      />
                    </label>
                  </div>
                  
                  {invoiceFile ? (
                    <div className="space-y-1">
                      <p className="text-xs text-brand-gray-700 font-semibold">
                        {invoiceFile.name}
                      </p>
                      {uploadedFileUrl && (
                        <p className="text-xs text-green-600">
                          ✓ Saved to secure storage
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-brand-gray-500">
                      PNG, JPG, WebP, PDF up to 10MB
                    </p>
                  )}
                </div>
              </div>
              <p className="mt-1 text-xs text-brand-gray-500">
                {t("deviceInvoiceHelper")}
              </p>
            </div>
          )}

          <div className="pt-2">
            <Button
              type="button"
              onClick={handleAiSuggestion}
              disabled={isLoading || !model}
              variant="secondary"
              className="w-full mb-4"
            >
              {isLoading ? (
                t("gettingSuggestions")
              ) : (
                <span className="flex items-center justify-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isLostReport
                    ? t("suggestRewardDescription")
                    : t("suggestDescription")}
                </span>
              )}
            </Button>
          </div>

          {rewardAmount && isLostReport && (
            <div className="bg-brand-blue-light p-4 rounded-md text-center my-4">
              <p className="font-semibold text-brand-gray-600">
                {t("aiSuggestion")}
              </p>
              <p className="text-brand-gray-500">
                {t("suggestedReward")}:{" "}
                <span className="font-bold text-brand-blue">
                  {rewardAmount.toLocaleString("tr-TR")} TL
                </span>
              </p>
              {marketValue && (
                <p className="text-sm text-brand-gray-400">
                  (
                  {t("basedOnValue", {
                    value: marketValue.toLocaleString("tr-TR"),
                  })}{" "}
                  TL)
                </p>
              )}
            </div>
          )}

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-brand-gray-600 mb-1"
            >
              {t("deviceDescription")}
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="block w-full px-3 py-2 border border-brand-gray-300 rounded-md shadow-sm placeholder-brand-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
              placeholder={
                isLostReport
                  ? "e.g., small scratch on the corner"
                  : "e.g., found near a cafe"
              }
            />
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full" size="lg">
              {t("submit")}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default AddDevicePage;
