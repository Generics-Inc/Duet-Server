import {ExposeAll} from "@root/decorators";
import {MovieType} from "@prisma/client";

@ExposeAll()
export class CreateGroupMovieAsyncDto {
    link: string;
    name: string;
    addName: string;
    type: MovieType;
}
