const express = require("express");
const app = express();
const port = 3000;

const fornecedoresRoutes = require("./routes/fornecedoresRoutes.js");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Aqui!");
});

app.use("/fornecedores", fornecedoresRoutes);

app.listen(port, () => {
  console.log(`Exemplo está funcionando na porta: ${port}`);
});
