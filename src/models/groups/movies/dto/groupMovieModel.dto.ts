export class GroupMovieModelDto {
    id: number;
    groupId: number;
    isWatched: boolean;
    moreToWatch: number[];
    createdAt: Date;
    updatedAt: Date

    creatorId?: number;
    movieId?: number;
}
