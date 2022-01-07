const express = require("express");

const accountController = require("./account.controller");
const authMiddleware = require("./auth.middleware");

const router = express.Router();

router.get("/fetch/:id", authMiddleware, accountController.retrieve);
router.post("/", accountController.create);
router.post("/login", accountController.login);
router.patch("/", accountController.update);
router.patch("/password", authMiddleware, accountController.updatePassword);

module.exports = router;
