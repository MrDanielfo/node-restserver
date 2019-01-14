const express = require('express');

const mongoose = require('mongoose'); 

const app = express();

const { PORT, MONGOURI } = require('./config/config');

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const usuarios = require('../routes/users')


mongoose.connect(MONGOURI, 
    {   useCreateIndex: true,
        useNewUrlParser : true}
).then(() => {
    console.log('MongoDB Connected')
}).catch(err => {
    console.log(err)
})

app.use('/', usuarios)

app.listen(PORT, () => console.log(`Escuchando el puerto: ${PORT}`));
