const express = require('express');

const mongoose = require('mongoose');

const router = express.Router();

require('../models/Producto');

const Product = mongoose.model('Product');

const { verificaToken, verificaUsuario } = require('../server/middlewares/auth');

// Obtener Productos

router.get('/productos', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = parseInt(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);


    //Populate Usuario y Categorías
    Product.find({ disponible: true })
      .populate('usuario', 'nombre email')
      .populate('categoria', 'descripcion')
      .sort({ nombre: 'asc' })
      .skip(desde)
      .limit(limite)
      .then(productos => {
        if (!productos) {
          res.json({ message: 'No hay Categorías' });
        } else {
          res.json({ ok: true, productos: productos });
        }
      })
      .catch(err => {
        return res.json({ message: err, ok: false });
      });

})


// Obtener producto por ID
router.get('/productos/:id', verificaToken, (req, res) => {
  Product.findOne({ _id: req.params.id })
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .then(producto => {
      if (!producto) {
        return res.json({
          message: 'El id de producto no es correcto',
          ok: false
        });
      } else {
        res.json({ ok: true, producto: producto });
      }
    })
    .catch(err => {
      return res.json({ message: err, ok: false });
    });
});

// Crear producto
// Grabar usuario
// Grabar categoría

router.post('/productos', verificaToken, (req, res) => {
   const { nombre, precioUni, descripcion, categoria } = req.body

   let usuario = req.usuario._id

   const producto = {
       nombre, 
       precioUni,
       descripcion,
       categoria,
       usuario
   }

   new Product(producto).save()
            .then(producto => {
                console.log(producto)
                res.status(201)
                  .json({
                    message: 'Producto creado',
                    ok: true,
                    producto: producto
                  });
            })
            .catch(err => {
                return res.status(400).json({
                    message: err,
                    ok: false
                })
            })


})


// Actualizar producto
router.put('/productos/:id', verificaToken, (req, res) => {
  let id = req.params.id;
  let nombre = req.body.descripcion;
  let precioUni = req.body.precioUni;
  let descripcion = req.body.descripcion;
  let categoria = req.body.categoria; 
  let usuario = req.usuario._id;

  Product.findOne({ _id: id })
    .then(product => {
      product.nombre = nombre;
      product.precioUni = precioUni;
      product.descripcion = descripcion;
      product.categoria = categoria;
      product.usuario = usuario;
      product.save()
        .then(product => {
          console.log(product);
          res.status(200).json({
            message: 'Product updated',
            ok: true,
            product
          });
        })
        .catch(err => {
          throw err;
        });
    })
    .catch(err => {
      return res.status(400).json({
        message: err,
        ok: false
      });
    });
});


// Eliminar producto 
// No se borra, se desactiva disponible : falso

router.delete('/productos/:id', [verificaToken, verificaUsuario], (req, res) => {
  let id = req.params.id;

  Product.findById(id)
    .then(product => {
      if (product.disponible == true) {
        product.disponible = false;
        // Se salva tal y como viene con la petición, en este caso no se usa User
        product.save()
          .then(product => {
            res.status(200).json({
              message: 'Product Deleted',
              ok: true
            });
          })
          .catch(err => {
            throw err;
          });
      } else {
        return res.status(400).json({
          message: 'Producto no encontrado',
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

// Buscar producto

router.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino

    let expTermino = new RegExp(termino, 'i')

    Product.find({nombre : expTermino })
      .populate('categoria', 'descripcion')
      .then(productos => {
            if (!productos) {
              res.json({ message: 'No hay Categorías' });
            } else {
              res.json({ ok: true, productos: productos });
            }
      })
      .catch(err => {
          return res.status(400).json({ message: err, ok: false });
      })



})


module.exports = router; 
