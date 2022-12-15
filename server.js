const express = require('express');
const app = express();

const cors = require('cors');

app.use(express.urlencoded({extended: true})); 
app.use(express.json());
app.use(cors());

const server = require('http').createServer(app)
const port = 5001;
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET','POST']
    }
})

server.listen(port, () => {
    console.log(`listening to port ${port}`);
})