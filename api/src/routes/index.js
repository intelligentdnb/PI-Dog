const { Router } = require('express');
const express = require('express');
const app = express();
const router = Router();
const { getAllDogs, getTemperament, postDogs, getDogsApi, showTemperaments } = require("./controladores.js");

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
//const routeDogs = require('./dogs.js');
//const routeTemperaments = require('./temperaments.js');

app.use(express.json())
// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
//router.use("/dogs", routeDogs);
//router.use("/temperaments", routeTemperaments);

router.get("/dogs", getDogsApi); 
router.get("/dogs/:id", getDogsApi);
router.post("/dogs", postDogs);
router.get("/temperaments", showTemperaments);

module.exports = router;
