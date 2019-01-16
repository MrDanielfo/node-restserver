const express = require('express');

const mongoose = require('mongoose');

const router = express.Router();

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken'); 

const { CADUCIDAD, SEED, CLIENT } = require('../server/config/config');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT);

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

// Configuración de Google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img : payload.picture,
        google: true

    }
}


router.post('/google', async(req, res) => {

    let token = req.body.idtoken
    

    let googleUser = await verify(token)
        .catch(err => {
           return res.status(403).json({
                ok: false,
                err
           }) 
        })


    // Validaciones 
    User.findOne({email : googleUser.email})
        .then(user => {
            if(user != null) {
                if(user.google === false) {
                    return res.status(500).json({
                      ok: false,
                      err: {
                          message: 'Debe de usar su autenticación normal'
                      }
                    });
                } else {
                    let token = jwt.sign(
                        {
                            user: user
                        },
                        SEED,
                        { expiresIn: CADUCIDAD }
                    );

                    return res.json({
                        ok: true,
                        user: user,
                        token: token
                    })
                }
            } else {
                // Si el usuario no existe en la base de datos 
                const usuario = {
                    nombre: googleUser.nombre,
                    email: googleUser.email,
                    img: googleUser.img,
                    google : true,
                    password: ':)'
                }

                new User(usuario).save()
                    .then(user => {
                        console.log(user)
                        let token = jwt.sign(
                            {
                                user: user
                            },
                            SEED,
                            { expiresIn: CADUCIDAD }
                        )

                        return res.json({
                            ok: true,
                            user: user,
                            token: token
                        })
                    })
                    .catch(err => {
                        return res.json({
                          message: err,
                          ok: false
                        });
                    })  
            }


        })
        .catch(err => {
            return res.json({ message: err, ok: false });
        })
})




module.exports = router; 