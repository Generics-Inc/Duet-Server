import {UsersProfilesModelService} from "@models/users/profiles/profiles.service";
import {GroupsModelService} from "@models/groups/groups.service";
import {MoviesModelService} from "@models/movies/movies.service";
import {GroupsArchivesModelService} from "@models/groups/archives/archives.service";
import {GroupDto} from "@models/groups/dto";
import {ProfileFullDto} from "@models/users/profiles/dto";

export type AccessCheckReturn = Promise<{
    status: boolean,
    ctx?: { [name: string]: any },
    stages?: { [name: string]: boolean };
}>;

export async function accessToGroup(
    usersProfilesModelService: UsersProfilesModelService,
    groupsModelService: GroupsArchivesModelService,
    reqProfileId: number,
    groupId?: number
): AccessCheckReturn {
    if (!groupId) return { status: false };

    const profile = await usersProfilesModelService.getById(reqProfileId);
    const isGroupInArchive = !!groupsModelService.getFullByGroupIdAndProfileId(groupId, profile.id);
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

    const requester = await usersProfilesModelService.getFullById(reqProfileId);
    const requesterGroup = requester.groupId ? await groupsModelService.getById(requester.groupId) : null;

    const isCurrentProfile = reqProfileId === profileId;
    const isProfileInGroup = requesterGroup && [requesterGroup.mainProfileId, requesterGroup.secondProfileId].includes(profileId);
    const isProfileInGroupArchive = requesterGroup && requesterGroup.archives.map(record => record.profileId).includes(profileId);

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
        const requested = baseAccess.ctx.requester as ProfileFullDto;
        const requesterGroup = baseAccess.ctx.requesterGroup as GroupDto;

        const isProfileInArchive = requested.groupsArchives.some(archive => archive.partnerId === profileId);
        const isProfileInGroupRequests = requesterGroup && requesterGroup.requests.map(record => record.profileId).includes(profileId);

        return {
            status: isProfileInArchive || isProfileInGroupRequests,
            stages: {
                ...baseAccess.stages,
                isProfileInArchive,
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

    const profile = await usersProfilesModelService.getById(reqProfileId);
    const movie = await moviesModelService.getModelMovieById(movieId);

    const isMovieInGroup =  !!(profile.groupId ? await moviesModelService.getModelMovieByIdAndGroupId(movieId, profile.groupId) : null);
    const isPublic = movie.moderated;

    return {
        status: isPublic || isMovieInGroup,
        stages: {
            isPublic,
            isMovieInGroup
        }
    };
}
