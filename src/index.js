const express = require("express");
const app = express();
const port = 3000;
const errorHandler = require("./middlewares/errorHandler.js");
const AppError = require("./errors/AppError.js");

const fornecedoresRoutes = require("./routes/fornecedoresRoutes.js");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Projeto Central de Compras!");
});

app.use("/fornecedores", fornecedoresRoutes);

app.use((req, res, next) => {
  next(new AppError(`Rota ${req.originalUrl} não encontrada`, 404));
});
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Projeto Central de Compras está rodando em: http://localhost:${port}`);
});
