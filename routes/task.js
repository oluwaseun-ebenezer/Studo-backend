const express = require("express");

const taskController = require("../controllers/task");
const authMiddleware = require("../middlewares/auth");
const { taskPayloadValidation } = require("../middlewares/task");

const router = express.Router();

router.get("/all", authMiddleware, taskController.retrieveAll);
router.get("/:id", authMiddleware, taskController.retrieve);
router.post("/", authMiddleware, taskPayloadValidation, taskController.create);
router.patch("/", taskPayloadValidation, authMiddleware, taskController.update);
router.delete("/", authMiddleware, taskController.remove);

module.exports = router;
