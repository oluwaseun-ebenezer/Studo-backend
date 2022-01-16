const express = require("express");

const accountController = require("../controllers/account");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.get("/fetch/:id", authMiddleware, accountController.retrieve);
router.post("/", accountController.create);
router.post("/login", accountController.login);
router.patch("/", accountController.update);
router.patch("/password", authMiddleware, accountController.updatePassword);

module.exports = router;
