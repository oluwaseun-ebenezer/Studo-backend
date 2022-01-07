const express = require("express");

const accountController = require("./account.controller");

const router = express.Router();

// router.get("/:id", accountController.fetchAllUser);
router.post("/", accountController.create);
router.put("/", accountController.update);
// router.post("/login", accountController.createUser);

module.exports = router;
