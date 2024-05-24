import {IsNotEmpty, IsString} from "class-validator";

export class UploadDto {
    @IsString()
    @IsNotEmpty()
    fileDir: string;
}
export class UploadResponseDto {
    link: string;
}
