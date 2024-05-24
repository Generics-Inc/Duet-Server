import {Request} from "express";
import {AuthorizedSessionNotFoundException} from "@root/errors";
import {ProfilesBaseService} from "@modules/usersBase/profilesBase/profilesBase.service";
import {UsersBaseService} from "@modules/usersBase/usersBase.service";
import {SessionsService} from "@modules/sessions/sessions.service";
import {PayloadReturnDto, TokenPayloadDto} from "./dto";

export default async (
    type: 'access' | 'refresh',
    req: Request,
    tokenPayload: TokenPayloadDto,
    sessionsService: SessionsService,
    usersService: UsersBaseService,
    profilesService: ProfilesBaseService
): Promise<PayloadReturnDto> => {
    const token = req.get('Authorization').replace('Bearer', '').trim();

    if (!Number.isInteger(tokenPayload.sessionId) || !Number.isInteger(tokenPayload.userId)) throw AuthorizedSessionNotFoundException;

    const session = await sessionsService.getUniqueSession({ id: tokenPayload.sessionId }, true)
    const user = await usersService.getUniqueUser({ id: tokenPayload.userId }, true);
    const profile = await profilesService.getProfile({ id: tokenPayload.userId }, true);

    if (
        !session ||
        !sessionsService.tokenLifeCheck(session, type === 'access' && token, type === 'refresh' && token) ||
        !user
    ) throw AuthorizedSessionNotFoundException;

    await sessionsService.updateSessionLastActivity(session.id);

    return {
        tokenPayload,
        session,
        profile,
        user,
        token
    };
}
