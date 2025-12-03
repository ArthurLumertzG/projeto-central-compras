const mongoose = require("mongoose");

let isConnected = false;

async function connect() {
  if (isConnected) {
    return;
  }

  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/central-compras";

    await mongoose.connect(mongoUri);

    isConnected = true;
    console.log("MongoDB conectado com sucesso");
  } catch (error) {
    console.error("Erro ao conectar no MongoDB:", error);
    throw error;
  }
}

async function disconnect() {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log("MongoDB desconectado");
  } catch (error) {
    console.error("Erro ao desconectar do MongoDB:", error);
    throw error;
  }
}

const database = {
  connect,
  disconnect,
  mongoose,
};

module.exports = database;
