import {MovieModelDto} from "./movieModel.dto";
import {MovieRatingDto} from "./movieRating.dto";
import {MovieSeasonDto} from "./movieSeason.dto";

export class MovieDto extends MovieModelDto {
    genres: string[];
    ratings: MovieRatingDto[];
    seasons: MovieSeasonDto[];
}
