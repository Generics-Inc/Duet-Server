import {Request} from "express";
import {PayloadReturnDto, TokenPayloadDto} from "./dto/payload.dto";
import {AuthorizedUserNotFoundException} from "../../errors";
import {UsersService} from "../../users/users.service";
import {ProfilesService} from "../../users/profiles/profiles.service";

export default async function (
    req: Request,
    tokenPayload: TokenPayloadDto,
    usersService: UsersService,
    profilesService: ProfilesService
): Promise<PayloadReturnDto> {
    const token = req.get('Authorization').replace('Bearer', '').trim();

    const user = await usersService.getUser({ id: tokenPayload.id });
    const profile = await profilesService.getProfile({ id: tokenPayload.id });

    //if (!user || !user.refreshToken) throw AuthorizedUserNotFoundException;
    if (!user) throw AuthorizedUserNotFoundException;

    return {
        token,
        tokenPayload,
        profile,
        user
    };
}
