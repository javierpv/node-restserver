require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//Configuración global de rutas
app.use(require('./routes/index'));

// parse application/json
app.use(bodyParser.json());

//Habilitar el directorio public
app.use(express.static(path.resolve(__dirname, '../public')));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(resp => { console.log('Base de datos ONLINE') })
    .catch(err => { console.log("Error al conectar base de datos", err) });

app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puerto ${process.env.PORT}`);
});