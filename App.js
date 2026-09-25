import React, { useRef } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
// GERÇEK Game Center bağlantısı bu kütüphane ile sağlanıyor.
// Kurulum: npx expo install react-native-game-center
// NOT: Bu kütüphane native kod içerir, bu yüzden "Expo Go" uygulamasında ÇALIŞMAZ.
// Test etmek için "npx eas build --profile development --platform ios" ile
// bir development build oluşturman gerekir (Mac gerekmez, bulutta derlenir).
import GameCenter from 'react-native-game-center';

export default function App() {
  const webviewRef = useRef(null);

  // Oyundan (HTML) gelen mesajları yakala
  const handleMessage = async (event) => {
    let data;
    try {
      data = JSON.parse(event.nativeEvent.data);
    } catch (e) {
      return;
    }

    if (data.type === 'GAME_CENTER_LOGIN') {
      try {
        const result = await GameCenter.authenticateLocalPlayer();
        // result.playerName / result.isAuthenticated kütüphaneye göre değişebilir,
        // react-native-game-center dokümantasyonundan dönen alan adlarını doğrula
        sendToWeb({
          type: 'GAME_CENTER_RESULT',
          success: true,
          playerName: result?.alias || result?.playerName || 'Oyuncu',
        });
      } catch (err) {
        sendToWeb({ type: 'GAME_CENTER_RESULT', success: false });
      }
    }

    if (data.type === 'SUBMIT_SCORE') {
      try {
        // 'nova_drift_leaderboard' kısmını App Store Connect'te oluşturduğun
        // liderlik tablosunun Leaderboard ID'si ile değiştir
        await GameCenter.submitScore({
          score: data.score,
          leaderboardId: 'nova_drift_leaderboard',
        });
      } catch (err) {
        // Skor gönderimi başarısız olursa oyunu bozmasın, sessizce geç
      }
    }
  };

  const sendToWeb = (payload) => {
    const js = `window.postMessage(${JSON.stringify(JSON.stringify(payload))}, '*'); true;`;
    webviewRef.current?.injectJavaScript(js);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <WebView
        ref={webviewRef}
        source={
          Platform.OS === 'web'
            ? { uri: './assets/game.html' }
            : require('./assets/game.html')
        }
        style={styles.webview}
        onMessage={handleMessage}
        originWhitelist={['*']}
        allowsInlineMediaPlayback
        bounces={false}
        scrollEnabled={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e1f' },
  webview: { flex: 1, backgroundColor: '#0a0e1f' },
});
