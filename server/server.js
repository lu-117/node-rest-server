require('./config/config');

const express = require('express');

// Using Node.js `require()`
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

//maliwares- funciones que siempre se ejecutan 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
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