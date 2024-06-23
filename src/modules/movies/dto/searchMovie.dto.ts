import {ApiProperty} from "@nestjs/swagger";
import {IsString, Length} from "class-validator";


export class SearchMovieDto {
    @ApiProperty({ description: '', type: String, minLength: 1, maxLength: 100 })
    @IsString()
    @Length(1, 100)
    text: string;
}
