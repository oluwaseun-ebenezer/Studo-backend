const express = require("express");

const tagController = require("../controllers/tag");
const authMiddleware = require("../middlewares/auth");
const { tagPayloadValidation } = require("../middlewares/tag");

const router = express.Router();

router.get("/all", authMiddleware, tagController.retrieveAll);
router.post("/", authMiddleware, tagPayloadValidation, tagController.create);
router.patch("/", tagPayloadValidation, authMiddleware, tagController.update);
router.delete("/", authMiddleware, tagController.remove);

module.exports = router;
