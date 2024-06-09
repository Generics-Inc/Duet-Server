import {hdrSearchValueDto} from "./hdrSearchValue.dto";
import {hdrReqStatusInterface} from "../interfaces";


export type hdrSearchReq = {
    status: hdrReqStatusInterface;
    values: hdrSearchValueDto[];
}
