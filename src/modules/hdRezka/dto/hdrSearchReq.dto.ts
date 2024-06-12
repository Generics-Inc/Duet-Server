import {HdrSearchValueDto} from "./hdrSearchValue.dto";
import {HdrReqStatusInterface} from "../interfaces";


export type HdrSearchReq = {
    status: HdrReqStatusInterface;
    values: HdrSearchValueDto[];
}
