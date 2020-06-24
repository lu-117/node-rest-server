require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//maliwares- funciones que siempre se ejecutan 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.get('/usuario', function(req, res) {
    res.json('get Usuario')
});

/* app.post('/usuario', function(req, res) {
    res.json('post Usuario')
}); */

app.post('/usuario', function(req, res) {

    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nomnbre es necesario'
        });

    } else {
        res.json({
            body
        });
    }

});

app.put('/usuarios/:id', function(req, res) {
    let id = req.params.id;
    res.json({
        id
    });
});

app.delete('/usuario', function(req, res) {
    res.json('delete Usuario')
});

app.listen(process.env.PORT, () => {
    console.log(`Escuhando por el puesto ${process.env.PORT}`);
});