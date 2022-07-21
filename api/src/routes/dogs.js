const { Router } = require("express");
const { showDogs, postDogs } = require("./controllers");
const router = Router();

router.get("/", showDogs); 
router.get("/:id", showDogs);
router.post("/", postDogs);

module.exports = router;



