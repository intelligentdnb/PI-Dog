const axios = require('axios');
const {Dog, Temperament, dog_temperament} = require('../db');
require('dotenv').config();
const {API, API_KEY} = process.env;

//Esta funcion llevo a todos los temperamentos de la API a mi base de datos.
const temperamentsToDB = async () => {
    var { data } = await axios.get(`${API}${API_KEY}`);
    var temperaments = [];
    data.forEach(e => {
        if(typeof(e.temperament) === "string"){
            let res = e.temperament.split(",")
            res = res.map(e => e.trim())
            temperaments = temperaments.concat(res)
        }
    });
    temperaments = Array.from(new Set(temperaments)).sort(); //esto me los trae ordenados
   // Con set puedo almacenar valores unicos
   // Array.from crea una nueva instancia de Array a partir de un objeto iterable
    for await (var temp of temperaments) {
        Temperament.create({name: temp})
    };
    return;
};

//funcion para mostrar los temperamentos desde mi base de datos
const showTemperaments = async (req, res) => {
    try {
        const temperament = await Temperament.findAll({
            attributes:['id', 'name']
        });
        res.json(temperament);
} catch (error) {
    throw new Error(error + 'Error in extracting temperaments from the database');
};
};


//Funcion que me trae toda la info desde la api de dogs, se mapea y se retorna
const getApiDogs = async() => {
    try {
        let dogs = await axios.get(API+API_KEY);
        let dog = dogs.data.map(e => {  //PARA QUE CADA DOG SE CREE COMO UN OBJETO
            return{
                id: e.id,
                name: e.name,
                image: e.image.url,
                temperaments: e.temperament ? e.temperament : "This breed does not have defined temperaments.",
                life_span_min: e.life_span.split(" - ").shift(),  
                life_span_max: e.life_span.split(" - ").pop().split(" ").shift(),  
                height_min: e.height.metric.split(" - ").shift(), 
                height_max: e.height.metric.split(" - ").pop(),
                weight_min: e.weight.metric.split(" - ").shift(),
                weight_max: e.weight.metric.split(" - ").pop(),
            };
        });

        return dog;

    } catch (error) {
        throw new Error(error+' Failed to get the breeds from the API');
    };
};

//Funcion que me trae toda la info desde mi BD dogs, 
//relacionamos la info temperaments con lo que tenemos en la BD de temperaments
//creada por nosotros, se termina retornado la respuesta 
const getDbDogs = async() => {
    try {
        const db = await Dog.findAll({
            include:{
                model: Temperament,
                attributes: ['name'],
                through:{
                    attributes:[]
                }
            }
        });

        return db;

    } catch (error) {
        throw new Error(error +' Failed to get the breeds from the database');
    };
};

//Funcion que concatena la llamada de la API junto con la llamada a la BD
const getAllDogs = async(req, res) => {
    try {
        const dogApi = await getApiDogs();
        const preDogsDb = await getDbDogs();

        const dogsDb = preDogsDb.map(e => e && {
            id: e.id,
            name: e.name,
            image: e.image,
            life_span_max: e.life_span_max,
            life_span_min: e.life_span_min,
            height_max: e.height_max,
            height_min: e.height_min,
            weight_min: e.weight_min,
            weight_max: e.weight_max,
            //acá es donde mapeo para que me devuelva un array con solo lo que hay en la propiedad nombre
            temperaments: e.temperaments.map(e => e.name).join(", ")
        });
    
        const allDogs = dogApi.concat(dogsDb);

        return allDogs;

    } catch (error) {
        throw new Error(error+' Failed concatenating database with API');
    };
};

/////

//Funcion que me mapea todos los perros tanto de la API como de la BD
//pasamos name por query,condicionamos name,buscamos y mostramos por este. 
//pasamos id por params, condicionamos id, buscamos y mostramos por este.
const showDogs = async(req, res) => {
    try {
        const { name } = req.query;
        const { id } = req.params;
        const dogsAll = await getAllDogs();
        
        if(name) {
            let dogName = dogsAll.filter(el=>el.name.toLowerCase().includes(name.toString().toLowerCase()));

            dogName.length
                ? res.status(200).send(dogName)
                : res.status(404).send('No breed found for that name');
        } else if(id) {
            let dogId = dogsAll.filter(el => el.id == id);

            dogId.length
                ? res.status(200).send(dogId)
                : res.status(400).send('No breed found with the ID = '+ id);

        } else return res.status(200).send(dogsAll);
        
    } catch (error) {
        throw new Error(error+' Failed to show breeds');
    };
};

//Funcion para crear un DOG
const postDogs = async(req, res) => {
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
            });

            let tempDb = await Temperament.findAll({where:{name:temperament}});

            dogCreate.addTemperament(tempDb);

            return res.send('Breed created successfully');
        };

        return res.send(`The breed ${name} is already in our database`);

    }catch(error){
        res.status(400).send(error+' Failed when wanting to enter a new breed');
    };
};

module.exports = {postDogs, showDogs, temperamentsToDB, showTemperaments}