import {MovieModelDto} from "./movieModel.dto";
import {MovieRatingModelDto} from "./movieRatingModel.dto";
import {MovieSeasonDto} from "./movieSeason.dto";

export class MovieDto extends MovieModelDto {
    genres: string[];
    ratings: MovieRatingModelDto[];
    seasons: MovieSeasonDto[];
}
