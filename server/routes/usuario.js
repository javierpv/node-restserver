const express = require('express');
const app = express();

const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');

app.get('/usuario', function (req, res) {

    let desde = parseInt(req.query.desde) || 0;
    let limite = parseInt(req.query.limite) || 5;

    Usuario.find({ estado: true }, 'nombre email estado')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    total: conteo
                });

            });

        });


});

app.post('/usuario', function (req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

});

app.put('/usuario/:id', function (req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });


});

app.delete('/usuario/:id', function (req, res) {

    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }

    //ELIMINACIÓN FÍSICA

    // Usuario.findByIdAndRemove(id, estado, (err, usuarioDB) => {

    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if (!usuarioDB) {

    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'El usuario no existe'
    //             }
    //         });

    //     }

    //     res.json({
    //         ok: true,
    //         usuario: usuarioDB
    //     });

    // });

    //ELIMINACIÓN LÓGICA
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });

        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

});

module.exports = app;