import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Image, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';

import { api } from './src/api';
import { ErrorState, Header, Loading } from './src/components';
import { colors } from './src/theme';
import { PdfReader } from './src/PdfReader';
import type { Book, Category, Chapter, ProcessingStatus, Screen } from './src/types';

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' });
  const [history, setHistory] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const tab = screen.name === 'home' ? screen.tab || 'home' : undefined;
  const openTab = (next: 'home' | 'categories' | 'library' | 'gifts') => setScreen({ name: 'home', tab: next });
  const toggleFavorite = (bookId: number) => setFavorites((items) => items.includes(bookId) ? items.filter((id) => id !== bookId) : [...items, bookId]);
  const openBook = (bookId: number) => setScreen({ name: 'book', bookId });
  return <SafeAreaView style={styles.safe}>
    <StatusBar style="dark" />
    {screen.name === 'home' && <><HomeScreen tab={tab!} openBook={openBook} openTab={openTab} openCategory={(id, name) => setScreen({ name: 'categoryBooks', categoryId: id, categoryName: name })} history={history} favorites={favorites} toggleFavorite={toggleFavorite} />{Platform.OS !== 'web' && <BottomBar active={tab!} onChange={openTab} />}</>}
    {screen.name === 'categoryBooks' && <CategoryBooksScreen categoryId={screen.categoryId} categoryName={screen.categoryName} back={() => setScreen({ name: 'home', tab: 'categories' })} openBook={openBook} />}
    {screen.name === 'book' && <BookScreen bookId={screen.bookId} back={() => setScreen({ name: 'home', tab: 'home' })} play={(chapter, chapters) => { void api.startListening(chapter.id); setHistory((items) => [chapter.book_id, ...items.filter((id) => id !== chapter.book_id)].slice(0, 10)); setScreen({ name: 'player', chapter, chapters }); }} />}
    {screen.name === 'player' && <PlayerScreen chapter={screen.chapter} chapters={screen.chapters} back={() => setScreen({ name: 'book', bookId: screen.chapter.book_id })} />}
  </SafeAreaView>;
}

