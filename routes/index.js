const express = require('express');

const mongoose = require('mongoose');

const app = express();

const usuarios = require('./users')

const login = require('./login');

app.use('/', usuarios);

app.use('/', login);

module.exports = app

