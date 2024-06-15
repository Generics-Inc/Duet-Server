import {MovieType} from "@prisma/client";

export class MovieModelDto {
    id: number;
    name: string;
    type: MovieType;
    photo: string;
    moderated: boolean;
    updatedAt: Date;
    createdAt: Date;
    genres: string[];

    creatorId?: number;
    ageRating?: number;
    time?: number;
    link?: string;
    country?: string;
    originalName?: string;
    slogan?: string;
    description?: string;
    releaseDate?: Date;
}
