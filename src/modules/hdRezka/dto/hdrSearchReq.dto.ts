export enum hdrReqStatus {
    OK = 'OK',
    ERROR = 'ERROR',
    NO_MIRROR = 'NO_MIRROR'
}

export type hdrSearchReq = {
    status: hdrReqStatus;
    values: hdrSearchValue[];
}

export type hdrSearchValue = {
    name: string;
    addName: string;
    rating: number | null;
}
