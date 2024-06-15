import {MovieType} from "@prisma/client";

export class GroupMovieCreateTaskModelDto {
    id: number;
    groupMovieId: number;
    link: string;
    name: string;
    addName: string;
    type: MovieType;
    isError: boolean;
    createdAt: Date;
    updatedAt: Date;
}
