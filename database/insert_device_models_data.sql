-- Apple Cihaz Modelleri ve Onarım Ücretleri
-- iFoundAnApple için güncel fiyat listesi

-- Önce mevcut verileri temizle (eğer varsa)
DELETE FROM public.device_models;

-- Apple Watch Serisi
INSERT INTO public.device_models (name, category, model_name, specifications, repair_price, ifoundanapple_fee, fee_percentage, is_active, sort_order) VALUES
('Apple Watch Ultra 2', 'Apple Watch', 'Apple Watch Ultra 2', 'Tüm modeller', 13629.00, 1362.90, 10.00, true, 1),
('Apple Watch Ultra', 'Apple Watch', 'Apple Watch Ultra', 'Tüm modeller', 12049.00, 1204.90, 10.00, true, 2),
('Apple Watch Series 9 45mm', 'Apple Watch', 'Apple Watch Series 9', '45 mm (Alüminyum)', 7799.00, 779.90, 10.00, true, 3),
('Apple Watch Series 9 41mm', 'Apple Watch', 'Apple Watch Series 9', '41 mm (Alüminyum)', 6999.00, 699.90, 10.00, true, 4),
('Apple Watch Series 8 45mm', 'Apple Watch', 'Apple Watch Series 8', '45 mm (Alüminyum)', 7049.00, 704.90, 10.00, true, 5),
('Apple Watch Series 8 41mm', 'Apple Watch', 'Apple Watch Series 8', '41 mm (Alüminyum)', 6279.00, 627.90, 10.00, true, 6),
('Apple Watch SE 2nd Gen 44mm', 'Apple Watch', 'Apple Watch SE (2. nesil)', '44 mm (Alüminyum)', 4899.00, 489.90, 10.00, true, 7),
('Apple Watch SE 2nd Gen 40mm', 'Apple Watch', 'Apple Watch SE (2. nesil)', '40 mm (Alüminyum)', 4419.00, 441.90, 10.00, true, 8),
('Apple Watch Series 7 45mm', 'Apple Watch', 'Apple Watch Series 7', '45 mm (Alüminyum)', 6279.00, 627.90, 10.00, true, 9),
('Apple Watch Series 7 41mm', 'Apple Watch', 'Apple Watch Series 7', '41 mm (Alüminyum)', 5599.00, 559.90, 10.00, true, 10),
('Apple Watch SE 1st Gen 44mm', 'Apple Watch', 'Apple Watch SE (1. nesil)', '44 mm (Alüminyum)', 4419.00, 441.90, 10.00, true, 11),
('Apple Watch SE 1st Gen 40mm', 'Apple Watch', 'Apple Watch SE (1. nesil)', '40 mm (Alüminyum)', 3999.00, 399.90, 10.00, true, 12),
('Apple Watch Series 6 44mm', 'Apple Watch', 'Apple Watch Series 6', '44 mm (Alüminyum)', 5599.00, 559.90, 10.00, true, 13),
('Apple Watch Series 6 40mm', 'Apple Watch', 'Apple Watch Series 6', '40 mm (Alüminyum)', 4899.00, 489.90, 10.00, true, 14),
('Apple Watch Series 5 44mm', 'Apple Watch', 'Apple Watch Series 5', '44 mm (Alüminyum)', 4419.00, 441.90, 10.00, true, 15),
('Apple Watch Series 5 40mm', 'Apple Watch', 'Apple Watch Series 5', '40 mm (Alüminyum)', 3999.00, 399.90, 10.00, true, 16),
('Apple Watch Series 4 44mm', 'Apple Watch', 'Apple Watch Series 4', '44 mm (Alüminyum)', 3999.00, 399.90, 10.00, true, 17),
('Apple Watch Series 4 40mm', 'Apple Watch', 'Apple Watch Series 4', '40 mm (Alüminyum)', 3499.00, 349.90, 10.00, true, 18),
('Apple Watch Series 3 42mm', 'Apple Watch', 'Apple Watch Series 3', '42 mm (Alüminyum)', 2899.00, 289.90, 10.00, true, 19),
('Apple Watch Series 3 38mm', 'Apple Watch', 'Apple Watch Series 3', '38 mm (Alüminyum)', 2649.00, 264.90, 10.00, true, 20);

-- AirPods Serisi
INSERT INTO public.device_models (name, category, model_name, specifications, repair_price, ifoundanapple_fee, fee_percentage, is_active, sort_order) VALUES
('AirPods Pro 2nd Gen USB-C', 'AirPods', 'AirPods Pro (2. nesil)', 'Her bir AirPod veya şarj kutusu için (USB-C)', 3089.00, 308.90, 10.00, true, 101),
('AirPods Pro 2nd Gen Lightning', 'AirPods', 'AirPods Pro (2. nesil)', 'Her bir AirPod veya şarj kutusu için (Lightning)', 3089.00, 308.90, 10.00, true, 102),
('AirPods 3rd Gen', 'AirPods', 'AirPods (3. nesil)', 'Her bir AirPod veya şarj kutusu için', 2649.00, 264.90, 10.00, true, 103),
('AirPods Pro 1st Gen', 'AirPods', 'AirPods Pro (1. nesil)', 'Her bir AirPod veya şarj kutusu için', 2649.00, 264.90, 10.00, true, 104),
('AirPods Max', 'AirPods', 'AirPods Max', 'Tek ünite için', 8399.00, 839.90, 10.00, true, 105),
('AirPods 2nd Gen', 'AirPods', 'AirPods (2. nesil)', 'Her bir AirPod veya şarj kutusu için', 2219.00, 221.90, 10.00, true, 106),
('AirPods 1st Gen', 'AirPods', 'AirPods (1. nesil)', 'Her bir AirPod veya şarj kutusu için', 1959.00, 195.90, 10.00, true, 107);

