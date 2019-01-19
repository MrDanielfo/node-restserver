const express = require('express');

const mongoose = require('mongoose');

const app = express();

const usuarios = require('./users')

const login = require('./login');

const categorias = require('./categories');

const productos = require('./products');

const upload = require('./upload');

const images = require('./images');

app.use('/', usuarios);

app.use('/', login);

app.use('/', categorias); 

app.use('/', productos); 

app.use('/', upload);

app.use('/', images);

module.exports = app