function HomeScreen({ tab, openBook, openTab, openCategory, history, favorites, toggleFavorite }: { tab: 'home' | 'categories' | 'library' | 'gifts'; openBook: (id: number) => void; openTab: (tab: 'home' | 'categories' | 'library' | 'gifts') => void; openCategory: (id: number, name: string) => void; history: number[]; favorites: number[]; toggleFavorite: (id: number) => void }) {
  const { width } = useWindowDimensions();
  const columns = width >= 1100 ? 4 : width >= 720 ? 3 : 2;
  const [categories, setCategories] = useState<Category[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [categoryId, setCategoryId] = useState<number>();
  const [homeMode, setHomeMode] = useState<'new' | 'hot'>('new');
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>();
  const load = useCallback(async (cursor?: string) => {
    setLoading(true); setError(undefined);
    try { const [c, page] = await Promise.all([api.categories(), api.books({ categoryId, q: query, cursor, sort: homeMode })]); setCategories(c); setBooks((current) => cursor ? [...current, ...page.items] : page.items); setNextCursor(page.next_cursor); }
    catch (cause) { setError(cause); } finally { setLoading(false); }
  }, [categoryId, query, homeMode]);
  useEffect(() => { setShowAll(false); void load(); }, [load]);
  if (tab === 'gifts') return <GiftScreen />;
  if (tab === 'library') return <LibraryScreen books={books} history={history} favorites={favorites} openBook={openBook} toggleFavorite={toggleFavorite} />;
  if (tab === 'categories') return <CategoryScreen2 categories={categories} onOpenBooks={openCategory} />;
  return <View style={styles.fill}><Header title="📚 Nghiện Sách" right={<Pressable style={styles.floatingSearch} onPress={() => setSearchOpen((value) => !value)}><Ionicons name={searchOpen ? 'close' : 'search'} size={21} color="white" /></Pressable>} />
    {searchOpen && <View style={styles.searchBox}><Ionicons name="search-outline" size={19} color={colors.muted} /><TextInput autoFocus value={query} onChangeText={setQuery} placeholder="Tìm tên sách, tác giả…" placeholderTextColor={colors.muted} style={styles.searchInput} returnKeyType="search" /></View>}
    {loading ? <Loading /> : error ? <ErrorState error={error} retry={load} /> : <FlatList
      key={columns} data={books} numColumns={columns} keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.library} columnWrapperStyle={styles.bookRow} refreshing={loading && !nextCursor} onRefresh={() => load()} onEndReached={() => { if (nextCursor && !loading) void load(nextCursor); }} onEndReachedThreshold={0.65}
      ListHeaderComponent={<><View style={styles.welcomeRow}><View><Text style={styles.kicker}>NGHIỆN SÁCH · DAILY EDITION</Text><Text style={styles.heroTitle}>Một chương sách,{"\n"}một khoảng trời riêng.</Text><Text style={styles.heroSubtitle}>Đọc chậm lại. Nghe sâu hơn.</Text></View><View style={styles.miniAvatar}><Text>NS</Text></View></View><View style={styles.featureBanner}><View style={styles.bannerOrbOne} /><View style={styles.bannerOrbTwo} /><View style={styles.bannerCopy}><Text style={styles.bannerEyebrow}>GỢI Ý HÔM NAY  •  15 PHÚT</Text><Text style={styles.bannerTitle}>Bắt đầu ngày mới{"\n"}bằng một câu chuyện.</Text><Text style={styles.bannerMeta}>Một lựa chọn nhỏ cho tâm trí nhẹ tênh.</Text><Pressable style={styles.bannerButton} onPress={() => books[0] && openBook(books[0].id)}><Text style={styles.bannerButtonText}>Mở trang sách  ↗</Text></Pressable></View><Text style={styles.bannerStamp}>✦</Text></View><View style={styles.sectionHeader}><View><Text style={styles.sectionOverline}>{homeMode === 'new' ? 'FRESH ON THE SHELF' : 'COMMUNITY FAVOURITES'}</Text><Text style={styles.sectionTitle}>{homeMode === 'new' ? 'Mới lên kệ' : 'Đang được yêu thích'}</Text></View><Pressable onPress={() => setShowAll(true)}><Text style={styles.seeAll}>Xem tất cả  ›</Text></Pressable></View><View style={styles.segment}><Chip label="Mới phát hành" selected={homeMode === 'new'} onPress={() => setHomeMode('new')} /><Chip label="Được yêu thích" selected={homeMode === 'hot'} onPress={() => setHomeMode('hot')} /></View>{showAll && <Text style={styles.showAllHint}>Đang hiển thị toàn bộ kết quả, kéo xuống để tải thêm</Text>}<View style={styles.topicHeader}><Text style={styles.sectionOverline}>EXPLORE BY MOOD</Text><Text style={styles.sectionTitle}>Chủ đề cho bạn</Text></View><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}><Chip label="Tất cả" selected={!categoryId} onPress={() => setCategoryId(undefined)} />{categories.map((c) => <Chip key={c.id} label={c.name} selected={categoryId === c.id} onPress={() => setCategoryId(c.id)} />)}</ScrollView></>}
      ListEmptyComponent={<Text style={styles.empty}>Chưa có sách trong thể loại này.</Text>}
      renderItem={({ item }) => <BookCard book={item} onPress={() => openBook(item.id)} favorite={favorites.includes(item.id)} onFavorite={() => toggleFavorite(item.id)} />}
    />}
  </View>;
}

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return <Pressable onPress={onPress} style={[styles.chip, selected && styles.chipSelected]}><Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text></Pressable>;
}

function categoryIcon(name: string) {
  if (/khoa|vũ trụ|sách/i.test(name)) return '✦';
  if (/gia đình|nấu|ẩm thực/i.test(name)) return '⌂';
  if (/văn học|tản văn|thơ/i.test(name)) return '◌';
  if (/phát triển|kỹ năng|tâm lý/i.test(name)) return '↗';
  if (/thiên nhiên|du lịch/i.test(name)) return '✿';
  return '✧';
}

