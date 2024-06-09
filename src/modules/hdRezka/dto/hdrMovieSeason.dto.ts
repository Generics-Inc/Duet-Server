import {HdrMovieSeriaDto} from "./hdrMovieSeria.dto";

export class HdrMovieSeasonDto {
    name: string;
    number: number;
    releaseDate: Date;
    series: HdrMovieSeriaDto[];
}
