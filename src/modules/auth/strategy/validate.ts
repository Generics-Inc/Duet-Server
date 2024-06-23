import {Request} from "express";
import {AuthorizedSessionNotFoundException} from "@root/errors";
import {UsersProfilesModelService} from "@models/users/profiles/profiles.service";
import {SessionsModelService} from "@models/sessions/sessions.service";
import {UsersModelService} from "@models/users/users.service";
import {PayloadReturnDto, TokenPayloadDto} from "./dto";
import {md5} from "@nestjs/throttler/dist/hash";
import {GroupsModelService} from "@models/groups/groups.service";

export default async (
    token: string,
    type: 'access' | 'refresh',
    req: Request,
    tokenPayload: TokenPayloadDto,
    sessionsModelService: SessionsModelService,
    usersModelService: UsersModelService,
    groupsModelService: GroupsModelService,
    usersProfilesModelService: UsersProfilesModelService
): Promise<PayloadReturnDto> => {
    const passHash = req.cookies.passHash;

    if (!Number.isInteger(tokenPayload.sessionId) || !Number.isInteger(tokenPayload.userId))
        throw AuthorizedSessionNotFoundException;

    const session = await sessionsModelService.getModelById(tokenPayload.sessionId)
    const user = await usersModelService.getModelById(tokenPayload.userId);
    const profile = await usersProfilesModelService.getById(tokenPayload.userId);
    const group = profile?.groupId ? await groupsModelService.getModelById(profile.groupId) : null;
    const cookiePassHash = session ? md5(`${session.id}:${session.ip}`) : undefined;

    if (
        !session ||
        //passHash !== cookiePassHash ||
        !sessionsModelService.isTokenAlive(session, type === 'access' && token, type === 'refresh' && token) ||
        !user
    ) throw AuthorizedSessionNotFoundException;

    await sessionsModelService.updateModel(session.id, { lastActivityAt: new Date() });

    return {
        tokenPayload,
        session,
        profile,
        user,
        token,
        group
    };
}
