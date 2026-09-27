import { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from './theme';

export function Loading() { return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>; }
export function ErrorState({ error, retry }: { error: unknown; retry: () => void }) {
  return <View style={styles.center}><Text style={styles.errorIcon}>☁</Text><Text style={styles.errorTitle}>Không kết nối được backend</Text><Text style={styles.errorBody}>{String(error)}</Text><Pressable style={styles.button} onPress={retry}><Text style={styles.buttonText}>Thử lại</Text></Pressable></View>;
}
export function Header({ title, back, right }: { title: string; back?: () => void; right?: ReactNode }) {
  return <View style={styles.header}><View style={styles.headerSide}>{back && <Pressable style={styles.backButton} onPress={back} hitSlop={12}><Text style={styles.back}>‹</Text></Pressable>}</View><Text numberOfLines={1} style={styles.headerTitle}>{title}</Text><View style={[styles.headerSide, styles.right]}>{right}</View></View>;
}
const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 10 }, errorIcon: { fontSize: 48 }, errorTitle: { fontWeight: '800', fontSize: 18, color: colors.text }, errorBody: { color: colors.muted, textAlign: 'center', maxWidth: 480 }, button: { backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 12, marginTop: 8 }, buttonText: { color: 'white', fontWeight: '700' },
  header: { minHeight: 72, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background }, headerSide: { width: 48 }, right: { alignItems: 'flex-end' }, headerTitle: { flex: 1, textAlign: 'center', fontSize: 19, fontWeight: '900', color: colors.text, letterSpacing: -0.3 }, backButton: { width: 38, height: 38, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }, back: { fontSize: 32, lineHeight: 34, color: colors.primary },
});
