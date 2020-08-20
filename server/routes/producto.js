const express = require('express');
const { verificarToken, verificarAdminRole } = require('../middlewares/autenticacion');
const _ = require('underscore');

const Producto = require('../models/producto');

const app = express();

app.get('/productos', verificarToken, function (req, res) {

    let desde = parseInt(req.query.desde) || 0;
    let limite = parseInt(req.query.limite) || 5;

    Producto.find({ disponible: true })
        .sort('nombre')
        .populate('usuario')
        .populate('categoria')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.count({ disponible: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    productos,
                    total: conteo
                });

            });

        });

});

app.get('/producto/:id', verificarToken, function (req, res) {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario')
        .populate('categoria')
        .exec((err, producto) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El producto no existe'
                    }
                });
            }

            res.json({
                ok: true,
                producto
            });

        });

});

app.get('/productos/buscar/:termino', verificarToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });

        });


});

app.post('/producto', [verificarToken], function (req, res) {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });

});

app.put('/producto/:id', [verificarToken], function (req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });


});

app.delete('/producto/:id', [verificarToken, verificarAdminRole], function (req, res) {

    let id = req.params.id;

    let cambiaDisponible = {
        disponible: false
    }

    //ELIMINACIÓN LÓGICA
    Producto.findByIdAndUpdate(id, cambiaDisponible, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });

        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });

});




module.exports = app;