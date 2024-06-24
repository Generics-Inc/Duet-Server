import {Server, Socket} from "socket.io";
import {BroadcastOperator} from "socket.io/dist/broadcast-operator";
import {EventsMap} from "socket.io/dist/typed-events";


export type UseSocketEmitReturn<RT extends UseSocketEmitReturnType> = RT extends 'async' ? boolean : UseSocketEmitSend;
export type UseSocketEmitReturnType = 'sync' | 'async';
export type UseSocketEmitType = 'resolve' | 'reject';
export type UseSocketEmitData = any;
export type UseSocketEmitCode = number;
export type UseSocketEmitSend = {
    event: string;
    type: UseSocketEmitType;
    code: UseSocketEmitCode;
    data: UseSocketEmitData;
};

export default function<RT extends UseSocketEmitReturnType = 'async'>(
    socket: Socket | BroadcastOperator<EventsMap, any> | Server,
    event: string,
    data: UseSocketEmitData,
    code: UseSocketEmitCode = 0,
    type: UseSocketEmitType = 'resolve',
    mode: RT = 'async' as RT
): UseSocketEmitReturn<RT> {
    if (mode === 'async') {
        return socket.emit(event, {
            event,
            type,
            code,
            data
        } as UseSocketEmitSend) as UseSocketEmitReturn<RT>;
    } else {
        return {
            event,
            type,
            code,
            data
        } as UseSocketEmitSend as UseSocketEmitReturn<RT>;
    }
}
