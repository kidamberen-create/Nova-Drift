# Nova Drift — App Store'a Çıkarma Rehberi (Mac Gerekmez)

Bu klasör, oyununu gerçek bir iOS/Android uygulamasına çeviren ve **bulutta derleyip
Mac olmadan App Store'a gönderebilmeni sağlayan** bir Expo (React Native) projesidir.

## Ne var ne yok

- ✅ Oyunun tamamı `assets/game.html` içinde — zaten çalışan web sürümünün aynısı
- ✅ `App.js` bu oyunu telefonun içinde tam ekran açan bir "kabuk"
- ✅ Gerçek Game Center girişi ve skor gönderme kodu hazır (`react-native-game-center`)
- ⚠️ Bu kütüphane native kod içerdiği için **Expo Go uygulamasında test edilemez** —
  "development build" almalısın (aşağıda anlatıyorum, yine Mac gerekmez)

## Adım Adım

### 1. Gerekli programları kur (Windows/Linux/Mac fark etmez)
- [Node.js](https://nodejs.org) indir ve kur (LTS sürümü)
- Terminal/CMD aç, şunu çalıştır: `npm install -g eas-cli`

### 2. Ücretsiz hesaplar aç
- [expo.dev](https://expo.dev) üzerinden ücretsiz bir Expo hesabı
- [developer.apple.com](https://developer.apple.com) üzerinden Apple Developer hesabı
  (yıllık 99$ — App Store'a yayınlamak için şart, test için de gerekli)

### 3. Bu klasörde bağımlılıkları kur
```
cd nova-drift-app
npm install
```

### 4. Expo hesabınla giriş yap ve projeyi bağla
```
eas login
eas build:configure
```

### 5. `app.json` içindeki bundleIdentifier'ı değiştir
`com.SENIN_ADIN.novadrift` yazan yeri kendi ismin/şirket adınla değiştir
(örnek: `com.ahmetyilmaz.novadrift`). Hem `ios` hem `android` altında.

### 6. Bulutta derlet (Mac'e gerek yok, Apple'ın sunucuları değil EAS'in
   bulutu bunu senin için bir Mac üzerinde arka planda yapıyor)
```
eas build --platform ios --profile development
```
Bu komut birkaç dakika sürer, bitince sana bir link/QR kod verir — telefonuna
kurup gerçek cihazda test edebilirsin.

### 7. Game Center'ı App Store Connect'te ayarla
- developer.apple.com → App Store Connect → uygulamanı oluştur
- "Game Center" sekmesinden bir liderlik tablosu (leaderboard) oluştur
- Oluşturduğun Leaderboard ID'yi kopyala, `App.js` içinde
  `leaderboardId: 'nova_drift_leaderboard'` kısmına yapıştır

### 8. App Store'a gönder
Her şey test edilip hazır olduğunda:
```
eas build --platform ios --profile production
eas submit --platform ios
```

## Takıldığın yerde

Her adımda bana terminalde gördüğün hata mesajını yapıştırman yeterli,
birlikte çözeriz. Expo'nun resmi dokümantasyonu da çok iyidir: docs.expo.dev
