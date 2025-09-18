const express = require("express");
const router = express.Router();

const FornecedoresService = require("../services/fornecedoresService");
const fornecedoresService = new FornecedoresService();

router.get("/", (req, res) => {
  res.send(fornecedoresService.getAll());
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.send("Mostrar funcionário com id: " + id);
});

router.post("/", async (req, res) => {
  try {
    const fornecedor = req.body;
    const result = await fornecedoresService.createFornecedor(fornecedor);
    return res.status(201).json({ data: result });
  } catch (err) {
    console.error("Erro: ", err);
    return res.status(500).json({ error: "Erro interno do servidor " + err });
  }
});

module.exports = router;
