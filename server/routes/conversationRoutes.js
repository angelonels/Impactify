const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversationController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, conversationController.list);
router.get("/:id", authMiddleware, conversationController.get);
router.patch("/:id", authMiddleware, conversationController.rename);
router.delete("/:id", authMiddleware, conversationController.remove);
router.post("/:id/messages/:msgId/execute", authMiddleware, conversationController.executeMessage);

module.exports = router;
