const socket = io();

if (document.cookie == '') {
    document.cookie = crypto.randomUUID();
}

const token = document.cookie

socket.on('connect', () => {
    console.log('Connected with ID:', socket.id);
});

socket.on('recieve-data', (data) => {
    console.log(data);
});

setInterval(() => {
    socket.emit('request-data', token)
}, 1000);