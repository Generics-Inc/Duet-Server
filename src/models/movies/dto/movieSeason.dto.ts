import {MovieSeriaDto} from "./movieSeria.dto";

export class MovieSeasonDto {
    id: number;
    movieId: number;
    number: number;
    releaseDate?: Date;
    series: MovieSeriaDto[];
}
