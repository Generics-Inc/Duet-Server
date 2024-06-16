import {ApiProperty} from "@nestjs/swagger";
import {CreateMovieModelDto} from "./createMovieModel.dto";
import {CreateMoviePartDto} from "./createMoviePart.dto";
import {CreateMovieRatingDto} from "./createMovieRating.dto";

export class CreateMovieModelExtendDto extends CreateMovieModelDto {
    @ApiProperty({ description: 'Рейтинги', type: CreateMovieRatingDto, isArray: true })
    ratings: CreateMovieRatingDto[];

    @ApiProperty({ description: 'Части', type: CreateMoviePartDto, isArray: true })
    parts: CreateMoviePartDto[];
}