function BottomBar({ active, onChange }: { active: 'home' | 'categories' | 'library' | 'gifts'; onChange: (tab: 'home' | 'categories' | 'library' | 'gifts') => void }) {
  const items = [['home', 'home-outline', 'Trang chủ'], ['categories', 'grid-outline', 'Thể loại'], ['library', 'library-outline', 'Thư viện'], ['gifts', 'gift-outline', 'Quà tặng']] as const;
  return <View style={styles.bottomBar}>{items.map(([key, icon, label]) => <Pressable key={key} onPress={() => onChange(key)} style={styles.bottomItem}><Ionicons name={active === key ? icon.replace('-outline', '') as never : icon as never} size={23} color={active === key ? colors.primary : colors.muted} /><Text style={[styles.bottomLabel, active === key && styles.bottomActive]}>{label}</Text></Pressable>)}</View>;
}

function CategoryScreen({ categories, selected, select, onOpenBooks }: { categories: Category[]; selected?: number; select: (id: number | undefined) => void; onOpenBooks: () => void }) {
  return <View style={styles.fill}><Header title="Thể loại" /><ScrollView contentContainerStyle={styles.categoryPage}><Text style={styles.heroTitle}>Chọn theo cảm hứng</Text><Text style={styles.heroSubtitle}>Mỗi chủ đề là một cánh cửa mới.</Text><View style={styles.categoryGrid}>{categories.map((category) => <Pressable key={category.id} onPress={() => { select(selected === category.id ? undefined : category.id); onOpenBooks(); }} style={[styles.categoryTile, selected === category.id && styles.categoryTileSelected]}><Text style={styles.categoryEmoji}>{category.name.includes('Khoa') ? '🔭' : category.name.includes('Gia đình') ? '🏡' : category.name.includes('Văn học') ? '🌼' : category.name.includes('Phát triển') ? '🌱' : '📚'}</Text><Text style={[styles.categoryName, selected === category.id && styles.categoryNameSelected]}>{category.name}</Text><Text style={styles.categoryDescription} numberOfLines={2}>{category.description}</Text></Pressable>)}</View></ScrollView></View>;
}

function CategoryScreen2({ categories, onOpenBooks }: { categories: Category[]; onOpenBooks: (id: number, name: string) => void }) {
  const [query, setQuery] = useState('');
  const visible = categories.filter((item) => `${item.name} ${item.description}`.toLowerCase().includes(query.toLowerCase()));
  return <View style={styles.fill}><Header title="Thể loại" /><ScrollView contentContainerStyle={styles.categoryPage}><View style={styles.searchBox}><Ionicons name="search-outline" size={19} color={colors.muted} /><TextInput value={query} onChangeText={setQuery} placeholder="Tìm thể loại…" placeholderTextColor={colors.muted} style={styles.searchInput} /></View><Text style={styles.heroTitle}>Chọn theo cảm hứng</Text><Text style={styles.heroSubtitle}>Mỗi chủ đề mở ra một trang sách riêng.</Text><View style={styles.categoryGrid}>{visible.map((category) => <Pressable key={category.id} onPress={() => onOpenBooks(category.id, category.name)} style={styles.categoryTile}><Text style={styles.categoryEmoji}>{categoryIcon(category.name)}</Text><Text style={styles.categoryName}>{category.name}</Text><Text style={styles.categoryDescription} numberOfLines={2}>{category.description}</Text><Text style={styles.seeAll}>Xem sách ›</Text></Pressable>)}</View></ScrollView></View>;
}

function CategoryBooksScreen({ categoryId, categoryName, back, openBook }: { categoryId: number; categoryName: string; back: () => void; openBook: (id: number) => void }) { const [books, setBooks] = useState<Book[]>([]); const [query, setQuery] = useState(''); const [cursor, setCursor] = useState<string | undefined>(); const load = useCallback(async (next?: string) => { const page = await api.books({ categoryId, q: query, cursor: next }); setBooks((current) => next ? [...current, ...page.items] : page.items); setCursor(page.next_cursor || undefined); }, [categoryId, query]); useEffect(() => { void load(); }, [load]); return <View style={styles.fill}><Header title={categoryName} back={back} /><View style={styles.searchBox}><Ionicons name="search-outline" size={19} color={colors.muted} /><TextInput value={query} onChangeText={setQuery} placeholder="Tìm trong chủ đề…" placeholderTextColor={colors.muted} style={styles.searchInput} /></View><FlatList data={books} numColumns={2} keyExtractor={(item) => String(item.id)} contentContainerStyle={styles.library} columnWrapperStyle={styles.bookRow} onEndReached={() => cursor && void load(cursor)} onEndReachedThreshold={0.7} renderItem={({ item }) => <BookCard book={item} onPress={() => openBook(item.id)} />} /></View>; }

