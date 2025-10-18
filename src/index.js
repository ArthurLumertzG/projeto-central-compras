const express = require("express");
const app = express();
const errorHandler = require("./middlewares/errorHandler.js");
const AppError = require("./errors/AppError.js");
const swaggerUI = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const port = 3000;

const fornecedoresRoutes = require("./routes/fornecedoresRoutes.js");
const produtosRoutes = require("./routes/produtosRoutes.js");
const usuariosRoutes = require("./routes/usuariosRoutes.js");
const enderecosRoutes = require("./routes/enderecosRoutes.js");
const lojasRoutes = require("./routes/lojasRoutes.js");
const campanhaRoutes = require("./routes/campanhaRoutes.js");
const pedidosRoutes = require("./routes/pedidosRoutes.js");
const lojasFornecedorRoutes = require("./routes/lojaFornecedorRoutes.js");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API - Central de Compras",
      version: "1.0.0",
      description: "API para gerenciar fornecedores, produtos e compras. Desenvolvido por GurizesTech (Arthur Lumertz, Carlos Miguel Webber, Davi Valvassori, Gabriel Pereira, Kevin Demétrio)",
      license: {
        name: "GurizesTech License",
      },
      contact: {
        name: "GurizesTech",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor Local",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};
const swaggerSpecs = swaggerJSDoc(swaggerOptions);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Projeto Central de Compras!");
});

app.use("/fornecedores", fornecedoresRoutes);
app.use("/produtos", produtosRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/enderecos", enderecosRoutes);
app.use("/lojas", lojasRoutes);
app.use("/loja-fornecedor", lojasFornecedorRoutes);
app.use("/campanhas", campanhaRoutes);
app.use("/pedidos", pedidosRoutes);

app.use((req, res, next) => {
  next(new AppError(`Rota ${req.originalUrl} não encontrada`, 404));
});
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Projeto Central de Compras está rodando em: http://localhost:${port}`);
  console.log(`Documentação da API disponível em: http://localhost:${port}/docs`);
});
