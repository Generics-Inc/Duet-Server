import {CreateMovieModelDto} from "./createMovieModel.dto";
import {CreateMoviePartDto} from "./createMoviePart.dto";
import {CreateMovieRatingDto} from "./createMovieRating.dto";

export class CreateMovieModelExtendDto extends CreateMovieModelDto {
    ratings: CreateMovieRatingDto[];
    parts: CreateMoviePartDto[];
}
