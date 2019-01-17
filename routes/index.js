const express = require('express');

const mongoose = require('mongoose');

const app = express();

const usuarios = require('./users')

const login = require('./login');

const categorias = require('./categories');

const productos = require('./products');

app.use('/', usuarios);

app.use('/', login);

app.use('/', categorias); 

app.use('/', productos); 

module.exports = app

