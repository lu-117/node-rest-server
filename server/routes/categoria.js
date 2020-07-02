const express = require('express');

let { verificaAdminRol, verificaToken } = require('../middlewares/autentiacion');

let app = express();

let Categoria = require('../models/categoria');
const _ = require('underscore');

// Mostrar todas las categorías

app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    ok: false,
                    error: err
                });
            }

            res.json({
                ok: true,
                categorias
            })
        });
});

// Ctegoria por id

app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id)
        .populate('usuario', 'nombre email')
        .exec((err, categoriaBD) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    ok: false,
                    error: err
                });
            }
            if (!categoriaBD) {
                return res.status(500).json({
                    ok: false,
                    error: 'Categoría no encontrada'
                });
            }

            res.json({
                ok: true,
                categoria: categoriaBD
            })
        });


});


// Crear categoria

app.post('/categoria', [verificaToken, verificaAdminRol], (req, res) => {

    let body = req.body;
    let usuario = req.usuario;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario

    });

    categoria.save((err, categoriaBD) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                error: err
            });
        }
        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        //usuarioDB.password = null;
        res.json({
            ok: true,
            categoria: categoriaBD
        });
    });
});

// actualoiza categoria

app.put('/categoria/:id', [verificaToken, verificaAdminRol], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);

    /* let body = req.body;
    let descCategoria = {
        descripcion: body.descripcion
    } */

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaBD) => {

        if (err) {
            console.log(err);
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaBD
        });
    });
});

//Remueve una categoria
app.delete('/categoria/:id', [verificaToken, verificaAdminRol], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                ok: false,
                error: err
            });
        };
        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    messages: 'Categoria no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: categoriaBorrada
        });
    })


});

module.exports = app;