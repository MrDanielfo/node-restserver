const express = require('express');

const mongoose = require('mongoose');

const router = express.Router();

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken'); 

const { CADUCIDAD, SEED } = require('../server/config/config');

// Llamar modelo

require('../models/User')
const User = mongoose.model('User')

router.post('/login', (req, res) => {

    
    const {email, password } = req.body

    User.findOne({email : email })
        .then(usuario => {

            if(!usuario) {
                return res.json({
                    ok: false,
                    message: "User or password are not right"
                })
            }

            // Evaluar contraseña 

            if(!bcrypt.compareSync(password, usuario.password)) {
                return res.json({
                  ok: false,
                  message: 'User or password are not right'
                });
            }

            let token = jwt.sign(
              {
                usuario: usuario
              },
                SEED,
              { expiresIn: CADUCIDAD }
            );

            res.json({
                ok: true,
                usuario,
                token: token
            })
        })
        .catch(err => {
            return res.json({ message: err, ok: false });
        })

    


})




module.exports = router; 