import { Prisma } from "@prisma/client";

type Selects = {
    User: Prisma.UserSelect,
    ConnectedAccount: Prisma.ConnectedAccountSelect,
    Session: Prisma.SessionSelect,
    Profile: Prisma.ProfileSelect,
    Group: Prisma.GroupSelect,
    GroupRequest: Prisma.GroupRequestSelect,
    GroupArchive: Prisma.GroupArchiveSelect,
    GroupMovie: Prisma.GroupMovieSelect,
    GroupMovieWatchedSeria: Prisma.GroupMovieWatchedSeriaSelect,
    GroupMovieRating: Prisma.GroupMovieRatingSelect,
    GroupMovieCreateTask: Prisma.GroupMovieCreateTaskSelect,
    Movie: Prisma.MovieSelect,
    MovieModerate: Prisma.MovieModerateSelect,
    MovieRating: Prisma.MovieRatingSelect,
    MoviePart: Prisma.MoviePartSelect,
    MoviePartsList: Prisma.MoviePartsListSelect,
    MovieSeason: Prisma.MovieSeasonSelect,
    MovieSeria: Prisma.MovieSeriaSelect,
    HDRezkaMirror: Prisma.HDRezkaMirrorSelect,
    Photo: Prisma.PhotoSelect,
    SuperSecret: Prisma.SuperSecretSelect
};

export default function<T extends keyof Selects, E extends Selects[T]>(_: T, select: E) {
    return select
}
