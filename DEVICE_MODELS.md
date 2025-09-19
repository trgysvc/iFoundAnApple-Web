# 📱 Apple Device Models Database

Bu dosya, sistemde desteklenen güncel Apple cihaz modellerini listeler.

## 📊 Cihaz Kategorileri

### 📱 iPhone (49 Model)
#### Complete iPhone History (2007-2025)
**Latest Models (2024-2025):**
- iPhone 16 Pro Max, iPhone 16 Pro, iPhone 16 Plus, iPhone 16
- iPhone 15 Pro Max, iPhone 15 Pro, iPhone 15 Plus, iPhone 15
- iPhone 14 Pro Max, iPhone 14 Pro, iPhone 14 Plus, iPhone 14
- iPhone 13 Pro Max, iPhone 13 Pro, iPhone 13 Mini, iPhone 13
- iPhone 12 Pro Max, iPhone 12 Pro, iPhone 12 Mini, iPhone 12

**SE Series:**
- iPhone SE (3rd gen), iPhone SE (2nd gen), iPhone SE (1st gen)

**Classic Models:**
- iPhone 11 Pro Max, iPhone 11 Pro, iPhone 11
- iPhone XS Max, iPhone XS, iPhone XR, iPhone X
- iPhone 8 Plus, iPhone 8, iPhone 7 Plus, iPhone 7
- iPhone 6S Plus, iPhone 6S, iPhone 6 Plus, iPhone 6
- iPhone 5S, iPhone 5C, iPhone 5
- iPhone 4S, iPhone 4, iPhone 3GS, iPhone 3G, iPhone 2G (1st gen)

**Future Models (Expected):**
- iPhone 17 Pro Max, iPhone 17 Pro, iPhone 17
- iPhone Air, iPhone 16e

---

