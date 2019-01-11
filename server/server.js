const express = require('express');

const app = express();

const { PORT } = require('./config/config');

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.json({
    message: 'Hola',
    nombre: 'Josué'
  });
});

app.get('/usuarios', (req, res) => {
    res.json('Get Usuario')
});

app.post('/usuarios', (req, res) => {
  let usuario = req.body;
  //console.log(usuario)

  if(usuario.nombre === undefined) {
      res.status(400).json({
          message: "Not found",
          ok: false
      })
  } else {
      res.json({ usuario });
  }
  
});

app.put('/usuarios/:id', (req, res) => {

    let id = req.params.id

    res.json({
        id   
    });
});

app.delete('/usuarios', (req, res) => {
  res.json('DELETE usuario');
});

app.listen(PORT, () => console.log(`Escuchando el puerto: ${PORT}`));
