const express = require("express");
const cors = require("cors");
const app = express();
const errorHandler = require("./middlewares/errorHandler.js");
const AppError = require("./errors/AppError.js");
const swaggerUI = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const database = require("../db/database.js");
const convertIdMiddleware = require("./middlewares/convertIdMiddleware.js");

const port = 3000;

const fornecedoresRoutes = require("./routes/fornecedoresRoutes.js");
const produtosRoutes = require("./routes/produtosRoutes.js");
const usuariosRoutes = require("./routes/usuariosRoutes.js");
const enderecosRoutes = require("./routes/enderecosRoutes.js");
const lojasRoutes = require("./routes/lojasRoutes.js");
const campanhaRoutes = require("./routes/campanhaRoutes.js");
const pedidosRoutes = require("./routes/pedidosRoutes.js");
const condicaoComercialRoutes = require("./routes/condicaoComercialRoutes.js");

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

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);
app.use(express.json());
app.use(convertIdMiddleware);

app.get("/", (req, res) => {
  res.send("Projeto Central de Compras!");
});

app.use("/fornecedores", fornecedoresRoutes);
app.use("/produtos", produtosRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/enderecos", enderecosRoutes);
app.use("/lojas", lojasRoutes);
app.use("/campanhas", campanhaRoutes);
app.use("/pedidos", pedidosRoutes);
app.use("/condicoes-comerciais", condicaoComercialRoutes);

app.use((req, res, next) => {
  next(new AppError(`Rota ${req.originalUrl} não encontrada`, 404));
});
app.use(errorHandler);

// Inicializar conexão com MongoDB antes de iniciar o servidor
database
  .connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Projeto Central de Compras está rodando em: http://localhost:${port}`);
      console.log(`Documentação da API disponível em: http://localhost:${port}/docs`);
    });
  })
  .catch((error) => {
    console.error("❌ Erro ao conectar ao MongoDB:", error);
    process.exit(1);
  });

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Encerrando servidor...");
  await database.disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Encerrando servidor...");
  await database.disconnect();
  process.exit(0);
});
