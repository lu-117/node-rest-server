const express = require('express');
//const _ = require('underscore');

const { verificaToken } = require('../middlewares/autentiacion');

let app = express();
let Producto = require('../models/producto');


// Obtener productos

app.get('/productos', verificaToken, (req, res) => {

    //Traer todos los productos 
    // populate: usuario y categoria
    // PAGINADO

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 3;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err
                });
            }
            res.json({
                ok: true,
                productos
            });
        });
});

// Obtener un producto por id

app.get('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    // populate: usuario y categoria
    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productoBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err
                });
            }
            if (!productoBD) {
                return res.status(500).json({
                    ok: false,
                    error: 'Producto no encontrada'
                });
            }
            res.json({
                ok: true,
                producto: productoBD
            });
        });

});

// Buscar productos

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i')

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err
                });
            }
            res.json({
                ok: true,
                productos
            });

        });
});



// Crear un producto 

app.post('/productos', verificaToken, (req, res) => {

    // Grabar usuario
    // Categoria

    let body = req.body;
    let usuario = req.usuario;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario
    });

    producto.save((err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }
        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        res.json({
            ok: true,
            producto: productoBD
        });
    });
});

// Actualiza un producto 

app.put('/productos/:id', (req, res) => {

    // Grabar usuario - categoria

    let id = req.params.id;
    let body = req.body;
    //let body = _.pick(req.body, ['precioUni', 'descripcion', 'categoria', 'nombre', 'disponible']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoBD) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        console.log(body.nombre);
        productoBD.nombre = body.nombre;
        productoBD.precioUni = body.precioUni;
        productoBD.descripcion = body.descripcion;
        productoBD.disponible = body.disponible;
        productoBD.categoria = body.categoria;

        productoBD.save((err, productoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    error: err
                });
            }
            res.json({
                ok: true,
                producto: productoGuardado
            });
        });
    });

});

// Borrar un producto 

app.delete('/productos/:id', (req, res) => {

    //disponible false NO borrar permanentemente

    let id = req.params.id;
    let cambioDisponible = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, cambioDisponible, { new: true }, (err, productoBorrado) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                ok: false,
                error: err
            });
        };
        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    messages: 'Producto no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoBorrado
        });
    })

});

module.exports = app;