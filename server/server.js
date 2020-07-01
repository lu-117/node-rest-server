require('./config/config');

const express = require('express');

// Using Node.js `require()`
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
//maliwares- funciones que siempre se ejecutan 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


// habilitar la carpeta public 
app.use(express.static(path.resolve(__dirname, '../public')));
//app.use(express.static(path.resolve(dirname, '../public')));
console.log(path.resolve(__dirname, '../public'));
// Configuración global de rutas 
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(res => {
    console.log(" Conexión Mongo DB OK! ");
}).catch(err => {
    console.log("Error en la conexión ", err);
});

app.listen(process.env.PORT, () => {
    console.log(`Escuhando por el puesto ${process.env.PORT}`);
});