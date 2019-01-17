const express = require('express');

const mongoose = require('mongoose');

const router = express.Router();

require('../models/User');

require('../models/Category');

const Category = mongoose.model('Category'); 
 

const { verificaToken, verificaUsuario } = require('../server/middlewares/auth')

// Rutas

router.get('/categorias', verificaToken, (req, res) => {
  // Traer todas las categorías
  Category.find({})
    .populate('usuario', 'nombre email') // el nombre del campo, tal como se declara en el Schema
    .sort({descripcion : 'asc'})
    .then(categorias => {
      if (!categorias) {
        res.json({ message: 'No hay Categorías' });
      } else {
        res.json({ ok: true, categorias: categorias});
      }
    })
    .catch(err => {
      return res.json({ message: err, ok: false });
    });
});

router.get('/categorias/:id', verificaToken, (req, res) => {
  Category.findOne({ _id: req.params.id })
    .populate('usuario')
    .then(categoria => {
      if(!categoria) {
          return res.json({ message: "El id de categoría no es correcto", ok: false });
      } else {
            res.json({ ok: true, categoria: categoria });
      }
      
    })
    .catch(err => {
      return res.json({ message: err, ok: false });
    });
});

// Crear una nueva categoría

router.post('/categorias', verificaToken, (req, res) => {
    // Por alguna razón no valida el token de google 
    const categoria = {
        descripcion: req.body.descripcion,
        usuario : req.usuario._id
    }

    new Category(categoria).save()
                .then(categoria => {
                    console.log(categoria)
                    res.status(200).json({
                        message: 'Category created',
                        ok: true,
                        categoria: categoria
                    });
                })
                .catch(err => {
                    return res.status(400).json({
                        message: err,
                        ok: false
                    });
                })
})

// Actualizar Categoría

router.put('/categorias/:id', verificaToken, (req, res) => {

    let id = req.params.id
    let descripcion = req.body.descripcion
    let usuario = req.usuario._id

    Category.findOne({_id : id})
            .then(category => {
                category.descripcion = descripcion;
                category.usuario = usuario;
                category.save()
                  .then(category => {
                    //console.log(category);
                    res
                      .status(200)
                      .json({
                        message: 'Category updated',
                        ok: true,
                        category
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
            })

})

// Borrar categorías

router.delete('/categorias/:id', [verificaToken, verificaUsuario], (req, res) => {
    // Sólo administrador puede borrar
    // Se debe eliminar, no desactivar
    let id = req.params.id
    Category.deleteOne({ _id: id})
      .then(() => {
        res.status(200)
          .json({
            message: 'Category deleted',
            ok: true
          });
      })
      .catch(err => {
        return res.status(400).json({ message: err, ok: false });
      });
})

module.exports = router; 