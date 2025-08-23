import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import Container from '../components/ui/Container';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { GoogleGenAI, Type } from "@google/genai";
import { Sparkles, Upload, PlusCircle } from 'lucide-react';
// import { APPLE_DEVICE_MODELS } from '../constants'; // Removed as models are now fetched from Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zokkxkyhabihxjskdcfg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpva2t4a3loYWJpaHhqc2tkY2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MTQyMDMsImV4cCI6MjA3MTE5MDIwM30.Dvnl7lUwezVDGY9I6IIgfoJXWtaw1Un_idOxTlI0xwQ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AddDevicePage: React.FC = () => {
  const { addDevice, t, currentUser } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const reportType = queryParams.get('type');
  const isLostReport = reportType === 'lost';

  const [deviceModels, setDeviceModels] = useState<string[]>([]);
  const [loadingModels, setLoadingModels] = useState(true);
  const [model, setModel] = useState(''); // Initialize with empty string, will be set after fetching
  const [serialNumber, setSerialNumber] = useState('');
  const [color, setColor] = useState('');
  const [description, setDescription] = useState('');
  const [rewardAmount, setRewardAmount] = useState<number | undefined>();
  const [marketValue, setMarketValue] = useState<number | undefined>();
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false); // For AI suggestions and form submission
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDeviceModels = async () => {
      setLoadingModels(true);
      const { data, error } = await supabase.from('device_models').select('name').order('name', { ascending: true });
      if (error) {
        console.error("Error fetching device models:", error.message);
        setError(t('failedToLoadDeviceModels')); // Add this translation key
      } else if (data) {
        const models = data.map(item => item.name);
        setDeviceModels(models);
        if (models.length > 0) {
          setModel(models[0]); // Set initial model to the first fetched model
        }
      }
      setLoadingModels(false);
    };
    fetchDeviceModels();
  }, [t]);

  const title = isLostReport ? t('addLostDevice') : t('reportFoundDevice');
  
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        if (e.target.files[0].size > 10 * 1024 * 1024) { // 10MB limit
            setError("File is too large. Maximum size is 10MB.");
            return;
        }
        setInvoiceFile(e.target.files[0]);
        setError('');
    }
  };

  const handleAiSuggestion = async () => {
    if (!model) {
      setError("Please enter a device model first.");
      return;
    }
    setIsLoading(true);
    setError('');
    setRewardAmount(undefined);
    setMarketValue(undefined);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `As an expert on Apple products, analyze the following device: Model: "${model}", Color: "${color}".`;
      let schema;
      let finalPrompt = prompt;

      if (isLostReport) {
        schema = {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING, description: "A brief, helpful description for a lost and found report." },
            rewardAmount: { type: Type.INTEGER, description: "A suggested fair reward in Turkish Lira (TL), about 10-20% of the used market value." },
            marketValue: { type: Type.INTEGER, description: "The estimated used market value in Turkish Lira (TL)." }
          },
          required: ["description", "rewardAmount", "marketValue"]
        };
        finalPrompt += " Provide a suggested description, reward amount, and estimated market value in TL.";
      } else { // isFinder
        schema = {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING, description: "A brief, helpful description for a found device report, focusing on identifying details." }
          },
          required: ["description"]
        };
        finalPrompt += " Provide a suggested description for a found device report.";
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
      if (isLostReport && result.rewardAmount) setRewardAmount(result.rewardAmount);
      if (isLostReport && result.marketValue) setMarketValue(result.marketValue);

    } catch (e) {
      console.error("Error calling Gemini API", e);
      setError(t('aiError'));
    } finally {
      setIsLoading(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!model || !serialNumber || !color) {
      alert('Please fill in all required fields.');
      return;
    }

    let invoiceDataUrl: string | undefined = undefined;
    if (invoiceFile && isLostReport) {
        try {
            invoiceDataUrl = await fileToBase64(invoiceFile);
        } catch (error) {
            console.error("Error converting file to Base64", error);
            setError("Could not process the invoice file. Please try again.");
            return;
        }
    }

    console.log("AddDevicePage: Current User ID before addDevice call:", currentUser?.id); // Added for debugging
    const success = await addDevice({ model, serialNumber, color, description, rewardAmount, invoiceDataUrl }, isLostReport);
    if (success) {
      navigate('/dashboard');
    } else {
      setError(t('failedToAddDevice')); // You might want to add this translation key
    }
  };

  return (
    <Container className="max-w-2xl">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-brand-gray-600 mb-6">{title}</h2>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label={t('deviceSerialNumber')} 
            id="serialNumber" 
            type="text" 
            value={serialNumber} 
            onChange={(e) => setSerialNumber(e.target.value)} 
            required 
          />
          <Input 
            label={t('deviceColor')} 
            id="color" 
            type="text" 
            value={color} 
            onChange={(e) => setColor(e.target.value)} 
            required 
          />

          <div className="w-full">
            <label htmlFor="model" className="block text-sm font-medium text-brand-gray-600 mb-1">
              {t('deviceModel')}
            </label>
            {loadingModels ? (
              <p className="text-brand-gray-500">{t('loadingDeviceModels')}</p> // Add this translation key
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
                {deviceModels.length === 0 && <option value="">{t('noModelsAvailable')}</option>} // Add this translation key
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
                <label htmlFor="invoice-upload" className="block text-sm font-medium text-brand-gray-600 mb-1">
                    {t('deviceInvoice')}
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-brand-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-brand-gray-400" />
                        <div className="flex text-sm text-brand-gray-600">
                            <label htmlFor="invoice-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-blue hover:text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-blue px-1">
                                <span>Upload a file</span>
                                <input id="invoice-upload" name="invoice-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*,.pdf" />
                            </label>
                        </div>
                        {invoiceFile ? (
                          <p className="text-xs text-brand-gray-500 font-semibold">{invoiceFile.name}</p>
                        ) : (
                          <p className="text-xs text-brand-gray-500">PNG, JPG, PDF up to 10MB</p>
                        )}
                    </div>
                </div>
                <p className="mt-1 text-xs text-brand-gray-500">{t('deviceInvoiceHelper')}</p>
            </div>
          )}

          <div className="pt-2">
             <Button type="button" onClick={handleAiSuggestion} disabled={isLoading || !model} variant="secondary" className="w-full mb-4">
              {isLoading 
                ? t('gettingSuggestions') 
                : (
                  <span className="flex items-center justify-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isLostReport ? t('suggestRewardDescription') : t('suggestDescription')}
                  </span>
                )
              }
            </Button>
          </div>
          
          {rewardAmount && isLostReport && (
              <div className="bg-brand-blue-light p-4 rounded-md text-center my-4">
                  <p className="font-semibold text-brand-gray-600">{t('aiSuggestion')}</p>
                  <p className="text-brand-gray-500">{t('suggestedReward')}: <span className="font-bold text-brand-blue">{rewardAmount.toLocaleString('tr-TR')} TL</span></p>
                  {marketValue && <p className="text-sm text-brand-gray-400">({t('basedOnValue', {value: marketValue.toLocaleString('tr-TR')})} TL)</p>}
              </div>
          )}

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-brand-gray-600 mb-1">{t('deviceDescription')}</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="block w-full px-3 py-2 border border-brand-gray-300 rounded-md shadow-sm placeholder-brand-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
              placeholder={isLostReport ? "e.g., small scratch on the corner" : "e.g., found near a cafe"}
            />
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full" size="lg">
              {t('submit')}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default AddDevicePage;