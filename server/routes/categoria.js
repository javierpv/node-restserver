const express = require('express');
const { verificarToken, verificarAdminRole } = require('../middlewares/autenticacion');
const _ = require('underscore');

const Categoria = require('../models/categoria');

const app = express();

app.get('/categoria', verificarToken, function (req, res) {

    Categoria.find({}, 'descripcion')
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.count({}, (err, conteo) => {

                res.json({
                    ok: true,
                    categorias,
                    total: conteo
                });

            });

        });

});

app.get('/categoria/:id', verificarToken, function (req, res) {

    let id = req.params.id;

    Categoria.findById(id, 'descripcion')
        .exec((err, categoria) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!categoria) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'La categoría no existe'
                    }
                });
            }

            res.json({
                ok: true,
                categoria
            });

        });

});

app.post('/categoria', [verificarToken], function (req, res) {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

app.put('/categoria/:id', [verificarToken], function (req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });


});

app.delete('/categoria/:id', [verificarToken, verificarAdminRole], function (req, res) {

    let id = req.params.id;

    //ELIMINACIÓN FÍSICA

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La categoría no existe'
                }
            });

        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });


});


module.exports = app;