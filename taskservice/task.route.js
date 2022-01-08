const express = require("express");

const tasktController = require("./task.controller");
const authMiddleware = require("./auth.middleware");
const { taskPayloadValidation } = require("./task.middleware");

const router = express.Router();

router.get("/:account_id/all", authMiddleware, tasktController.retrieveAll);
router.get("/:id", authMiddleware, tasktController.retrieve);
router.post("/", authMiddleware, taskPayloadValidation, tasktController.create);
router.patch(
  "/",
  taskPayloadValidation,
  authMiddleware,
  tasktController.update
);
router.delete("/", authMiddleware, tasktController.remove);

module.exports = router;
