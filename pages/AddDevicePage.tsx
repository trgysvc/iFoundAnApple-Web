import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext.tsx";
import Container from "../components/ui/Container.tsx";
import Input from "../components/ui/Input.tsx";
import Button from "../components/ui/Button.tsx";
import { Upload, CheckCircle } from "lucide-react";
import { getColorsForDevice } from '../constants';
import { supabase } from '../utils/supabaseClient';
import { uploadInvoiceDocument, uploadFoundDevicePhoto } from '../utils/fileUpload';
import { secureLogger, validators, sanitizers } from '../utils/security';
import { performCompleteFileValidation } from '../utils/fileSecurity';

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
  const [uploadedFileMeta, setUploadedFileMeta] = useState<{
    originalName: string;
    size: number;
    type: string;
  } | null>(null);
  const [lostDate, setLostDate] = useState(""); // YYYY-MM-DD format
  const [lostLocation, setLostLocation] = useState("");
  const [foundDate, setFoundDate] = useState(""); // YYYY-MM-DD format
  const [foundLocation, setFoundLocation] = useState("");
  const [finderPhotoUrls, setFinderPhotoUrls] = useState<string[]>([]);
  const [isUploadingFinderPhotos, setIsUploadingFinderPhotos] = useState(false);
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

  const ensureSupportedMimeType = (file: File): File => {
    if (file.type && file.type !== "application/json") {
      return file;
    }

    const lowerCaseName = file.name.toLowerCase();
    const typeMappings: Array<{ ext: string; mime: string }> = [
      { ext: ".pdf", mime: "application/pdf" },
      { ext: ".jpg", mime: "image/jpeg" },
      { ext: ".jpeg", mime: "image/jpeg" },
      { ext: ".png", mime: "image/png" },
      { ext: ".webp", mime: "image/webp" },
    ];

    const matchedType = typeMappings.find((mapping) =>
      lowerCaseName.endsWith(mapping.ext)
    );

    if (matchedType) {
      const normalizedBlob = file.slice(0, file.size, matchedType.mime);
      return new File([normalizedBlob], file.name, {
        type: matchedType.mime,
        lastModified: file.lastModified,
      });
    }

    return file;
  };

  const title = isLostReport ? t("addLostDevice") : t("reportFoundDevice");

  useEffect(() => {
    if (isLostReport) {
      setFoundDate("");
      setFoundLocation("");
      setFinderPhotoUrls([]);
    } else {
      setInvoiceFile(null);
      setUploadedFileUrl(null);
      setUploadedFileMeta(null);
      setLostDate("");
      setLostLocation("");
    }
  }, [isLostReport]);

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
      const originalFile = e.target.files[0];
      const file = ensureSupportedMimeType(originalFile);
      
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
            setUploadedFileMeta({
              originalName: file.name,
              size: file.size,
              type: file.type,
            });
            
            secureLogger.info("File uploaded successfully", {
              userId: currentUser.id,
              fileSize: file.size,
              hasWarnings: securityValidation.warnings && securityValidation.warnings.length > 0
            });
          } else {
            setError(result.error || "Failed to upload file. Please try again.");
            setInvoiceFile(null);
            setUploadedFileUrl(null);
            setUploadedFileMeta(null);
          }
        }
      } catch (error) {
        secureLogger.error("File upload error", error);
        setError("Failed to upload file. Please try again.");
        setInvoiceFile(null);
        setUploadedFileUrl(null);
        setUploadedFileMeta(null);
      } finally {
        setIsUploadingFile(false);
      }
    }
  };

  const handleFinderPhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!currentUser) {
      setError("Please sign in to upload device photos.");
      return;
    }

    const inputElement = e.target as HTMLInputElement;
    const fileList = inputElement.files ? Array.from(inputElement.files) : [];
    inputElement.value = "";

    if (fileList.length > 0) {
      const files = fileList;
      setIsUploadingFinderPhotos(true);
      setError("");

      try {
        const uploadedUrls: string[] = [];

        for (const original of files) {
          const file = ensureSupportedMimeType(original);

          const securityValidation = await performCompleteFileValidation(file);
          if (!securityValidation.valid) {
            setError(securityValidation.error || "File validation failed");
            setIsUploadingFinderPhotos(false);
            return;
          }

          if (
            securityValidation.warnings &&
            securityValidation.warnings.length > 0
          ) {
            console.warn(
              "Finder photo upload security warnings:",
              securityValidation.warnings
            );
          }

          const result = await uploadFoundDevicePhoto(
            file,
            currentUser.id,
            model
          );

          if (result.success && result.url) {
            uploadedUrls.push(result.url);
          } else {
            setError(
              result.error ||
                "Failed to upload photo. Please try again with a valid image."
            );
            setIsUploadingFinderPhotos(false);
            return;
          }
        }

        if (uploadedUrls.length > 0) {
          setFinderPhotoUrls((prev) => [...prev, ...uploadedUrls]);
        }
      } catch (uploadError) {
        secureLogger.error("Finder photo upload error", uploadError);
        setError("Failed to upload photo. Please try again.");
      } finally {
        setIsUploadingFinderPhotos(false);
      }
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
    } else {
      if (!foundDate) {
        setError("Please select the date when the device was found.");
        return;
      }
      if (!sanitizedFoundLocation) {
        setError("Please enter where the device was found.");
        return;
      }
      if (finderPhotoUrls.length === 0) {
        setError("Please upload at least one photo of the found device.");
        return;
      }
    }

    if (!validators.serialNumber(sanitizedSerialNumber)) {
      setError("Please enter a valid serial number (8-12 characters, letters and numbers only).");
      return;
    }

    const invoiceUrl = isLostReport
      ? uploadedFileUrl || undefined
      : finderPhotoUrls.length > 0
        ? finderPhotoUrls.join(",")
        : undefined;

    const deviceData = {
      model: sanitizedModel,
      serialNumber: sanitizedSerialNumber,
      color: sanitizedColor,
      description: sanitizedDescription,
      rewardAmount,
      marketValue,
      invoice_url: invoiceUrl, // Use Supabase Storage URL
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
      const success = await addDevice(
        deviceData,
        isLostReport,
        uploadedFileUrl && uploadedFileMeta && isLostReport
          ? {
              invoiceDocument: {
                filePath: uploadedFileUrl,
                originalFileName: uploadedFileMeta.originalName,
                fileSize: uploadedFileMeta.size,
                mimeType: uploadedFileMeta.type,
                file: invoiceFile ?? undefined,
              },
            }
          : undefined
      );
      console.log("AddDevicePage: addDevice returned:", success);
      
      if (success) {
        console.log("AddDevicePage: Success! Navigating to dashboard...");
        navigate("/dashboard");
        if (isLostReport) {
          setInvoiceFile(null);
          setUploadedFileUrl(null);
          setUploadedFileMeta(null);
          setLostDate("");
          setLostLocation("");
        } else {
          setFinderPhotoUrls([]);
          setFoundDate("");
          setFoundLocation("");
        }
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

          {/* Found device details - Only for finder reports */}
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
                  max={new Date().toISOString().split("T")[0]}
                  className="block w-full px-3 py-2 border border-brand-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                  required
                />
                <p className="mt-1 text-xs text-brand-gray-500">
                  Cihazı bulduğunuz tarihi seçin
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
                  placeholder="Örn: Taksim Meydanı, İstanbul"
                  className="block w-full px-3 py-2 border border-brand-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                  required
                />
                <p className="mt-1 text-xs text-brand-gray-500">
                  Cihazı bulduğunuz yeri mümkün olduğunca detaylı belirtin
                </p>
              </div>

              <div>
                <label
                  htmlFor="finder-photos-upload"
                  className="block text-sm font-medium text-brand-gray-600 mb-1"
                >
                  Bulunan Cihaz Fotoğrafları
                </label>
                <div
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${
                    finderPhotoUrls.length > 0
                      ? "border-green-300 bg-green-50"
                      : isUploadingFinderPhotos
                        ? "border-blue-300 bg-blue-50"
                        : "border-brand-gray-300"
                  }`}
                >
                  <div className="space-y-1 text-center">
                    {isUploadingFinderPhotos ? (
                      <div className="animate-spin mx-auto h-12 w-12 text-blue-500">
                        <Upload className="h-12 w-12" />
                      </div>
                    ) : finderPhotoUrls.length > 0 ? (
                      <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                    ) : (
                      <Upload className="mx-auto h-12 w-12 text-brand-gray-400" />
                    )}

                    <div className="flex text-sm text-brand-gray-600">
                      <label
                        htmlFor="finder-photos-upload"
                        className={`relative cursor-pointer bg-white rounded-md font-medium hover:text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-blue px-1 ${
                          finderPhotoUrls.length > 0
                            ? "text-green-600"
                            : "text-brand-blue"
                        }`}
                      >
                        <span>
                          {isUploadingFinderPhotos
                            ? "Yükleniyor..."
                            : finderPhotoUrls.length > 0
                              ? "Fotoğraflar yüklendi"
                              : "Fotoğraf yükle"}
                        </span>
                        <input
                          id="finder-photos-upload"
                          name="finder-photos-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          multiple
                          onChange={handleFinderPhotoUpload}
                          disabled={isUploadingFinderPhotos}
                          required={finderPhotoUrls.length === 0}
                        />
                      </label>
                    </div>

                    <p className="text-xs text-brand-gray-500">
                      Minimum 1 fotoğraf, tercihen ön ve arka olmak üzere 2 fotoğraf yükleyin.
                      Desteklenen formatlar: JPG, PNG, WebP (max 5MB).
                    </p>

                    {finderPhotoUrls.length > 0 && (
                      <div className="mt-3 space-y-1 text-left text-xs text-brand-gray-600">
                        <p className="font-semibold">Yüklenen Fotoğraflar:</p>
                        <ul className="space-y-1">
                          {finderPhotoUrls.map((url) => {
                            const fileName =
                              url.split("/").slice(-1)[0] || "device_photo";
                            return (
                              <li
                                key={url}
                                className="bg-white border border-brand-gray-200 rounded-md px-3 py-2 flex items-center justify-between"
                              >
                                <span className="truncate mr-2">
                                  {fileName}
                                </span>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  onClick={() =>
                                    setFinderPhotoUrls((prev) =>
                                      prev.filter((item) => item !== url)
                                    )
                                  }
                                >
                                  Kaldır
                                </Button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
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
                  ifoundanapple'a Hoş Geldin! Cihaz Kayıt ve Takas Süreci Hakkında Önemli Bilgiler:
                </h3>
                
                <div className="space-y-4 text-sm text-brand-gray-600">
                  <div>
                    <h4 className="font-semibold text-brand-gray-700 mb-1">Cihaz Kaydı Ücretsizdir:</h4>
                    <p className="leading-relaxed">
                      Kayıp veya bulunan cihaz kayıtlarınız için sizden hiçbir ücret talep edilmeyecektir. 
                      Amacımız, cihazların sahipleriyle güvenli ve kolay bir şekilde yeniden buluşmasına aracılık etmektir.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-brand-gray-700 mb-1">Ödeme Sadece Takas Başladığında:</h4>
                    <p className="leading-relaxed">
                      Ödeme, yalnızca kayıp cihazınızın bulunmasının ardından, sizin tarafınızdan takas sürecinin 
                      başlatılması durumunda talep edilecektir. Bu, cihazınız size ulaşmadan herhangi bir ödeme 
                      yapmayacağınız anlamına gelir.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-brand-gray-700 mb-1">Ücretlendirme Detayları:</h4>
                    <p className="leading-relaxed mb-2">
                      Talep edilecek ücret, sizleri zor durumda bırakmamak adına, cihazınızın piyasa değeri üzerinden 
                      belirli ve adil bir oran dahilinde belirlenmektedir. Bu ücret aşağıdaki kalemleri kapsamaktadır:
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>ifoundanapple Hizmet Bedeli</li>
                      <li>Ödeme Sağlayıcı Bedeli (Güvenli ödeme altyapımızın maliyeti)</li>
                      <li>Kargo Bedeli (Cihazınızın size güvenle ulaştırılması)</li>
                      <li>Cihazınızı Bulan Kişinin Ödülü (Nazik çabaları için)</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-brand-gray-700 mb-1">İptal ve İade Koşulları:</h4>
                    <p className="leading-relaxed">
                      Takas sürecinde işlem iptali talep etmeniz halinde, ödeme sağlayıcı firmanın uyguladığı 
                      %3,43'lük kesinti hariç, ödediğiniz tüm ücret tarafınıza iade edilecektir.
                    </p>
                  </div>

                  <div className="pt-2 pb-1">
                    <p className="leading-relaxed italic text-brand-gray-700">
                      ifoundanapple olarak, değerli eşyalarınıza kavuşmanız için şeffaf ve güvenilir bir hizmet 
                      sunmaya özen gösteriyoriz.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              // Bulunan Cihaz İçin Bilgilendirme
              <>
                <h3 className="text-lg font-semibold text-brand-gray-700 mb-4">
                  ifoundanapple'a Hoş Geldin! Bulunan Cihaz Kayıt ve Ödül Süreci Hakkında Önemli Bilgiler:
                </h3>
                
                <div className="space-y-4 text-sm text-brand-gray-600">
                  <div>
                    <h4 className="font-semibold text-brand-gray-700 mb-1">Cihaz Kaydı Ücretsizdir:</h4>
                    <p className="leading-relaxed">
                      Bulduğun cihazı ifoundanapple platformuna kaydetmek için senden hiçbir ücret talep edilmeyecektir. 
                      Senin bu medeni ve onurlu davranışın, bizim için paha biçilemez bir değer taşıyor. Amacımız, 
                      bulduğun değerli eşyanın sahibine güvenli ve kolay bir şekilde ulaşmasına aracılık etmektir.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-brand-gray-700 mb-1">Ödül ve Hizmet Bedelleri:</h4>
                    <p className="leading-relaxed">
                      Kayıp cihaz ile eşleşme sağlandığında ve takas süreci başlatıldığında, ifoundanapple olarak 
                      sunduğumuz hizmetler için cihazın sahibinden bir bedel tahsil edilecektir. Bu bedelin bir kısmı, 
                      senin bu nazik davranışını takdir etmek amacıyla belirlenmiş bir ödül olarak tarafına iletilecektir. 
                      Diğer kısmı ise hizmet bedeli, ödeme sağlayıcı bedeli ve kargo bedeli gibi kalemleri karşılayacaktır.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-brand-gray-700 mb-1">Ödülün Belirlenmesi:</h4>
                    <p className="leading-relaxed">
                      Senin için ayrılan ödül, bulunan cihazın piyasa değeri üzerinden belirli ve adil bir oran dahilinde 
                      belirlenmektedir. Bu sayede, gösterdiğin çabanın ve örnek davranışın karşılığında küçük bir hediye 
                      almanı sağlıyoruz.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-brand-gray-700 mb-1">Sürecin Güvenliği:</h4>
                    <p className="leading-relaxed">
                      ifoundanapple, cihazın güvenli bir şekilde sahibine ulaşmasını ve senin ödülünü eksiksiz almanı 
                      sağlayacak güvenli bir takas süreci sunar. Tüm süreç boyunca bilgilendirilecek ve destekleneceksin.
                    </p>
                  </div>

                  <div className="pt-2 pb-1">
                    <p className="leading-relaxed italic text-brand-gray-700">
                      ifoundanapple olarak, dürüstlüğünü ve yardımseverliğini yürekten takdir ediyor, değerli eşyaların 
                      sahiplerine ulaşması için şeffaf ve güvenilir bir platform sunmaya özen gösteriyoruz. Senin gibi 
                      insanların varlığı, dünyayı daha iyi bir yer yapıyor.
                    </p>
                  </div>
                </div>
              </>
            )}

            <div className="mt-6 pt-4 border-t border-gray-300">
              <p className="text-sm font-medium text-brand-gray-700 mb-3">
                {isLostReport ? 'Cihaz kaydına devam etmek için lütfen aşağıdaki kutucuğu işaretleyin:' : 'Bulduğun cihazı kaydetmek için lütfen aşağıdaki kutucuğu işaretle:'}
              </p>
              <label className="flex items-start cursor-pointer group">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 text-brand-blue border-gray-300 rounded focus:ring-brand-blue cursor-pointer"
                />
                <span className="ml-3 text-sm text-brand-gray-700 group-hover:text-brand-blue transition-colors">
                  Yukarıdaki şartları okudum ve kabul ediyorum.
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
