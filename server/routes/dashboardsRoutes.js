const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/dashboardsController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, ctrl.list);
router.post("/", authMiddleware, ctrl.create);
router.get("/:id", authMiddleware, ctrl.get);
router.patch("/:id", authMiddleware, ctrl.rename);
router.delete("/:id", authMiddleware, ctrl.remove);
router.post("/:id/items", authMiddleware, ctrl.addItem);
router.delete("/:id/items/:itemId", authMiddleware, ctrl.removeItem);
router.patch("/:id/layout", authMiddleware, ctrl.updateLayout);

module.exports = router;
