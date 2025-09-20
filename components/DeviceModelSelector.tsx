import React, { useState, useEffect } from 'react';
import { getAllDeviceModels, getDeviceCategories, DeviceModelData } from '../utils/feeCalculation';

interface DeviceModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelName: string, modelData?: DeviceModelData) => void;
  className?: string;
  showPricing?: boolean;
}

const DeviceModelSelector: React.FC<DeviceModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  className = "",
  showPricing = false
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [models, setModels] = useState<DeviceModelData[]>([]);
  const [filteredModels, setFilteredModels] = useState<DeviceModelData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load categories and models on mount
  useEffect(() => {
    loadData();
  }, []);

  // Filter models when category or search term changes
  useEffect(() => {
    filterModels();
  }, [models, selectedCategory, searchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load categories and models in parallel
      const [categoriesResult, modelsResult] = await Promise.all([
        getDeviceCategories(),
        getAllDeviceModels()
      ]);

      if (categoriesResult.success && categoriesResult.categories) {
        setCategories(categoriesResult.categories);
      } else {
        throw new Error(categoriesResult.error || 'Kategoriler yüklenemedi');
      }

      if (modelsResult.success && modelsResult.models) {
        setModels(modelsResult.models);
      } else {
        throw new Error(modelsResult.error || 'Modeller yüklenemedi');
      }
    } catch (err) {
      console.error('Device model selector data loading error:', err);
      setError(err instanceof Error ? err.message : 'Veri yükleme hatası');
    } finally {
      setLoading(false);
    }
  };

  const filterModels = () => {
    let filtered = models;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(model => model.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(model => 
        model.name.toLowerCase().includes(searchLower) ||
        model.model_name.toLowerCase().includes(searchLower)
      );
    }

    // Sort by sort_order and name
    filtered.sort((a, b) => {
      if (a.sort_order !== b.sort_order) {
        return a.sort_order - b.sort_order;
      }
      return a.name.localeCompare(b.name, 'tr-TR');
    });

    setFilteredModels(filtered);
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleModelSelect = (model: DeviceModelData) => {
    onModelChange(model.name, model);
  };

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'iPhone': return '📱';
      case 'iPad': return '📱';
      case 'Apple Watch': return '⌚';
      case 'AirPods': return '🎧';
      default: return '📱';
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg border border-gray-100 p-6 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-600">Cihaz modelleri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl shadow-lg border border-red-200 p-6 ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
          </div>
          <p className="text-red-600 mb-3">{error}</p>
          <button
            onClick={loadData}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Cihaz Modeli Seçin</h3>
            <p className="text-blue-100 text-sm">
              {models.length} model arasından seçim yapın
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Cihaz modeli ara... (örn: iPhone 15 Pro)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tüm Kategoriler ({models.length})
            </button>
            {categories.map((category) => {
              const categoryCount = models.filter(model => model.category === category).length;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getCategoryIcon(category)} {category} ({categoryCount})
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-4 text-sm text-gray-600">
          {filteredModels.length} model bulundu
          {searchTerm && ` - "${searchTerm}" için`}
          {selectedCategory && ` - ${selectedCategory} kategorisinde`}
        </div>

        {/* Model List */}
        <div className="max-h-96 overflow-y-auto space-y-2">
          {filteredModels.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                </svg>
              </div>
              <p className="text-gray-600">Aradığınız kriterlere uygun model bulunamadı</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
                className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                Filtreleri temizle
              </button>
            </div>
          ) : (
            filteredModels.map((model) => (
              <div
                key={model.id}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  selectedModel === model.name
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleModelSelect(model)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-grow">
                    {/* Selection Radio */}
                    <div className="flex-shrink-0 mr-4">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedModel === model.name
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedModel === model.name && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>

                    {/* Model Info */}
                    <div className="flex-grow">
                      <div className="flex items-center mb-1">
                        <span className="text-lg mr-2">
                          {getCategoryIcon(model.category)}
                        </span>
                        <h4 className="font-semibold text-gray-900">
                          {model.name}
                        </h4>
                        {selectedModel === model.name && (
                          <svg className="w-5 h-5 text-green-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{model.model_name}</p>
                      {model.specifications && (
                        <p className="text-xs text-gray-500">{model.specifications}</p>
                      )}
                    </div>
                  </div>

                  {/* Pricing Info */}
                  {showPricing && (
                    <div className="text-right ml-4">
                      <p className="text-sm text-gray-600">Onarım Ücreti</p>
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(model.repair_price)}
                      </p>
                      <p className="text-xs text-green-600">
                        iFoundAnApple: {formatPrice(model.ifoundanapple_fee)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Model Summary */}
        {selectedModel && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Seçilen Model</p>
                    <p className="text-blue-700">{selectedModel}</p>
                  </div>
                </div>
                <button
                  onClick={() => onModelChange('', undefined)}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  Değiştir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceModelSelector;