function LibraryScreen({ books, history, favorites, openBook, toggleFavorite }: { books: Book[]; history: number[]; favorites: number[]; openBook: (id: number) => void; toggleFavorite: (id: number) => void }) {
  const [library, setLibrary] = useState<{ recent: Book[]; favorites: Book[] }>();
  useEffect(() => { void api.library().then(setLibrary).catch(() => undefined); }, []);
  const recent = library?.recent || books.filter((book) => history.includes(book.id));
  const saved = library?.favorites || books.filter((book) => favorites.includes(book.id));
  return <View style={styles.fill}><Header title="Thư viện" /><ScrollView contentContainerStyle={styles.libraryPage}><Text style={styles.heroTitle}>Kho sách của bạn</Text><Text style={styles.heroSubtitle}>Lưu lại những câu chuyện muốn đọc tiếp.</Text><Text style={styles.sectionTitle}>Đọc gần đây</Text>{recent.length ? recent.map((book) => <LibraryRow key={book.id} book={book} openBook={openBook} />) : <Text style={styles.mutedBlock}>Bạn chưa mở cuốn sách nào.</Text>}<Text style={styles.sectionTitle}>Yêu thích</Text>{saved.length ? saved.map((book) => <LibraryRow key={book.id} book={book} openBook={openBook} favorite onFavorite={() => toggleFavorite(book.id)} />) : <Text style={styles.mutedBlock}>Chạm ♡ trên bìa sách để lưu lại.</Text>}</ScrollView></View>;
}

function LibraryRow({ book, openBook, favorite, onFavorite }: { book: Book; openBook: (id: number) => void; favorite?: boolean; onFavorite?: () => void }) { return <Pressable style={styles.libraryRow} onPress={() => openBook(book.id)}><Image source={book.cover_url ? { uri: book.cover_url } : undefined} style={styles.libraryCover} /><View style={styles.libraryRowBody}><Text style={styles.bookTitle}>{book.title}</Text><Text style={styles.author}>{book.author}</Text><Text style={styles.chapterStatus}>Tiếp tục đọc ›</Text></View>{favorite && <Pressable onPress={onFavorite}><Text style={styles.favoriteText}>♥</Text></Pressable>}</Pressable>; }

function GiftScreen() { return <View style={styles.fill}><Header title="Quà tặng" /><ScrollView contentContainerStyle={styles.giftPage}><View style={styles.giftHero}><Text style={styles.giftIcon}>🎁</Text><Text style={styles.giftTitle}>Món quà mỗi ngày</Text><Text style={styles.giftCopy}>Một câu chuyện ngắn để bạn bắt đầu ngày mới nhẹ nhàng hơn.</Text><Pressable style={styles.giftButton}><Text style={styles.giftButtonText}>Mở quà hôm nay</Text></Pressable></View><Text style={styles.sectionTitle}>Đặc quyền đang có</Text>{[['☕', 'Giờ nghe thư giãn', 'Gợi ý 15 phút nghe trước khi ngủ'], ['🌟', 'Huy hiệu người đọc', 'Mở khóa khi hoàn thành chương đầu tiên'], ['🤝', 'Tặng sách cho bạn', 'Chia sẻ cảm hứng đọc cùng người thân']].map(([icon, title, copy]) => <View key={title} style={styles.giftRow}><Text style={styles.giftRowIcon}>{icon}</Text><View><Text style={styles.chapterTitle}>{title}</Text><Text style={styles.author}>{copy}</Text></View></View>)}</ScrollView></View>; }

function BookCard({ book, onPress, favorite, onFavorite }: { book: Book; onPress: () => void; favorite?: boolean; onFavorite?: () => void }) {
  return <Pressable style={({ pressed }) => [styles.bookCard, pressed && styles.pressed]} onPress={onPress}>{book.cover_url ? <Image source={{ uri: book.cover_url }} style={styles.cover} /> : <View style={[styles.cover, styles.coverFallback]}><Text style={styles.bookIcon}>📖</Text></View>}<Pressable style={styles.favorite} onPress={onFavorite}><Text style={[styles.favoriteGlyph, favorite && styles.favoriteOn]}>{favorite ? '♥' : '♡'}</Text></Pressable><View style={styles.bookMeta}><Text numberOfLines={2} style={styles.bookTitle}>{book.title}</Text><Text numberOfLines={1} style={styles.author}>{book.author || 'Chưa rõ tác giả'}</Text><Text style={styles.cardCta}>Xem sách  ›</Text></View></Pressable>;
}

