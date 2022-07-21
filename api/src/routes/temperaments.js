const { Router } = require("express");
const { showTemperaments } = require("./controllers");
const router = Router();

router.get("/", showTemperaments);

module.exports = router;