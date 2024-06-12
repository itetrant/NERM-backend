const express = require("express");
const {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiry,
  getallEnquiry,
} = require("../controller/enqCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", createEnquiry);
router.put("/:id", authMiddleware, updateEnquiry);
router.delete("/:id", authMiddleware, deleteEnquiry);
router.get("/:id", getEnquiry);
router.get("/", getallEnquiry);

module.exports = router;
