const express = require('express');
const fs = require('fs');
const { verificaTokenImg } = require('../middlewares/autentiacion')

let app = express();
// construccion del path absoluto

const path = require('path');

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg')
        res.sendFile(noImagePath);
    }
});


module.exports = app;