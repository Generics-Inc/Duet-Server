import {GroupMovieRatingModelDto} from "./groupMovieRatingModel.dto";
import {ProfileMinimalDto} from "@models/users/profiles/dto";

export class GroupMovieRatingDto extends GroupMovieRatingModelDto {
    profile: ProfileMinimalDto;
}
