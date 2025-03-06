export interface Company {
  id: string;
  name: string;
  country: string;
  createYear: number;
  employees: number;
  rating: number;
  songs: number[];
}

export interface Artist {
  id: string;
  name: string;
  bornCity: string;
  birthdate: string;
  img: string;
  rating: number;
  songs: number[];
}

export interface Song {
  id: string;
  title: string;
  poster: string;
  genre: string[];
  year: number;
  duration: number;
  rating: number;
  artist: string;
  _artist?: Artist;
  _companies?: Company[];
}
