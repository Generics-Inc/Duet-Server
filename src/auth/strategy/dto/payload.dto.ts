import {ProfileIncludes, SessionIncludes, UserIncludes} from "../../../types";

export class TokenPayloadDto {
  userId: number;
  sessionId: number;
  iat: number;
  ext: number;
}

export class PayloadReturnDto {
  tokenPayload: TokenPayloadDto;
  session: SessionIncludes;
  user: UserIncludes;
  profile: ProfileIncludes;
  token: string;
}
