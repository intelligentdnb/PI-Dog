const { Router } = require('express');
const express = require('express');
const app = express();
const router = Router();

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const routeDogs = require('./dogs.js');
const routeTemperaments = require('./temperaments.js');


// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use("/dogs", routeDogs);
router.use("/temperaments", routeTemperaments);

module.exports = router;
