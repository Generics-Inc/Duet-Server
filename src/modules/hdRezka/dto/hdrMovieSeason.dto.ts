import {HdrMovieSeriaDto} from "./hdrMovieSeria.dto";

export class HdrMovieSeasonDto {
    number: number;
    releaseDate: Date;
    series: HdrMovieSeriaDto[];
}
