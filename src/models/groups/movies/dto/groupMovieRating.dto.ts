import {GroupMovieRatingModelDto} from "./groupMovieRatingModel.dto";
import {ProfileMinimalDto} from "@models/users/profiles/dto";
import {ApiProperty} from "@nestjs/swagger";

export class GroupMovieRatingDto extends GroupMovieRatingModelDto {
    @ApiProperty({ description: 'Пользователь оценивший фильм', type: ProfileMinimalDto })
    profile: ProfileMinimalDto;
}
