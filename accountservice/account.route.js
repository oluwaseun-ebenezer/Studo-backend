const express = require("express");

const accountController = require("./account.controller");

const router = express.Router();

router.post("/fetch", accountController.retrieve);
router.post("/", accountController.create);
router.post("/login", accountController.login);
router.patch("/", accountController.update);
router.patch("/password", accountController.updatePassword);

module.exports = router;
