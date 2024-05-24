import {Request} from "express";
import {AuthorizedSessionNotFoundException} from "@root/errors";
import {UsersProfilesModelService} from "@models/users/profiles/profiles.service";
import {SessionsModelService} from "@models/sessions/sessions.service";
import {UsersModelService} from "@models/users/users.service";
import {PayloadReturnDto, TokenPayloadDto} from "./dto";

export default async (
    type: 'access' | 'refresh',
    req: Request,
    tokenPayload: TokenPayloadDto,
    sessionsModelService: SessionsModelService,
    usersModelService: UsersModelService,
    usersProfilesModelService: UsersProfilesModelService
): Promise<PayloadReturnDto> => {
    const token = req.get('Authorization').replace('Bearer', '').trim();

    if (!Number.isInteger(tokenPayload.sessionId) || !Number.isInteger(tokenPayload.userId)) throw AuthorizedSessionNotFoundException;

    const session = await sessionsModelService.getSessionById(tokenPayload.sessionId, true)
    const user = await usersModelService.getUserById(tokenPayload.userId, true);
    const profile = await usersProfilesModelService.getProfileById(tokenPayload.userId, true);

    if (
        !session ||
        !sessionsModelService.isTokenAlive(session, type === 'access' && token, type === 'refresh' && token) ||
        !user
    ) throw AuthorizedSessionNotFoundException;

    await sessionsModelService.updateSession(session.id, { lastActivityAt: new Date() });

    return {
        tokenPayload,
        session,
        profile,
        user,
        token
    };
}
