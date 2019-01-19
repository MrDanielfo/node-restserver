const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const app = express();

const { verificaTokenImg } = require('../server/middlewares/auth')


app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo
    let img = req.params.img


    let pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    if(fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let noImagePath = path.resolve(__dirname, `../server/assets/no-image.jpg`);
        res.sendFile(noImagePath)
    }   

    


})




module.exports = app 
