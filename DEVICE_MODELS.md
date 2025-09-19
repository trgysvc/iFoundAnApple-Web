# 📱 Apple Device Models Database

Bu dosya, sistemde desteklenen güncel Apple cihaz modellerini listeler.

## 📊 Cihaz Kategorileri

### 📱 iPhone (22 Model)
#### 2024 Series
- iPhone 16 Pro Max
- iPhone 16 Pro  
- iPhone 16 Plus
- iPhone 16

#### 2023 Series
- iPhone 15 Pro Max
- iPhone 15 Pro
- iPhone 15 Plus
- iPhone 15

#### 2022 Series
- iPhone 14 Pro Max
- iPhone 14 Pro
- iPhone 14 Plus
- iPhone 14

#### 2021 Series
- iPhone 13 Pro Max
- iPhone 13 Pro
- iPhone 13 mini
- iPhone 13

#### 2020 Series
- iPhone 12 Pro Max
- iPhone 12 Pro
- iPhone 12 mini
- iPhone 12

#### SE Series
- iPhone SE (3rd generation) - 2022
- iPhone SE (2nd generation) - 2020

---

### 📟 iPad (12+ Models)
#### 2024 Series
- iPad Pro 13-inch (M4)
- iPad Pro 11-inch (M4)
- iPad Air 13-inch (M2)
- iPad Air 11-inch (M2)

#### 2022-2023 Series
- iPad (10th generation) - 2022
- iPad Air (5th generation) - 2022

#### 2021 Series
- iPad mini (6th generation)
- iPad Pro 12.9-inch (5th generation)
- iPad Pro 11-inch (3rd generation)
- iPad (9th generation)

#### 2020 Series
- iPad Air (4th generation)
- iPad (8th generation)

---

### 💻 Mac (35+ Models)

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
| iPhone | 22+ | 2020-2024 |
| iPad | 12+ | 2020-2024 |
| Mac | 35+ | 2020-2024 |
| Apple Watch | 9 | 2020-2024 |
| AirPods | 6 | 2019-2024 |
| Apple TV | 3 | 2015-2022 |
| Accessories | 15+ | 2015-2024 |
| **TOPLAM** | **100+** | **2015-2024** |

---

**Son Güncelleme:** Ocak 2025  
**Versiyon:** 2.0.0  
**Durum:** ✅ Production Ready
