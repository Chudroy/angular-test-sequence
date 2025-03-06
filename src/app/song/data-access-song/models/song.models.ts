export interface SongFormValue {
  id?: string;
  title: string | null;
  artist: string | null;
  year: string | null;
  rating: number | null;
  genre: string[];
  companies?: string[];
}
