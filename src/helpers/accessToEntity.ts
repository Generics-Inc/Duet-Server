import {GroupIncludes} from "../types";
import {UsersProfilesBaseService} from "@modules/usersBase/profilesBase/profilesBase.service";
import {GroupsBaseService} from "@modules/groupsBase/groupsBase.service";

export type AccessCheckReturn = Promise<{
    status: boolean,
    ctx?: { [name: string]: any },
    stages?: { [name: string]: boolean };
}>;

export async function accessToGroup(
    usersProfilesBaseService: UsersProfilesBaseService,
    reqProfileId: number,
    groupId?: number
): AccessCheckReturn {
    if (!groupId) return { status: false };

    const profile = await usersProfilesBaseService.getProfileById(reqProfileId, true);
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
    usersProfilesBaseService: UsersProfilesBaseService,
    groupsBaseService: GroupsBaseService,
    reqProfileId: number,
    profileId?: number
): AccessCheckReturn {
    if (!profileId) return { status: false };

    const requester = await usersProfilesBaseService.getProfileById(reqProfileId);
    const requesterGroup = requester.groupId ? await groupsBaseService.getGroupById(requester.groupId, true) : null;

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
    usersProfilesBaseService: UsersProfilesBaseService,
    groupsBaseService: GroupsBaseService,
    reqProfileId: number,
    profileId?: number
): AccessCheckReturn {
    const baseAccess = await accessToProfile(usersProfilesBaseService, groupsBaseService, reqProfileId, profileId);

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
