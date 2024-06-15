import {MovieType} from "@prisma/client";

export class MovieMinimalDto {
    id: number;
    name: string;
    type: MovieType;
    photo: string;
    updatedAt: Date;
    createdAt: Date;

    creatorId?: number;
    originalName?: string;
}
