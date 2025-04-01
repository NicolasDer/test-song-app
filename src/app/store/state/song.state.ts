import { Artist } from "../../models/artist.model";
import { Company } from "../../models/company.model";
import { Song } from "../../models/song.model";

export interface AppState {
    songs: { [id: number]: Song };
    artists: { [id: number]: Artist };
    companies: { [id: number]: Company };
    songsLoaded: boolean;
    artistsLoaded: boolean;
    companiesLoaded: boolean;
}