-- Mevcut ücretli modelleri kontrol et
SELECT 
    name,
    category,
    repair_price,
    ifoundanapple_fee,
    total_price,
    created_at
FROM device_models 
WHERE repair_price > 0 OR ifoundanapple_fee > 0 OR total_price > 0
ORDER BY category, total_price DESC;

-- Kategori bazında ücretli model sayısı
SELECT 
    category,
    COUNT(*) as models_with_price,
    AVG(repair_price) as avg_repair_price,
    MAX(total_price) as max_total_price,
    MIN(total_price) as min_total_price
FROM device_models 
WHERE total_price > 0
GROUP BY category
ORDER BY models_with_price DESC;

-- Toplam model sayıları
SELECT 
    'Ücretli Modeller' as type,
    COUNT(*) as count
FROM device_models 
WHERE total_price > 0

UNION ALL

SELECT 
    'Ücretsiz Modeller' as type,
    COUNT(*) as count
FROM device_models 
WHERE total_price = 0

UNION ALL

SELECT 
    'Toplam Modeller' as type,
    COUNT(*) as count
FROM device_models;