function BookScreen({ bookId, back, play }: { bookId: number; back: () => void; play: (chapter: Chapter, chapters: Chapter[]) => void }) {
  const [book, setBook] = useState<Book>(); const [error, setError] = useState<unknown>();
  const load = useCallback(() => { setError(undefined); return api.book(bookId).then(setBook).catch(setError); }, [bookId]);
  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    if (!book?.chapters?.some((chapter) => chapter.status === 'processing' || chapter.status === 'pending')) return;
    const timer = setTimeout(() => { void load(); }, 2000);
    return () => clearTimeout(timer);
  }, [book, load]);
  return <View style={styles.fill}><Header title={book?.title || 'Chi tiết sách'} back={back} />{!book ? error ? <ErrorState error={error} retry={load} /> : <Loading /> : <ScrollView contentContainerStyle={styles.detail}>
    {book.cover_url ? <Image source={{ uri: book.cover_url }} style={styles.detailCover} /> : <View style={[styles.detailCover, styles.coverFallback]}><Text style={styles.detailIcon}>📖</Text></View>}
    <Text style={styles.detailTitle}>{book.title}</Text><Text style={styles.detailAuthor}>{book.author}</Text>{!!book.description && <Text style={styles.description}>{book.description}</Text>}<Text style={styles.sectionTitle}>Danh sách chương</Text>
    {(book.chapters || []).map((chapter) => <Pressable key={chapter.id} onPress={() => play(chapter, book.chapters || [])} style={({ pressed }) => [styles.chapter, pressed && styles.pressed]}><View style={styles.chapterNumber}><Text style={styles.chapterNumberText}>{chapter.position}</Text></View><View style={styles.chapterBody}><Text style={styles.chapterTitle}>{chapter.title}</Text><Text style={styles.chapterStatus}>Đọc PDF · {statusLabel(chapter.status)}</Text></View><View style={styles.readPill}><Text style={styles.readPillText}>Đọc ›</Text></View></Pressable>)}
  </ScrollView>}</View>;
}

