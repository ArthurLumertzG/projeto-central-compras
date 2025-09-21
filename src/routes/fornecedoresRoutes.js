const express = require("express");
const router = express.Router();
const fornecedoresController = require("../controllers/fornecedoresController");
const asyncHandler = require("../middlewares/asyncHandler");

router.get("/", asyncHandler(fornecedoresController.getAll));
router.get("/:id", asyncHandler(fornecedoresController.getById));
router.post("/", asyncHandler(fornecedoresController.create));
router.patch("/:id", asyncHandler(fornecedoresController.update));
router.delete("/:id", asyncHandler(fornecedoresController.delete));

module.exports = router;
