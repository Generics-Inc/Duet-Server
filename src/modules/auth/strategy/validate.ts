import {Request} from "express";
import {AuthorizedSessionNotFoundException} from "@root/errors";
import {UsersProfilesBaseService} from "@modules/usersBase/profilesBase/profilesBase.service";
import {UsersBaseService} from "@modules/usersBase/usersBase.service";
import {PayloadReturnDto, TokenPayloadDto} from "./dto";
import {SessionsBaseService} from "@modules/sessionsBase/sessionsBase.service";

export default async (
    type: 'access' | 'refresh',
    req: Request,
    tokenPayload: TokenPayloadDto,
    sessionsBaseService: SessionsBaseService,
    usersBaseService: UsersBaseService,
    usersProfilesBaseService: UsersProfilesBaseService
): Promise<PayloadReturnDto> => {
    const token = req.get('Authorization').replace('Bearer', '').trim();

    if (!Number.isInteger(tokenPayload.sessionId) || !Number.isInteger(tokenPayload.userId)) throw AuthorizedSessionNotFoundException;

    const session = await sessionsBaseService.getSessionById(tokenPayload.sessionId, true)
    const user = await usersBaseService.getUserById(tokenPayload.userId, true);
    const profile = await usersProfilesBaseService.getProfileById(tokenPayload.userId, true);

    if (
        !session ||
        !sessionsBaseService.isTokenAlive(session, type === 'access' && token, type === 'refresh' && token) ||
        !user
    ) throw AuthorizedSessionNotFoundException;

    await sessionsBaseService.updateSession(session.id, { lastActivityAt: new Date() });

    return {
        tokenPayload,
        session,
        profile,
        user,
        token
    };
}