function PlayerScreen({ chapter, chapters, back }: { chapter: Chapter; chapters: Chapter[]; back: () => void }) {
  const [active, setActive] = useState(chapter);
  const [showOptions, setShowOptions] = useState(false);
  const source = useMemo(() => active.audio_url ? { uri: active.audio_url } : null, [active.audio_url]);
  const player = useAudioPlayer(source, { updateInterval: 500, downloadFirst: true }); const status = useAudioPlayerStatus(player);
  const duration = status.duration || 0; const progress = duration > 0 ? status.currentTime / duration : 0;
  useEffect(() => {
    void setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'doNotMix' }).catch(() => undefined);
  }, []);
  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      const value = await api.chapter(active.id);
      if (cancelled) return;
      setActive(value);
      if (!value.audio_url && value.status !== 'failed') setTimeout(() => { void refresh(); }, 2500);
    };
    void api.startListening(active.id).catch(() => undefined);
    void refresh();
    return () => { cancelled = true; };
  }, [active.id]);
  const seek = (delta: number) => player.seekTo(Math.max(0, Math.min(duration, status.currentTime + delta)));
  const index = chapters.findIndex((item) => item.id === active.id); const previous = index > 0 ? chapters[index - 1] : undefined; const next = index >= 0 && index < chapters.length - 1 ? chapters[index + 1] : undefined;
  const [nextStatus, setNextStatus] = useState<Chapter>();
  useEffect(() => {
    if (!next) { setNextStatus(undefined); return; }
    let cancelled = false;
    const checkNext = async () => { try { const value = await api.chapter(next.id); if (!cancelled) setNextStatus(value); } catch { /* transient network error */ } };
    void checkNext();
    const timer = setInterval(() => { void checkNext(); }, 2500);
    return () => { cancelled = true; clearInterval(timer); };
  }, [next?.id]);
  const audioReady = Boolean(active.audio_url && status.isLoaded);
  return <View style={styles.fill}><Header title={`${active.position}. ${active.title}`} back={back} /><PdfReader uri={active.pdf_url} /><View style={styles.readerNav}><Pressable disabled={!previous} onPress={() => previous && setActive(previous)}><Text style={[styles.readerNavText, !previous && styles.disabledText]}>‹ Chương trước</Text></Pressable><Pressable onPress={() => setShowOptions((value) => !value)}><Text style={styles.readerNavText}>⚙ Tùy chọn</Text></Pressable><Pressable disabled={!next} onPress={() => next && setActive(next)}><Text style={[styles.readerNavText, !next && styles.disabledText]}>Chương sau ›</Text></Pressable></View>{next && <View style={styles.nextStatus}><Text style={styles.nextStatusLabel}>CHƯƠNG TIẾP THEO</Text><Text style={styles.nextStatusText}>{next.title} · {nextStatus?.audio_url ? 'Audio sẵn sàng' : nextStatus?.status === 'processing' ? 'Đang tạo audio…' : 'Đã bắt đầu tạo'}</Text></View>}{showOptions && <View style={styles.options}><Text style={styles.optionsTitle}>Tùy chọn đọc & nghe</Text><Text style={styles.optionsText}>PDF luôn là nội dung chính · Tốc độ audio: 1x</Text></View>}<View style={styles.audioDock}><View style={styles.audioDockTop}><View><Text style={styles.nowPlaying}>ĐANG NGHE</Text><Text numberOfLines={1} style={styles.dockTitle}>{active.title}</Text></View>{active.audio_url ? <Pressable disabled={!audioReady} style={[styles.dockPlay, !audioReady && styles.disabled]} onPress={() => status.playing ? player.pause() : player.play()}><Text style={styles.dockPlayText}>{status.playing ? 'Ⅱ' : audioReady ? '▶' : '…'}</Text></Pressable> : <View style={styles.generating}><Text>Đang tạo audio…</Text></View>}</View>{active.audio_url && <><Text style={styles.audioHint}>{status.error ? `Không phát được audio: ${status.error}` : audioReady ? 'Audio sẵn sàng' : 'Đang tải audio…'}</Text><View style={styles.progressTrack}><View style={[styles.progressValue, { width: `${Math.min(100, progress * 100)}%` }]} /></View><View style={styles.dockControls}><Pressable disabled={!audioReady} onPress={() => seek(-15)}><Text style={[styles.skip, !audioReady && styles.disabledText]}>↶ 15 giây</Text></Pressable><Text style={styles.time}>{formatTime(status.currentTime)} / {formatTime(duration)}</Text><Pressable disabled={!audioReady} onPress={() => seek(15)}><Text style={[styles.skip, !audioReady && styles.disabledText]}>15 giây ↷</Text></Pressable></View></>}</View></View>;
}

