const express = require("express");

const tagController = require("./tag.controller");
const authMiddleware = require("./auth.middleware");
const { tagPayloadValidation } = require("./tag.middlewaree");

const router = express.Router();

router.get("/all", authMiddleware, tagController.retrieveAll);
router.post("/", authMiddleware, tagPayloadValidation, tagController.create);
router.patch("/", tagPayloadValidation, authMiddleware, tagController.update);
router.delete("/", authMiddleware, tagController.remove);

module.exports = router;
