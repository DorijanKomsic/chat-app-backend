const express = require('express');
const app = express();

const userRoutes = require('./routes/userRoutes');

const cors = require('cors');
const Message = require('./models/Messages');
const User = require('./models/Users');

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
        origin: '*'
    }
});


const rooms = ['gen-chat#1','gen-chat#2','gen-chat#3'];



async function getMessagesFromRoom(room) {
    let roomMessages = await Message.aggregate([
        {$match: {to: room}},
        {$group: {_id: '$date', messagesByDate: {$push: '$$ROOT'}}}
    ])
    return roomMessages;
}

function sortMessagesByDate(messages) {
    return messages.sort(function(a ,b){
        let date1 = a._id.split('/');  //We split the dates from dd/mm/yyyy to an array [dd,mm,2022]
        let date2 = b._id.split('/');

        date1 = date1[2] + date1[0] + date1[1]; //Then we reformat it to yyyyddmm
        date2 = date2[2] + date2[0] + date2[1];

        return date1 < date2 ? -1 : 1
    });
}

// socket connection
io.on('connection', socket => {

    

    socket.on('new-user', async () => {
        const members = await User.find();
        io.emit('new-user', members);
    })    


    socket.on('join-room', async(newRoom, previousRoom) => {
        socket.join(newRoom);
        socket.leave(previousRoom);
        let roomMessages = await getMessagesFromRoom(newRoom);
        roomMessages = sortMessagesByDate(roomMessages);
        socket.emit('room-messages', roomMessages);
    })


    socket.on('message-room', async(room, content, sender, time, date) => {
        console.log('message: ', content);
        const newMessage = await Message.create({content, from: sender, time, date, to: room});
        let roomMessages = await getMessagesFromRoom(room);
        roomMessages = sortMessagesByDate(roomMessages);
        //send messages
        io.to(room).emit('room-messages', roomMessages);
        socket.broadcast.emit('notifications', room);
    })


    app.delete('/logout', async(req, res)=> {
            try {
                const {_id, newMessages} = req.body;
                const user = await User.findById(_id);
                user.Status = 'offline';
                user.newMessages = newMessages;
                await user.save();
                const members = await User.find();
                socket.broadcast.emit('new-user', members);
                res.status(200).send();

            } catch (e) {
                console.log(e);
                res.status(400).send();
        }
    })

})

app.get('/rooms', (req, res) => {
    res.json(rooms);
})


server.listen(port, () => {

    console.log(`listening to port ${port}`);
})