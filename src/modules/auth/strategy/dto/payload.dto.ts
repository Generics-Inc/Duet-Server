import {UserModelDto} from "@models/users/dto";
import {ProfileDto} from "@models/users/profiles/dto";
import {SessionModelDto} from "@models/sessions/dto";
import {GroupModelDto} from "@models/groups/dto";

export class TokenPayloadDto {
  userId: number;
  sessionId: number;
  accountId: number;
  iat: number;
  ext: number;
}

export class PayloadReturnDto {
  tokenPayload: TokenPayloadDto;
  session: SessionModelDto;
  user: UserModelDto;
  profile: ProfileDto;
  token: string;
  group?: GroupModelDto;
}
