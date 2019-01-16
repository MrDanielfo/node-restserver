const express = require('express');

const path = require('path')

const mongoose = require('mongoose'); 

const app = express();

const { PORT, MONGOURI } = require('./config/config');

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Static Folder 
app.use(express.static(path.join(__dirname, '../public'))); 

// Ver el archivo index que es donde se ordenaron las rutas  
// Nueva opción 
const index = require('../routes/index')


mongoose.connect(MONGOURI, 
    {   useCreateIndex: true,
        useNewUrlParser : true}
).then(() => {
    console.log('MongoDB Connected')
}).catch(err => {
    console.log(err)
})

app.use('/', index)


app.listen(PORT, () => console.log(`Escuchando el puerto: ${PORT}`));

/* La idea es que el archivo server siempre se mantenga limpio */ 