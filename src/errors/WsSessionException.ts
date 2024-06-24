import {Socket} from "socket.io";
import {sendSocketMessage} from "@root/helpers";


export default function (socket: Socket): false {
    sendSocketMessage(socket, 'status', 'Сессия недействительна', 0, 'reject');
    socket.disconnect();
    return false;
}
