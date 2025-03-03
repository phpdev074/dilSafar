import { Server } from 'socket.io';
const socket = (app, server) => {
    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log('A user connected');
        socket.on('message', (data) => {
            console.log('Message from client:', data);
            io.emit('message', data);
        });
    });
}   

export default socket;