const statusLabel = (status: ProcessingStatus) => ({ pending: 'Chờ xử lý', processing: 'Đang tạo audio', completed: 'Sẵn sàng nghe', failed: 'Xử lý lỗi' })[status];
const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, paddingTop: Platform.OS === 'android' ? 26 : 0 }, fill: { flex: 1 }, floatingSearch: { width: 46, height: 46, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', shadowColor: colors.primary, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 }, searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 18, marginHorizontal: 20, marginBottom: 10, paddingHorizontal: 15, shadowColor: '#2B1C5A', shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 }, searchInput: { flex: 1, color: colors.text, paddingVertical: 13, paddingHorizontal: 9, fontSize: 14 }, library: { padding: 20, maxWidth: 1200, width: '100%', alignSelf: 'center', paddingBottom: 110 }, bookRow: { gap: 14 },
  welcomeRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }, kicker: { color: colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1.8, marginBottom: 10 }, miniAvatar: { width: 42, height: 42, borderRadius: 15, backgroundColor: colors.text, alignItems: 'center', justifyContent: 'center' }, miniAvatarText: { color: 'white', fontWeight: '900' },
  featureBanner: { minHeight: 208, borderRadius: 28, overflow: 'hidden', backgroundColor: colors.primaryDark, marginBottom: 28, position: 'relative', padding: 22 }, bannerCopy: { maxWidth: '80%', zIndex: 2 }, bannerEyebrow: { color: '#DAD1FF', fontSize: 9, fontWeight: '900', letterSpacing: 1.2 }, bannerTitle: { color: 'white', fontSize: 25, lineHeight: 29, fontWeight: '900', letterSpacing: -0.5, marginTop: 10 }, bannerMeta: { color: '#D8D0F4', fontSize: 12, marginTop: 8 }, bannerButton: { alignSelf: 'flex-start', backgroundColor: '#FFFFFF', borderRadius: 99, paddingHorizontal: 14, paddingVertical: 10, marginTop: 18 }, bannerButtonText: { color: colors.primaryDark, fontWeight: '900', fontSize: 11 }, bannerStamp: { position: 'absolute', right: 22, bottom: 18, color: '#A994FF', fontSize: 58 }, bannerOrbOne: { position: 'absolute', width: 190, height: 190, borderRadius: 95, backgroundColor: '#8065F4', opacity: 0.38, right: -65, top: -42 }, bannerOrbTwo: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: '#FF8C8C', opacity: 0.25, right: 35, bottom: -55 }, sectionOverline: { color: colors.muted, fontSize: 9, fontWeight: '900', letterSpacing: 1.2, marginBottom: 5 }, topicHeader: { marginTop: 18 },
  heroTitle: { color: colors.text, fontWeight: '900', fontSize: 30, letterSpacing: -1, marginTop: 12 }, heroSubtitle: { color: colors.muted, fontSize: 15, marginTop: 5, marginBottom: 18 }, sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }, sectionTitle: { color: colors.text, fontSize: 19, fontWeight: '900', letterSpacing: -0.3 }, seeAll: { color: colors.primary, fontWeight: '900', fontSize: 12 }, showAllHint: { color: colors.muted, fontSize: 11, marginBottom: 8 }, chips: { gap: 8, paddingBottom: 20 }, chip: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: 99, paddingHorizontal: 16, paddingVertical: 10 }, chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary }, chipText: { color: colors.text, fontWeight: '700' }, chipTextSelected: { color: 'white' },
  bookCard: { flex: 1, minWidth: 0, backgroundColor: colors.surface, borderRadius: 22, overflow: 'hidden', marginBottom: 16, borderWidth: 1, borderColor: colors.border, shadowColor: '#39217A', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 3 }, cover: { width: '100%', aspectRatio: 0.74 }, favorite: { position: 'absolute', right: 10, top: 10, width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFFE8', alignItems: 'center', justifyContent: 'center' }, favoriteGlyph: { color: colors.text, fontSize: 20 }, favoriteOn: { color: colors.accent }, coverFallback: { backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' }, bookIcon: { fontSize: 54 }, bookMeta: { padding: 14, minHeight: 105 }, bookTitle: { color: colors.text, fontSize: 16, fontWeight: '900', lineHeight: 21 }, author: { color: colors.muted, marginTop: 5, fontSize: 12 }, cardCta: { color: colors.primary, fontSize: 11, fontWeight: '900', marginTop: 10 }, empty: { textAlign: 'center', color: colors.muted, paddingVertical: 60 },
  detail: { padding: 22, alignItems: 'center', maxWidth: 760, width: '100%', alignSelf: 'center' }, detailCover: { width: 190, height: 270, borderRadius: 18 }, detailIcon: { fontSize: 72 }, detailTitle: { color: colors.text, fontSize: 28, textAlign: 'center', fontWeight: '900', marginTop: 22 }, detailAuthor: { color: colors.muted, fontSize: 17, marginTop: 7 }, description: { color: colors.text, fontSize: 16, lineHeight: 25, marginTop: 22, alignSelf: 'stretch' },
  chapter: { alignSelf: 'stretch', backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border, padding: 15, marginBottom: 10, flexDirection: 'row', alignItems: 'center', shadowColor: '#39217A', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }, disabled: { opacity: 0.55 }, pressed: { opacity: 0.72 }, chapterNumber: { width: 42, height: 42, borderRadius: 15, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' }, chapterNumberText: { color: colors.primaryDark, fontWeight: '900' }, chapterBody: { flex: 1, paddingHorizontal: 12 }, chapterTitle: { color: colors.text, fontWeight: '900', fontSize: 15 }, chapterStatus: { color: colors.muted, marginTop: 4, fontSize: 12 }, playIcon: { color: colors.primary, fontSize: 22 }, readPill: { backgroundColor: colors.primary, borderRadius: 20, paddingHorizontal: 13, paddingVertical: 8 }, readPillText: { color: 'white', fontWeight: '900', fontSize: 12 },
  progressValue: { height: '100%', backgroundColor: colors.primary },
  audioDock: { backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: 18, paddingTop: 12, paddingBottom: Platform.OS === 'ios' ? 20 : 14 }, audioDockTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, nowPlaying: { color: colors.primary, fontSize: 9, fontWeight: '900', letterSpacing: 1.2 }, dockTitle: { color: colors.text, fontWeight: '800', fontSize: 15, marginTop: 2, maxWidth: 260 }, dockPlay: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }, dockPlayText: { color: 'white', fontSize: 21 }, generating: { backgroundColor: colors.primarySoft, padding: 10, borderRadius: 10 }, progressTrack: { height: 5, borderRadius: 4, backgroundColor: colors.border, width: '100%', marginTop: 12, overflow: 'hidden' }, dockControls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 9 }, time: { color: colors.muted, fontSize: 11 }, skip: { color: colors.primary, fontWeight: '800', fontSize: 12 }, readerNav: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border }, readerNavText: { color: colors.primary, fontWeight: '800', fontSize: 12 }, disabledText: { color: colors.muted }, options: { backgroundColor: colors.primarySoft, padding: 13 }, optionsTitle: { color: colors.primaryDark, fontWeight: '900' }, optionsText: { color: colors.muted, marginTop: 4, fontSize: 12 }, bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 72, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, flexDirection: 'row', justifyContent: 'space-around', paddingTop: 8, paddingBottom: Platform.OS === 'ios' ? 16 : 7 }, bottomItem: { alignItems: 'center', minWidth: 68 }, bottomIcon: { color: colors.muted, fontSize: 22, lineHeight: 27 }, bottomLabel: { color: colors.muted, fontSize: 10, fontWeight: '700' }, bottomActive: { color: colors.primary }, segment: { flexDirection: 'row', gap: 8, marginBottom: 6 }, categoryPage: { padding: 20, paddingBottom: 100 }, categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 }, categoryTile: { width: '47%', minHeight: 150, backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 15 }, categoryTileSelected: { backgroundColor: colors.primary, borderColor: colors.primary }, categoryEmoji: { fontSize: 28 }, categoryName: { color: colors.text, fontWeight: '900', fontSize: 15, marginTop: 12 }, categoryNameSelected: { color: 'white' }, categoryDescription: { color: colors.muted, fontSize: 11, lineHeight: 16, marginTop: 6 }, libraryPage: { padding: 20, paddingBottom: 100 }, libraryRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 10, marginBottom: 10 }, libraryCover: { width: 52, height: 70, borderRadius: 8, backgroundColor: colors.primarySoft }, libraryRowBody: { flex: 1, paddingHorizontal: 12 }, mutedBlock: { color: colors.muted, backgroundColor: colors.surface, borderRadius: 12, padding: 18, marginBottom: 10 }, favoriteText: { color: colors.primary, fontSize: 22 }, giftPage: { padding: 20, paddingBottom: 100 }, giftHero: { backgroundColor: colors.primary, borderRadius: 22, padding: 24, alignItems: 'center' }, giftIcon: { fontSize: 48 }, giftTitle: { color: 'white', fontSize: 24, fontWeight: '900', marginTop: 12 }, giftCopy: { color: '#d7f0df', textAlign: 'center', marginTop: 8, lineHeight: 21 }, giftButton: { backgroundColor: 'white', paddingHorizontal: 18, paddingVertical: 11, borderRadius: 99, marginTop: 18 }, giftButtonText: { color: colors.primary, fontWeight: '900' }, giftRow: { flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: colors.surface, borderRadius: 14, padding: 15, marginBottom: 10 }, giftRowIcon: { fontSize: 26 },
  audioHint: { color: colors.muted, fontSize: 11, marginTop: 8 },
  nextStatus: { backgroundColor: colors.primarySoft, paddingHorizontal: 14, paddingVertical: 9 }, nextStatusLabel: { color: colors.primaryDark, fontSize: 9, fontWeight: '900', letterSpacing: 1 }, nextStatusText: { color: colors.text, fontSize: 12, marginTop: 3 },
});
