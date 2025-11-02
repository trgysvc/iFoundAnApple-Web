import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext.tsx";
import Container from "../components/ui/Container.tsx";
import Input from "../components/ui/Input.tsx";
import Button from "../components/ui/Button.tsx";
import { Upload, CheckCircle } from "lucide-react";
import { getColorsForDevice } from '../constants';
import { supabase } from '../utils/supabaseClient';
import { uploadInvoiceDocument } from '../utils/fileUpload';
import { secureLogger, validators, sanitizers } from '../utils/security';
import { performCompleteFileValidation } from '../utils/fileSecurity';
import { logInvoiceUpload } from '../utils/invoiceManager';

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
  const [lostDate, setLostDate] = useState(""); // YYYY-MM-DD format
  const [lostLocation, setLostLocation] = useState("");
  const [foundDate, setFoundDate] = useState(""); // YYYY-MM-DD format for found devices
  const [foundLocation, setFoundLocation] = useState(""); // For found devices
  const [devicePhotoFile, setDevicePhotoFile] = useState<File | null>(null); // For found device photos
  const [uploadedDevicePhotoUrl, setUploadedDevicePhotoUrl] = useState<string | null>(null); // For found device photos
  const [isUploadingDevicePhoto, setIsUploadingDevicePhoto] = useState(false); // For found device photos
  const [isDraggingDevicePhoto, setIsDraggingDevicePhoto] = useState(false); // For drag state
  const [isLoading, setIsLoading] = useState(false); // For form submission
  const [error, setError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

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

  const handleDevicePhotoFileProcess = async (files: File[]) => {
    console.log("handleDevicePhotoFileProcess called");
    console.log("Files to process:", files.length, files);
    
    // Limit to 2 files
    if (files.length > 2) {
      setError("Maksimum 2 fotoğraf yükleyebilirsiniz (ön ve arka)");
      return;
    }
    
    setIsUploadingDevicePhoto(true);
    setError("");
    
    try {
      const uploadedUrls: string[] = [];
      const baseTimestamp = Date.now();
      
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        console.log("Processing file:", file.name, file.size);
        const securityValidation = await performCompleteFileValidation(file);
        
        if (!securityValidation.valid) {
          console.error("File validation failed:", securityValidation.error);
          setError(securityValidation.error || "File validation failed");
          setIsUploadingDevicePhoto(false);
          return;
        }

        // Upload device photo to device-pics bucket
        if (currentUser) {
          console.log("Uploading to device-pics bucket for user:", currentUser.id);
          // Add index to timestamp to ensure unique filename even if uploaded at the same millisecond
          const uniqueTimestamp = baseTimestamp + index;
          const filePath = `${currentUser.id}/${uniqueTimestamp}_${file.name}`;
          console.log("Upload path:", filePath);
          
          const result = await supabase.storage
            .from('device-pics')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            });
          
          console.log("Upload result:", result);
          
          if (result.error) {
            console.error("Upload error:", result.error);
            setError(result.error.message || "Failed to upload device photo. Please try again.");
            setIsUploadingDevicePhoto(false);
            return;
          }
          
          if (result.data) {
            console.log("Upload successful, path:", result.data.path);
            uploadedUrls.push(result.data.path);
            
            secureLogger.info("Device photo uploaded successfully", {
              userId: currentUser.id,
              fileSize: file.size,
              filePath: result.data.path,
            });
          }
        }
      }
      
        // Store all uploaded URLs as comma-separated string
        if (uploadedUrls.length > 0) {
          console.log("All uploads successful, URLs:", uploadedUrls);
          // Join multiple photo URLs with comma separator
          setUploadedDevicePhotoUrl(uploadedUrls.join(','));
          // Store the first file for display
          setDevicePhotoFile(files[0]);
        } else {
          console.log("No files uploaded successfully");
        }
    } catch (error) {
      console.error("Device photo upload error:", error);
      secureLogger.error("Device photo upload error", error);
      setError("Failed to upload device photo. Please try again.");
      setDevicePhotoFile(null);
    } finally {
      setIsUploadingDevicePhoto(false);
    }
  };

  const handleDevicePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      handleDevicePhotoFileProcess(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingDevicePhoto(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingDevicePhoto(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingDevicePhoto(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      handleDevicePhotoFileProcess(files);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Input validation and sanitization
    const sanitizedModel = sanitizers.text(model);
    const sanitizedSerialNumber = sanitizers.text(serialNumber);
    const sanitizedColor = sanitizers.text(color);
    const sanitizedDescription = sanitizers.text(description);
    const sanitizedLostLocation = sanitizers.text(lostLocation);
    const sanitizedFoundLocation = sanitizers.text(foundLocation);

    if (!sanitizedModel || !sanitizedSerialNumber || !sanitizedColor) {
      setError("Please fill in all required fields.");
      return;
    }

    // For lost devices, validate lost date and location
    if (isLostReport) {
      if (!lostDate) {
        setError("Please select the date when the device was lost.");
        return;
      }
      if (!sanitizedLostLocation) {
        setError("Please enter where the device was lost.");
        return;
      }
    }

    // For found devices, validate found date and location
    if (!isLostReport) {
      if (!foundDate) {
        setError("Please select the date when the device was found.");
        return;
      }
      if (!sanitizedFoundLocation) {
        setError("Please enter where the device was found.");
        return;
      }
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
      invoice_url: isLostReport ? (uploadedFileUrl || undefined) : (uploadedDevicePhotoUrl || undefined), // Invoice for lost, photos for found
      lost_date: isLostReport ? lostDate : undefined,
      lost_location: isLostReport ? sanitizedLostLocation : undefined,
      found_date: !isLostReport ? foundDate : undefined,
      found_location: !isLostReport ? sanitizedFoundLocation : undefined,
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

          {/* Lost Date and Location - Only for lost devices */}
          {isLostReport && (
            <>
              <div>
                <label
                  htmlFor="lostDate"
                  className="block text-sm font-medium text-brand-gray-600 mb-1"
                >
                  Kayıp Tarihi
                </label>
                <input
                  id="lostDate"
                  type="date"
                  value={lostDate}
                  onChange={(e) => setLostDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]} // Cannot be in the future
                  className="block w-full px-3 py-2 border border-brand-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                  required
                />
                <p className="mt-1 text-xs text-brand-gray-500">
                  Cihazın kaybolduğu tarihi seçin
                </p>
              </div>

              <div>
                <label
                  htmlFor="lostLocation"
                  className="block text-sm font-medium text-brand-gray-600 mb-1"
                >
                  Kayıp Yeri
                </label>
                <input
                  id="lostLocation"
                  type="text"
                  value={lostLocation}
                  onChange={(e) => setLostLocation(e.target.value)}
                  placeholder="Örn: Kadıköy, İstanbul - Bağdat Caddesi"
                  className="block w-full px-3 py-2 border border-brand-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                  required
                />
                <p className="mt-1 text-xs text-brand-gray-500">
                  Cihazın kaybolduğu yeri detaylı olarak belirtin
                </p>
              </div>
            </>
          )}

          {/* Found Date, Location and Photo - Only for found devices */}
          {!isLostReport && (
            <>
              <div>
                <label
                  htmlFor="foundDate"
                  className="block text-sm font-medium text-brand-gray-600 mb-1"
                >
                  Bulunma Tarihi
                </label>
                <input
                  id="foundDate"
                  type="date"
                  value={foundDate}
                  onChange={(e) => setFoundDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]} // Cannot be in the future
                  className="block w-full px-3 py-2 border border-brand-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                  required
                />
                <p className="mt-1 text-xs text-brand-gray-500">
                  Cihazın bulunduğu tarihi seçin
                </p>
              </div>

              <div>
                <label
                  htmlFor="foundLocation"
                  className="block text-sm font-medium text-brand-gray-600 mb-1"
                >
                  Bulunma Yeri
                </label>
                <input
                  id="foundLocation"
                  type="text"
                  value={foundLocation}
                  onChange={(e) => setFoundLocation(e.target.value)}
                  placeholder="Örn: Kadıköy, İstanbul - Bağdat Caddesi"
                  className="block w-full px-3 py-2 border border-brand-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                  required
                />
                <p className="mt-1 text-xs text-brand-gray-500">
                  Cihazın bulunduğu yeri detaylı olarak belirtin
                </p>
              </div>

              {/* Device Photo Upload for Found Device */}
              <div>
                <label
                  htmlFor="device-photo-upload"
                  className="block text-sm font-medium text-brand-gray-600 mb-1"
                >
                  Cihaz Fotoğrafı (Ön ve Arka)
                </label>
                <div 
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                    isDraggingDevicePhoto 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="space-y-1 text-center">
                    {uploadedDevicePhotoUrl ? (
                      <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
                    ) : (
                      <Upload className="mx-auto h-12 w-12 text-brand-gray-400" />
                    )}
                    <div className="flex text-sm text-brand-gray-600">
                      <label
                        htmlFor="device-photo-file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium hover:text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-blue px-1"
                      >
                        <span>
                          {isUploadingDevicePhoto ? 'Uploading...' : 
                           uploadedDevicePhotoUrl ? 'Photo uploaded successfully' : 
                           'Upload a file'}
                        </span>
                        <input
                          id="device-photo-file-upload"
                          name="device-photo-file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleDevicePhotoFileChange}
                          accept="image/*"
                          multiple
                          disabled={isUploadingDevicePhoto}
                        />
                      </label>
                    </div>
                    {devicePhotoFile ? (
                      <div className="space-y-1">
                        <p className="text-xs text-brand-gray-700 font-semibold">
                          {devicePhotoFile.name}
                        </p>
                        {uploadedDevicePhotoUrl && (
                          <p className="text-xs text-green-600">
                            ✓ Saved to secure storage
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-brand-gray-500">
                        PNG, JPG, WebP up to 10MB, maksimum 2 fotoğraf (ön ve arka)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
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

          {/* Kullanıcı Bilgilendirme Bölümü */}
          <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
            {isLostReport ? (
              // Kayıp Cihaz İçin Bilgilendirme
              <>
                <h3 className="text-lg font-semibold text-brand-gray-700 mb-4">
                  {t("lostDeviceInfoTitle")}
                </h3>
                
                <h4 className="text-base font-semibold text-brand-gray-700 mb-4">
                  {t("lostDeviceInfoSubtitle")}
                </h4>
                
                <div className="space-y-4 text-sm text-brand-gray-600">
                  <div>
                    <h4 className="font-semibold text-brand-gray-700 mb-1">{t("lostDeviceInfoFree")}</h4>
                    <p className="leading-relaxed">
                      {t("lostDeviceInfoFreeDesc")}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-brand-gray-700 mb-1">{t("lostDeviceInfoPayment")}</h4>
                    <p className="leading-relaxed">
                      {t("lostDeviceInfoPaymentDesc")}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-brand-gray-700 mb-1">{t("lostDeviceInfoFees")}</h4>
                    <p className="leading-relaxed mb-2">
                      {t("lostDeviceInfoFeesDesc")}
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>{t("lostDeviceInfoFeeItem1")}</li>
                      <li>{t("lostDeviceInfoFeeItem2")}</li>
                      <li>{t("lostDeviceInfoFeeItem3")}</li>
                      <li>{t("lostDeviceInfoFeeItem4")}</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-brand-gray-700 mb-1">{t("lostDeviceInfoCancel")}</h4>
                    <p className="leading-relaxed">
                      {t("lostDeviceInfoCancelDesc")}
                    </p>
                  </div>

                  <div className="pt-2 pb-1">
                    <p className="leading-relaxed italic text-brand-gray-700">
                      iFoundAnApple olarak, değerli eşyalarınıza kavuşmanız için şeffaf ve güvenilir bir hizmet 
                      sunmaya özen gösteriyoriz.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              // Bulunan Cihaz İçin Bilgilendirme
              <>
                <h3 className="text-lg font-semibold text-brand-gray-700 mb-4">
                  {t("foundDeviceInfoTitle")}
                </h3>
                
                <h4 className="text-base font-semibold text-brand-gray-700 mb-4">
                  {t("foundDeviceInfoSubtitle")}
                </h4>
                
                <div className="space-y-4 text-sm text-brand-gray-600">
                  <div>
                    <h4 className="font-semibold text-brand-gray-700 mb-1">{t("foundDeviceInfoFree")}</h4>
                    <p className="leading-relaxed">
                      {t("foundDeviceInfoFreeDesc")}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-brand-gray-700 mb-1">{t("foundDeviceInfoReward")}</h4>
                    <p className="leading-relaxed">
                      {t("foundDeviceInfoRewardDesc")}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-brand-gray-700 mb-1">{t("foundDeviceInfoRewardAmount")}</h4>
                    <p className="leading-relaxed">
                      {t("foundDeviceInfoRewardAmountDesc")}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-brand-gray-700 mb-1">{t("foundDeviceInfoSecurity")}</h4>
                    <p className="leading-relaxed">
                      {t("foundDeviceInfoSecurityDesc")}
                    </p>
                  </div>

                  <div className="pt-2 pb-1">
                    <p className="leading-relaxed italic text-brand-gray-700">
                      {t("foundDeviceInfoFooter")}
                    </p>
                  </div>
                </div>
              </>
            )}

            <div className="mt-6 pt-4 border-t border-gray-300">
              <p className="text-sm font-medium text-brand-gray-700 mb-3">
                {isLostReport ? t("lostDeviceCheckboxText") : t("foundDeviceCheckboxText")}
              </p>
              <label className="flex items-start cursor-pointer group">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 text-brand-blue border-gray-300 rounded focus:ring-brand-blue cursor-pointer"
                />
                <span className="ml-3 text-sm text-brand-gray-700 group-hover:text-brand-blue transition-colors">
                  {t("agreeToTermsText")}
                </span>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex space-x-4">
              <Button 
                type="button" 
                variant="secondary" 
                className="flex-1"
                onClick={() => navigate('/dashboard')}
              >
                Cihazlarım Listesine Geri Dön
              </Button>
              
              <Button 
                type="submit" 
                className="flex-1" 
                size="lg"
                disabled={!termsAccepted}
              >
                {t("submit")}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default AddDevicePage;
