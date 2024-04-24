import {Profile, Session, User} from "@prisma/client";

export class TokenPayloadDto {
  userId: number;
  sessionId: number;
  iat: number;
  ext: number;
}

export class PayloadReturnDto {
  tokenPayload: TokenPayloadDto;
  session: Session;
  user: User;
  profile: Profile;
  token: string;
}
