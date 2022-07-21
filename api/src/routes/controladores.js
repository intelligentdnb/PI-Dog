const axios = require('axios');
const {Dog, Temperament} = require('../db');
require('dotenv').config();
const {API, API_KEY} = process.env;


//PETICIONES 


//Funcion para capturar todos los temperamentos de los perros,
//crear un solo array separados con el join().split(', '),
//y retornar nuevamente con el join().split(',') para dejarlo listo
const getTemperament = async()=>{
    try {
        const apiDogs = await axios.get(API+API_KEY);
        const temp = apiDogs.data.map(el => el.temperament).join().split(', ');
        return temp.join().split(",");

    } catch (error) {
        throw new Error(error +' Error al guardar los temperamentos')
    }
};


//funcion para mostrar los temperamentos desde mi base de datos
const showTemperaments = async (req, res) => {
        try {
            const temperament = await Temperament.findAll({
                attributes:['id', 'name']
            });
            res.json(temperament);
    } catch (error) {
        throw new Error(error + 'Error en la extracion de temperamentos de la BD')
    }
}

//Esta funcion llevo a todos los temperamentos de la API a mi data base.
const temperamentsToDB = async() => {
    var {data} = await axios.get(`${API}${API_KEY}`)
    var temperaments = []
    data.forEach(e => {
        if(typeof(e.temperament) === "string"){
            let res = e.temperament.split(",")
            res = res.map(e => e.trim())
            temperaments = temperaments.concat(res)
        }
    });
    temperaments = Array.from(new Set(temperaments)).sort() 
   // Set permite almacenar valores únicos de cualquier tipo
   // Array.from crea una nueva instancia de Array a partir de un objeto iterable
    for await (var temp of temperaments) {
        Temperament.create({name: temp})
    }
    return
};


//En esta funcion traemos los datos(id, name) desde mi BD temperaments
//para luego cuando ser utilizados
const getTemperamentMyDb = async(req, res) =>{
    try {
        const temperament = await Temperament.findAll({
            attributes:['id', 'name']
        });
        return temperament
    } catch (error) {
        throw new Error(error + 'Error en la extracion de temperamentos de la BD')
    }
}

//Funcion que me trae toda la info desde la api de dogs, se mapea y se retorna
const getApiDogs = async()=>{
    try {
        const temperament = await getTemperamentMyDb();
        let dogs = await axios.get(API+API_KEY);
        
        let dog = dogs.data.map(e =>{
            return{
                id: e.id,
                name: e.name,
                image: e.image.url,
                temperaments: e.temperament ? e.temperament : "No tiene temperamentos definidos",
                life_span_min: e.life_span.split(" - ").shift(),  
                life_span_max: e.life_span.split(" - ").pop().split(" ").shift(),  
                height_min: e.height.metric.split(" - ").shift(), 
                height_max: e.height.metric.split(" - ").pop(),
                weight_min: e.weight.metric.split(" - ").shift(),
                weight_max: e.weight.metric.split(" - ").pop(),
            };
        });
        //console.log(dog)
        return dog;
    } catch (error) {
        throw new Error(error+' Error al extraer los perros de la API')
    }
}
//Funcion que me trae toda la info desde mi BD dogs, 
//relacionamos la info temperaments con lo que tenemos en la BD de temperaments
//creada por nosotros, se termina retornado la respuesta 
const getMyDb = async() =>{
    try {
        const db = await Dog.findAll({
            include:{
                model: Temperament,
                attributes: ['name'],
                through:{
                    attributes:[]
                }
            }
        })
        return db
    } catch (error) {
        throw new Error(error +' Error en la captura de datos en BD')
    }
}

//Funcion que concatena la llamada de la API junto con la llamada a la BD
const getAllDogs = async(req, res)=>{
    
    try {
        const dogApi = await getApiDogs();
        const dogDb = await getMyDb();
    
        const allDogs = dogApi.concat(dogDb);
        return allDogs;
    } catch (error) {
        throw new Error(error+' Error al concatenar la respuesta de miBd con la de la APi')
    }
}

/////

//Funcion que me mapea todos los perros tanto de la API como de la BD
//pasamos name por query,condicionamos name,buscamos y mostramos por este. 
//pasamos id por params, condicionamos id, buscamos y mostramos por este.
const getDogsApi = async(req, res) =>{
    try {
        const {name} = req.query;
        const {id} = req.params;
        const dogsAll = await getAllDogs();
        //console.log(dogsAll.length)
        if(name){
            let dogName = dogsAll.filter(el=>el.name.toLowerCase().includes(name.toString().toLowerCase()));
            dogName.length
                ?res.status(200).send(dogName)
                :res.status(404).send('No se encontro una Raza ese nombre')
                ;
        }else if(id){
            let dogId = dogsAll.filter(el => el.id == id);
            dogId.length
                ?res.status(200).send(dogId)
                :res.status(400).send('No se encontro un Dog con el ID = '+ id);
        }else{
            return res.status(200).send(dogsAll);
        }
      
    } catch (error) {
        throw new Error(error+' Error en el getDogsApi')
    }
}

//Funcion para crear un DOG

const postDogs = async(req, res) =>{
    try{
        let {
            name,
            height_max,
            height_min,
            weight_max,
            weight_min,
            life_span_max,
            life_span_min,
            image,
            temperament,
            createInDb
        } = req.body;

        const dogsAll = await getAllDogs();
        const result = dogsAll.filter(el => el.name.toLowerCase() === name.toLowerCase());
        if(!result.length){
            const dogCreate = await Dog.create({
                name,
                height_min,
                height_max,
                weight_min,
                weight_max,
                life_span_min,
                life_span_max,
                image,
                createInDb
            })

            let tempDb = await Temperament.findAll({where:{name:temperament}});
            dogCreate.addTemperament(tempDb);
            return res.send('Dog creado con exito')
        }
        return res.send(`El Dog ${name} ya se encuentra en nuestra BD`)

    }catch(error){
        res.status(400).send(error+' Problemas al ingresar al Dog')
    }
}

module.exports = {getAllDogs, getTemperament, postDogs, getDogsApi, temperamentsToDB, showTemperaments}