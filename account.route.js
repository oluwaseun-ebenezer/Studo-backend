const express = require("express");

const accountController = require("./account.controller");

const router = express.Router();

router.post("/fetch", accountController.retrieve);
router.post("/", accountController.create);
router.put("/", accountController.update);
// router.post("/login", accountController.createUser);

module.exports = router;
