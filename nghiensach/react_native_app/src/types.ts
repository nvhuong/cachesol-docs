export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';
export interface Category { id: number; name: string; description: string; parent_id?: number | null }
export interface Chapter { id: number; book_id: number; title: string; position: number; status: ProcessingStatus; text: string; pdf_url: string; text_url: string | null; audio_url: string | null; error_message: string | null }
export interface Book { id: number; category_id: number; title: string; author: string; description: string; cover_url: string | null; chapters?: Chapter[] }
export interface BookPage { items: Book[]; next_cursor: string | null }
export interface Library { recent: Book[]; favorites: Book[] }
export type Screen = { name: 'home'; tab?: 'home' | 'categories' | 'library' | 'gifts' } | { name: 'categoryBooks'; categoryId: number; categoryName: string } | { name: 'book'; bookId: number } | { name: 'player'; chapter: Chapter; chapters: Chapter[] };
