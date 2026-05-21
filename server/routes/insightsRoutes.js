const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/insightsController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, ctrl.list);
router.post("/", authMiddleware, ctrl.create);
router.delete("/:id", authMiddleware, ctrl.remove);
router.post("/:id/execute", authMiddleware, ctrl.execute);

module.exports = router;
