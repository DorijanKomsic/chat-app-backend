const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', false);

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.3lryina.mongodb.net/${process.env.DB_SCHEME}?retryWrites=true&w=majority`, () => {
    console.log('connected to mongodb')
})
