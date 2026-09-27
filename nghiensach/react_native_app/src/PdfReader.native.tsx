import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export function PdfReader({ uri }: { uri: string }) {
  return <View style={styles.container}><WebView source={{ uri }} style={styles.webview} cacheEnabled={false} incognito allowsInlineMediaPlayback /></View>;
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#dfe4e0' }, webview: { flex: 1 } });
