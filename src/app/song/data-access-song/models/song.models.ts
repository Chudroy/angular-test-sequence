import { Artist } from 'data-access-artist';

export interface Song {
  id: number;
  title: string;
  poster: string;
  genre: string[];
  year: number;
  duration: number;
  rating: number;
  artist: Artist;
  artistId: number;
  country?: string;
  company?: string;
}
