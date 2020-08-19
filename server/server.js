require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(require('./routes/usuario'));

// parse application/json
app.use(bodyParser.json());

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(resp => { console.log('Base de datos ONLINE') })
    .catch(err => { console.log("Error al conectar base de datos", err) });

app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puerto ${process.env.PORT}`);
});