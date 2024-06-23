import {ApiProperty} from "@nestjs/swagger";
import {IsBoolean, IsOptional} from "class-validator";
import {ExposeAll} from "@root/decorators";
import {CreateMovieModelDto} from "@models/movies/dto";

@ExposeAll()
export class CreateMovieDto extends CreateMovieModelDto {
    @ApiProperty({ description: 'Использовать ли генерацию постера с помощью ИИ', type: Boolean, required: false })
    @IsOptional()
    @IsBoolean()
    useAIGenerationPhoto?: boolean;

    @ApiProperty({ description: 'Статус просмотрено ли', type: Boolean, required: false })
    @IsOptional()
    @IsBoolean()
    isWatched?: boolean;

    @ApiProperty({ description: 'Файл изображения', type: Buffer, required: false })
    file?: Buffer;
}