-- iPad Serisi (En popüler modeller)
INSERT INTO public.device_models (name, category, model_name, specifications, repair_price, ifoundanapple_fee, fee_percentage, is_active, sort_order) VALUES
('iPad Pro 13 inch M4', 'iPad', 'iPad Pro 13 inç (M4)', '', 18069.00, 1806.90, 10.00, true, 201),
('iPad Pro 11 inch M4', 'iPad', 'iPad Pro 11 inç (M4)', '', 14199.00, 1419.90, 10.00, true, 202),
('iPad Pro 12.9 inch 6th Gen', 'iPad', 'iPad Pro 12,9 inç (6. nesil)', '', 16599.00, 1659.90, 10.00, true, 203),
('iPad Pro 11 inch 4th Gen', 'iPad', 'iPad Pro 11 inç (4. nesil)', '', 12049.00, 1204.90, 10.00, true, 204),
('iPad Air 13 inch M2', 'iPad', 'iPad Air 13 inç (M2)', '', 12049.00, 1204.90, 10.00, true, 205),
('iPad Air 11 inch M2', 'iPad', 'iPad Air 11 inç (M2)', '', 9899.00, 989.90, 10.00, true, 206),
('iPad 10th Gen', 'iPad', 'iPad (10. nesil)', '', 8399.00, 839.90, 10.00, true, 207),
('iPad Air 5th Gen', 'iPad', 'iPad Air (5. nesil)', '', 8399.00, 839.90, 10.00, true, 208),
('iPad mini 6th Gen', 'iPad', 'iPad mini (6. nesil)', '', 7799.00, 779.90, 10.00, true, 209),
('iPad 9th Gen', 'iPad', 'iPad (9. nesil)', '', 5599.00, 559.90, 10.00, true, 210);

-- iPhone Serisi (En popüler modeller)
INSERT INTO public.device_models (name, category, model_name, specifications, repair_price, ifoundanapple_fee, fee_percentage, is_active, sort_order) VALUES
('iPhone 15 Pro Max', 'iPhone', 'iPhone 15 Pro Max', '', 24399.00, 2439.90, 10.00, true, 301),
('iPhone 15 Pro', 'iPhone', 'iPhone 15 Pro', '', 21399.00, 2139.90, 10.00, true, 302),
('iPhone 15 Plus', 'iPhone', 'iPhone 15 Plus', '', 17599.00, 1759.90, 10.00, true, 303),
('iPhone 15', 'iPhone', 'iPhone 15', '', 16599.00, 1659.90, 10.00, true, 304),
('iPhone 14 Pro Max', 'iPhone', 'iPhone 14 Pro Max', '', 21399.00, 2139.90, 10.00, true, 305),
('iPhone 14 Pro', 'iPhone', 'iPhone 14 Pro', '', 19599.00, 1959.90, 10.00, true, 306),
('iPhone 14 Plus', 'iPhone', 'iPhone 14 Plus', '', 15799.00, 1579.90, 10.00, true, 307),
('iPhone 14', 'iPhone', 'iPhone 14', '', 14199.00, 1419.90, 10.00, true, 308),
('iPhone 13 Pro Max', 'iPhone', 'iPhone 13 Pro Max', '', 17599.00, 1759.90, 10.00, true, 309),
('iPhone 13 Pro', 'iPhone', 'iPhone 13 Pro', '', 15799.00, 1579.90, 10.00, true, 310),
('iPhone 13', 'iPhone', 'iPhone 13', '', 13629.00, 1362.90, 10.00, true, 311),
('iPhone 13 mini', 'iPhone', 'iPhone 13 mini', '', 13629.00, 1362.90, 10.00, true, 312),
('iPhone SE 3rd Gen', 'iPhone', 'iPhone SE (3. nesil)', '', 9899.00, 989.90, 10.00, true, 313),
('iPhone 12 Pro Max', 'iPhone', 'iPhone 12 Pro Max', '', 15799.00, 1579.90, 10.00, true, 314),
('iPhone 12 Pro', 'iPhone', 'iPhone 12 Pro', '', 14199.00, 1419.90, 10.00, true, 315),
('iPhone 12', 'iPhone', 'iPhone 12', '', 12049.00, 1204.90, 10.00, true, 316),
('iPhone 12 mini', 'iPhone', 'iPhone 12 mini', '', 12049.00, 1204.90, 10.00, true, 317),
('iPhone 11 Pro Max', 'iPhone', 'iPhone 11 Pro Max', '', 14199.00, 1419.90, 10.00, true, 318),
('iPhone 11 Pro', 'iPhone', 'iPhone 11 Pro', '', 12049.00, 1204.90, 10.00, true, 319),
('iPhone 11', 'iPhone', 'iPhone 11', '', 10449.00, 1044.90, 10.00, true, 320),
('iPhone SE 2nd Gen', 'iPhone', 'iPhone SE (2. nesil)', '', 8399.00, 839.90, 10.00, true, 321),
('iPhone XR', 'iPhone', 'iPhone XR', '', 8399.00, 839.90, 10.00, true, 322),
('iPhone XS Max', 'iPhone', 'iPhone XS Max', '', 10449.00, 1044.90, 10.00, true, 323),
('iPhone XS', 'iPhone', 'iPhone XS', '', 8399.00, 839.90, 10.00, true, 324),
('iPhone X', 'iPhone', 'iPhone X', '', 8399.00, 839.90, 10.00, true, 325);

-- Kontrol sorgusu
SELECT 
  category,
  COUNT(*) as model_count,
  MIN(repair_price) as min_price,
  MAX(repair_price) as max_price,
  AVG(repair_price) as avg_price
FROM public.device_models 
WHERE is_active = true
GROUP BY category
ORDER BY category;
