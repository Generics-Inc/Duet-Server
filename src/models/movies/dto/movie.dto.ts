import {ApiProperty} from "@nestjs/swagger";
import {MovieModelDto} from "./movieModel.dto";
import {MovieRatingDto} from "./movieRating.dto";
import {MovieSeasonDto} from "./movieSeason.dto";
import {MoviePartsListDto} from "./moviePartsList.dto";

export class MovieDto extends MovieModelDto {
    @ApiProperty({ description: 'Рейтинги провайдеров', type: MovieRatingDto, isArray: true })
    ratings: MovieRatingDto[];

    @ApiProperty({ description: 'Сезоны', type: MovieSeasonDto, isArray: true })
    seasons: MovieSeasonDto[];

    @ApiProperty({ description: 'Лист с частями', type: MoviePartsListDto, required: false })
    partsList?: MoviePartsListDto;
}
