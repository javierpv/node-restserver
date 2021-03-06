//============
// Puerto
//============

process.env.PORT = process.env.PORT || 3000;


//============
// Entorno
//============

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//============
// Caducidad TOKEN
//============
//60 segundos
//60 minutos
//24 horas
//30 días

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//============
// SEES de auntenticación   
//============

process.env.SEED = process.env.SEED || 'esto-es-desarrollo';



//============
// Base de datos
//============

let urlDB;

if (process.env.NODE_ENV === 'dev')
    urlDB = 'mongodb://localhost:27017/cafe';
else
    urlDB = process.env.MONGO_URI;

process.env.URLDB = urlDB;


//============
// Google CLIENT_ID
//============

process.env.CLIENT_ID = process.env.CLIENT_ID || '220198319039-1eip85tj2mqj2i9b6s1q52d9q58ktm1m.apps.googleusercontent.com';