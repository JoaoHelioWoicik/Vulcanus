const express = require('express');
const socket = require('socket.io')
const http = require('http')
const path = require('path')
const mysql = require('mysql2');

const app = express();
const httpServer = http.createServer(app);

const port = 80;

const connection = mysql.createConnection({
    user: 'root',
    password: '12345678',
    database: 'vulcanus'
});

const io = new socket.Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
    transports: ['polling', 'websocket'],
});

app.use(express.static(path.join(__dirname, 'public'), {
    extensions: ['html'],
    index: 'index.html',
}));

app.use((req, res) => {
    res.status(404).json({ error: 'Não achei!', path: req.originalUrl });
});

app.use((err, _, res) => {
    console.error(err);
    res.status(500).json({ error: 'Deu merda!' });
});

io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('register', (data) => {
        // lalala i skip server side validation because im lazy

        
    })

    socket.on('request-data', (token) => {
        console.log(token)
        socket.emit('recieve-data', { token: token });
    });

    socket.on('disconnect', (reason) => {
        console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
    });
});

connection.connect((err) => {
    if (err) {
        console.error('Connection error:', err);
        return;
    }
    console.log('Connected to MySQL');
});

httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
});