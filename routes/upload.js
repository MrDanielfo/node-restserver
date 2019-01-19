const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const mongoose = require('mongoose');

const fs = require('fs'); 
const path = require('path'); 
// default options
app.use(fileUpload());

require('../models/User');

require('../models/Producto');

const User = mongoose.model('User')
const Product = mongoose.model('Product')

app.put('/upload/:tipo/:id', function (req, res) {

    //console.log(req.files)

    let tipo = req.params.tipo
    let id = req.params.id
 
    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
    }


    // Validar tipo
    let tiposValidos = ['productos', 'usuarios']

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({ ok: false, message: "Type not valid" })
    }

    // Extensiones permitidas 

    let extensiones = ['png', 'jpg', 'gif', 'jpeg']
    
    let archivo = req.files.archivo; // el archivo es el nombre del input, pero puede usarse el que se guste

    let nombreCortado = archivo.name.split('.')
    // split nos ayuda a cortar

    let extArchivo = nombreCortado[nombreCortado.length - 1];
    // colocar el length -1 nos devuelve siempre la última posición 

    if(extensiones.indexOf(extArchivo) < 0) {

        return res.status(400).json({ ok: false, message: "File extension not allowed" })

    } 

    // Cambiar nombre al archivo 
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extArchivo }`

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({ ok: false, message: err })

        // Logica de Modelo 
        if(tipo === "usuarios") {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }
        
        
    });

    

});

function imagenUsuario(id, res, nombreArchivo) {
    User.findOne({_id : id})
        .then(usuario => {
            console.log(usuario)
            if(!usuario) {
                borrarImagen('usuarios', nombreArchivo);
                return res.status(500).json({ ok: false, message: "User does not exist" });
            }

            borrarImagen('usuarios', usuario.img)

            usuario.img = nombreArchivo
            usuario.save()
                   .then(usuario => {
                       res.status(200).json({
                           message: 'User image Uploaded',
                           ok: true,
                           usuario,
                           img: nombreArchivo
                       });
                   })
                   .catch(err => {
                       return res.status(500)
                           .json({ ok: false, message: err });
                   })
        })
        .catch(err => {
            borrarImagen('usuarios', nombreArchivo);
            return res.status(500)
              .json({ ok: false, message: err });
        })
}

function imagenProducto(id, res, nombreArchivo) {
    Product.findOne({ _id: id })
        .then(producto => {
            if (!producto) {
                borrarImagen('productos', nombreArchivo);
                return res.status(500).json({ ok: false, message: "Product does not exist" });
            }

            borrarImagen('productos', producto.img)

            producto.img = nombreArchivo
            producto.save()
                .then(producto => {
                    res.status(200).json({
                        message: 'Product image Uploaded',
                        ok: true,
                        producto,
                        img: nombreArchivo
                    });
                })
                .catch(err => {
                    return res.status(500)
                        .json({ ok: false, message: err });
                })
        })
        .catch(err => {
            borrarImagen('productos', nombreArchivo);
            return res.status(500)
                .json({ ok: false, message: err });
        })
}


function borrarImagen(tipo, urlImagen) {
    let pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${urlImagen}`)

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app