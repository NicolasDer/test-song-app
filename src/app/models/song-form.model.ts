import { Song } from "./song.model";

export interface SongForm extends Song{
    companies: string[];
  }
  