import { Artist } from './artist.models';
import { Company } from './company.models';

export interface Song {
  id: string;
  title: string;
  poster: string;
  genre: string[];
  year: number;
  duration: number;
  rating: number;
  artist: number;
  _artist?: Artist;
  _company?: Company;
}
