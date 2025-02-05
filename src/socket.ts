import { io, type ManagerOptions, type SocketOptions, type Socket, } from "socket.io-client";



export const initSocket = async () => {
    const options : Partial<ManagerOptions & SocketOptions>= {
        forceNew: true,
        // biome-ignore lint/style/useNumberNamespace: <explanation>
        reconnectionAttempts: Infinity,
        timeout: 10000,
        transports: ['websocket']
    };


    const socket = io(import.meta.env.VITE_BACKEND_URL as string, options);
    return socket;
}
