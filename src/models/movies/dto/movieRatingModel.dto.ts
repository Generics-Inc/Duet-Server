export class MovieRatingModelDto {
    id: number;
    movieId: number;
    countOfScopes: number;
    scope: number;

    profileId?: number;
    providerName?: string;
}