### 📟 iPad (95 Model)
#### Complete iPad History (2010-2025)
**iPad Pro Series:** 13 models (9.7", 10.5", 11", 12.9", 13" with various generations)
**iPad Air Series:** 7 models (1st gen to M2)
**iPad Standard Series:** 11 models (1st to 11th generation)  
**iPad mini Series:** 7 models (1st to 7th generation)

**Latest Models:**
- iPad Pro 13-inch (M4), iPad Pro 11-inch (M4)
- iPad Air 13-inch (M2), iPad Air 11-inch (M2)
- iPad (11th generation), iPad mini (7th generation)

---

### 💻 Mac (89 Model)

#### MacBook Air
- MacBook Air 15-inch (M3) - 2024
- MacBook Air 13-inch (M3) - 2024
- MacBook Air 15-inch (M2) - 2023
- MacBook Air 13-inch (M2) - 2022
- MacBook Air 13-inch (M1) - 2020

#### MacBook Pro
**2024 Series:**
- MacBook Pro 16-inch (M4 Pro)
- MacBook Pro 14-inch (M4 Pro)

**2023 Series:**
- MacBook Pro 16-inch (M3 Max)
- MacBook Pro 14-inch (M3 Max)
- MacBook Pro 16-inch (M3 Pro)
- MacBook Pro 14-inch (M3 Pro)
- MacBook Pro 16-inch (M2 Max)
- MacBook Pro 14-inch (M2 Max)
- MacBook Pro 16-inch (M2 Pro)
- MacBook Pro 14-inch (M2 Pro)

**2022 Series:**
- MacBook Pro 13-inch (M2)

**2021 Series:**
- MacBook Pro 16-inch (M1 Max)
- MacBook Pro 14-inch (M1 Max)
- MacBook Pro 16-inch (M1 Pro)
- MacBook Pro 14-inch (M1 Pro)

**2020 Series:**
- MacBook Pro 13-inch (M1)

#### iMac
- iMac 24-inch (M4) - 2024
- iMac 24-inch (M3) - 2023
- iMac 24-inch (M1) - 2021
- iMac Pro 27-inch (M4 Pro) - 2024

#### Mac Studio
- Mac Studio (M4 Max) - 2024
- Mac Studio (M4 Ultra) - 2024
- Mac Studio (M2 Max) - 2023
- Mac Studio (M2 Ultra) - 2023
- Mac Studio (M1 Max) - 2022
- Mac Studio (M1 Ultra) - 2022

#### Mac Pro
- Mac Pro (M2 Ultra) - 2023

#### Mac mini
- Mac mini (M4) - 2024
- Mac mini (M4 Pro) - 2024
- Mac mini (M2) - 2023
- Mac mini (M2 Pro) - 2023
- Mac mini (M1) - 2020

---

### ⌚ Apple Watch (9 Models)
- Apple Watch Series 10 - 2024
- Apple Watch Ultra 2 - 2023
- Apple Watch Series 9 - 2023
- Apple Watch Ultra - 2022
- Apple Watch Series 8 - 2022
- Apple Watch SE (2nd generation) - 2022
- Apple Watch Series 7 - 2021
- Apple Watch Series 6 - 2020
- Apple Watch SE (1st generation) - 2020

---

### 🎧 AirPods (6 Models)
- AirPods 4 - 2024
- AirPods Pro (2nd generation) - 2022
- AirPods (3rd generation) - 2021
- AirPods Pro (1st generation) - 2019
- AirPods (2nd generation) - 2019
- AirPods Max - 2020

---

### 📺 Apple TV (3 Models)
- Apple TV 4K (3rd generation) - 2022
- Apple TV 4K (2nd generation) - 2021
- Apple TV HD - 2015

---

### 🖱️ Accessories (15+ Models)
#### Magic Keyboards for iPad
- Magic Keyboard for iPad Pro 13-inch (M4) - 2024
- Magic Keyboard for iPad Pro 11-inch (M4) - 2024
- Magic Keyboard for iPad Air 13-inch (M2) - 2024
- Magic Keyboard for iPad Air 11-inch (M2) - 2024

#### Apple Pencil
- Apple Pencil Pro - 2024
- Apple Pencil (2nd generation) - 2018
- Apple Pencil (1st generation) - 2015

#### Mac Accessories
- Magic Mouse - 2021
- Magic Trackpad - 2021
- Magic Keyboard - 2021
- Magic Keyboard with Touch ID - 2021

#### Displays
- Studio Display - 2022
- Pro Display XDR - 2019

---

## 🔄 Güncelleme Süreci

### Yeni Model Ekleme
1. `database/update_device_models.sql` dosyasını düzenle
2. Yeni modelleri ekle
3. Supabase SQL Editor'da çalıştır
4. Bu dosyayı güncelle

### Renk Desteği
Her cihaz modeli için uygun renkler `constants.ts` dosyasındaki `APPLE_DEVICE_COLORS` objesinde tanımlanmıştır.

### Kategori Bazlı Filtreleme
Cihazlar kategori bazında gruplanmıştır:
- `iPhone`
- `iPad` 
- `Mac`
- `Apple Watch`
- `AirPods`
- `Apple TV`
- `Accessories`

---

## 📈 İstatistikler

| Kategori | Model Sayısı | Yıl Aralığı |
|----------|--------------|-------------|
| iPhone | 49 | 2007-2025 |
| iPad | 38 | 2010-2025 |
| Mac | 89 | 2009-2025 |
| Apple Watch | 15 | 2014-2024 |
| AirPods | 9 | 2016-2024 |
| Apple TV | 7 | 2007-2022 |
| HomePod | 3 | 2017-2023 |
| iPod | 23 | 2001-2019 |
| Accessories | 25+ | 2009-2024 |
| **TOPLAM** | **250+** | **2001-2025** |

---

**Son Güncelleme:** Ocak 2025  
**Versiyon:** 2.0.0  
**Durum:** ✅ Production Ready
