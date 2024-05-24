import {PrismaService} from "../singles";
import {GroupIncludes} from "../types";

export type AccessCheckReturn = Promise<{
    status: boolean,
    ctx?: { [name: string]: any },
    stages?: { [name: string]: boolean };
}>;

async function getProfileById(prismaService: PrismaService, id: number) {
    const profile = await prismaService.profile.findUnique({
        where: {id},
        include: {
            groupsArchives: true,
            mainGroup: true,
            secondGroup: true
        }
    });
    if (!profile) return profile;
    profile.groupId = profile.mainGroup?.id ?? profile.secondGroup?.id ?? null;
    return profile;
}

export async function accessToGroup(
    prismaService: PrismaService,
    reqProfileId: number,
    groupId?: number
): AccessCheckReturn {
    if (!groupId) return { status: false };

    const profile = await getProfileById(prismaService, reqProfileId);
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
    prismaService: PrismaService,
    reqProfileId: number,
    profileId?: number
): AccessCheckReturn {
    if (!profileId) return { status: false };

    const requester = await getProfileById(prismaService, reqProfileId);
    const requesterGroup = requester.groupId ? await prismaService.group.findUnique({
        where: { id: requester.groupId },
        include: {
            groupArchives: true,
            groupRequests: true
        }
    }) : null;

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
    prismaService: PrismaService,
    reqProfileId: number,
    profileId?: number
): AccessCheckReturn {
    const baseAccess = await accessToProfile(prismaService, reqProfileId, profileId);

    if (baseAccess.status) {
        return baseAccess;
    } else {
        const { requesterGroup } = baseAccess.ctx as { requesterGroup: GroupIncludes };

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
