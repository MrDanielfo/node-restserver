const express = require('express');

const mongoose = require('mongoose'); 

const underscore = require('underscore'); 

const router = express.Router();

const bcrypt = require('bcryptjs'); 

// Llamar modelo

require('../models/User')
const User = mongoose.model('User')

// Llamar middleware de autenticación

const { verificaToken, verificaUsuario } = require('../server/middlewares/auth')

router.get('/', (req, res) => {
    res.json({
        message: 'Hola',
        nombre: 'Josué'
    });
});

router.get('/usuarios', verificaToken, (req, res) => {

    // Parámetros opciones, para paginador
    let desde = req.query.desde || 0
        desde = parseInt(desde)

    let limite = req.query.limite || 5
        limite = Number(limite)

    // Parámetros para decidir qué campos queremos que se envíen

    User.find({estado: true}, 'nombre email role estado google img')
    .skip(desde)
    .limit(limite)
    .then(users =>{

        // Método para mostrar el total de usuarios registrador
        // Puede servir después para crear paginador en forma gráfica 
        User.countDocuments({estado: true})
        .then(conteo => {
            if (!users) {
              res.json({ message: 'No users in the database' });
            } else {
              res.json({ ok: true, users: users, conteo : conteo });
            }

        })
        .catch(err => {
            return res.json({ message: err, ok: false });
        })
    }).catch(err => {
        return res.json({ message: err, ok: false });
    })

    
});

router.post('/usuarios', [verificaToken, verificaUsuario], (req, res) => {
  const { nombre, email, password, role } = req.body;

  let usuario = {
    nombre,
    email,
    password,
    role
  };

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(usuario.password, salt, (err, hash) => {
      if (err) {
        throw err;
      } else {
        usuario.password = hash;

        new User(usuario)
          .save()
          .then(usuario => {
            // para engañar al usuario y no darle el password
            //usuario.password = null;

            console.log(usuario);
            res.status(200).json({
              message: 'User registered',
              ok: true,
              usuario: usuario
            });
          })
          .catch(err => {
            return res.status(400).json({
              message: err,
              ok: false
            });
          });
      }
    });
  });
});

router.put('/usuarios/:id', [verificaToken, verificaUsuario], (req, res) => {
  let id = req.params.id;
  let body = underscore.pick(req.body, [
    'nombre',
    'email',
    'img',
    'role',
    'estado'
  ]);

  User.findByIdAndUpdate(id, body, { runValidators: true })
    .then(user => {
      console.log(user);
      res.status(200).json({
        message: 'User updated',
        ok: true,
        usuario: user
      });
    })
    .catch(err => {
      throw err;
    });
});

router.delete('/usuarios/:id', [verificaToken, verificaUsuario], (req, res) => {
  let id = req.params.id;

  User.findById(id)
    .then(usuario => {
      if (usuario.estado == true) {
        usuario.estado = false;
        // Se salva tal y como viene con la petición, en este caso no se usa User
        usuario
          .save()
          .then(user => {
            res.status(200).json({
              message: 'User deleted',
              ok: true
            });
          })
          .catch(err => {
            throw err;
          });
      } else {
        return res.status(400).json({
          message: 'Usuario no encontrado',
          ok: false
        });
      }
    })
    .catch(err => {
      return res.status(400).json({
        message: err,
        ok: false
      });
    });
});

module.exports = router 