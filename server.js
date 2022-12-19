const express = require('express');
const app = express();

const userRoutes = require('./routes/userRoutes');

const cors = require('cors');

//Server ovdje parsa sve POST/PUT requestove u application/json ili application/x-www-form-urlencoded 
app.use(express.urlencoded({extended: true})); 
app.use(express.json());
app.use(cors());

app.use('/users',userRoutes);
require('./connection');



//Ovdje kreiramo i vezemo socket.io i node.js http server jedno s drugim
const server = require('http').createServer(app)
const port = 5001;
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
    }
})

server.listen(port, () => {app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

    console.log(`listening to port ${port}`);
})