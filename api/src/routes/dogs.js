const { Router } = require("express");
const router = Router();
const axios = require("axios");
const { Dog, Temperament } = require("../db.js");
require("dotenv").config(); //Requiero dontenv asi me archivo .env tiene el nmbre de process 
const { API, API_KEY } = process.env; //puedo importar las variables




