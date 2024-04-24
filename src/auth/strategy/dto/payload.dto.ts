import {Profile, User} from "@prisma/client";

export class TokenPayloadDto {
  id: number;
  profileId: number;
  username: string;
  iat: number;
  ext: number;
}

export class PayloadReturnDto {
  tokenPayload: TokenPayloadDto;
  user: User;
  profile: Profile;
  token: string;
}
