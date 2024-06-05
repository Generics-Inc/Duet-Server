import {UsersProfilesModelService} from "@models/users/profiles/profiles.service";
import {GroupsModelService} from "@models/groups/groups.service";
import {GroupIncludes} from "../types";
import {MoviesModelService} from "@models/movies/movies.service";

export type AccessCheckReturn = Promise<{
    status: boolean,
    ctx?: { [name: string]: any },
    stages?: { [name: string]: boolean };
}>;

export async function accessToGroup(
    usersProfilesModelService: UsersProfilesModelService,
    reqProfileId: number,
    groupId?: number
): AccessCheckReturn {
    if (!groupId) return { status: false };

    const profile = await usersProfilesModelService.getProfileById(reqProfileId, true);
    const isGroupInArchive = !!profile.groupsArchives.find(record => record.groupId === groupId);
    const isGroupActive = profile.groupId === groupId;

    return {
        status: isGroupActive || isGroupInArchive,
        stages: {
            isGroupActive,
            isGroupInArchive
        }
    };
}

export async function accessToProfile(
    usersProfilesModelService: UsersProfilesModelService,
    groupsModelService: GroupsModelService,
    reqProfileId: number,
    profileId?: number
): AccessCheckReturn {
    if (!profileId) return { status: false };

    const requester = await usersProfilesModelService.getProfileById(reqProfileId);
    const requesterGroup = requester.groupId ? await groupsModelService.getGroupById(requester.groupId, true) : null;

    const isCurrentProfile = reqProfileId === profileId;
    const isProfileInGroup = requesterGroup && [requesterGroup.mainProfileId, requesterGroup.secondProfileId].includes(profileId);
    const isProfileInGroupArchive = requesterGroup && requesterGroup.groupArchives.map(record => record.profileId).includes(profileId);

    return {
        status: isCurrentProfile || isProfileInGroup || isProfileInGroupArchive,
        ctx: {
            requester,
            requesterGroup
        },
        stages: {
            isCurrentProfile,
            isProfileInGroup,
            isProfileInGroupArchive
        }
    };
}

export async function accessToProfileWithRequests(
    usersProfilesModelService: UsersProfilesModelService,
    groupsModelService: GroupsModelService,
    reqProfileId: number,
    profileId?: number
): AccessCheckReturn {
    const baseAccess = await accessToProfile(usersProfilesModelService, groupsModelService, reqProfileId, profileId);

    if (baseAccess.status) {
        return baseAccess;
    } else {
        const requesterGroup = baseAccess.ctx.requesterGroup as GroupIncludes;

        const isProfileInGroupRequests = requesterGroup && requesterGroup.groupRequests.map(record => record.profileId).includes(profileId);

        return {
            status: isProfileInGroupRequests,
            stages: {
                ...baseAccess.stages,
                isProfileInGroupRequests
            }
        };
    }
}

export async function accessToMovie(
    usersProfilesModelService: UsersProfilesModelService,
    moviesModelService: MoviesModelService,
    reqProfileId: number,
    movieId?: number
): AccessCheckReturn {
    if (!movieId) return { status: false };

    const profile = await usersProfilesModelService.getProfileById(reqProfileId, true);
    const movie = await moviesModelService.getMovieById(movieId);

    const isProfileInMovieGroup = movie.groupId === profile.groupId;

    return {
        status: isProfileInMovieGroup,
        stages: {
            isProfileInMovieGroup
        }
    };
}
