import {ApiProperty} from "@nestjs/swagger";
import {IsString, Length} from "class-validator";


export class SearchMovieDto {
    @ApiProperty({ description: 'Название фильма', type: String, minLength: 1, maxLength: 500 })
    @IsString()
    @Length(1, 500)
    text: string;
}
