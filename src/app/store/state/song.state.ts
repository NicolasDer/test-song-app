import { Artist } from "../../models/artist.model";
import { Company } from "../../models/company.model";
import { Song } from "../../models/song.model";

export interface AppState {
    songs: { [id: string]: Song };
    artists: { [id: string]: Artist };
    companies: { [id: string]: Company };
    songsLoaded: boolean;
    artistsLoaded: boolean;
    companiesLoaded: boolean;
    loading: boolean;
}