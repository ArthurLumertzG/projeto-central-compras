const fs = require("fs").promises;
const path = require("path");

const dataFile = path.join(__dirname, "../../db/pedidos.json");

class PedidosModel {
    constructor() {
        this.file = dataFile;
    }

    // Seleciona todos os pedidos
    async select() {
        let fileContent;
        try {
            fileContent = await fs.readFile(this.file, "utf8");
        } catch (err) {
            if (err.code === "ENOENT") {
                await fs.writeFile(this.file, "[]", "utf8");
                return [];
            }
            throw err;
        }

        if (!fileContent.trim()) {
            return [];
        }

        try {
            return JSON.parse(fileContent);
        } catch (err) {
            console.warn("Arquivo JSON inválido. Resetando para [].");
            await fs.writeFile(this.file, "[]", "utf8");
            return [];
        }
    }

    // Busca por ID
    async selectById(id) {
        const pedidos = await this.select();
        return pedidos.find((pedido) => pedido.id === id);
    }

    // Busca por data (YYYY-MM-DD)
    async selectByDate(date) {
        const pedidos = await this.select();
        return pedidos.filter((pedido) => pedido.date.startsWith(date));
    }

    // Criação de pedido
    async create(pedido) {
        const pedidos = await this.select();
        pedidos.push(pedido);
        const json = JSON.stringify(pedidos, null, 2);
        await fs.writeFile(this.file, json, "utf8");
        return pedido;
    }

    // Atualização de pedido
    async update(id, pedido) {
        const pedidos = await this.select();
        const updatedPedidoIndex = pedidos.findIndex((pedido) => pedido.id === id);

        if (updatedPedidoIndex === -1) return null;

        pedidos[updatedPedidoIndex] = { ...pedidos[updatedPedidoIndex], ...pedido };

        await fs.writeFile(this.file, JSON.stringify(pedidos, null, 2), "utf8");
        return pedidos[updatedPedidoIndex];
    }

    // Exclusão de pedido
    async delete(id) {
        const pedidos = await this.select();
        const deletedPedidoIndex = pedidos.findIndex((pedido) => pedido.id === id);

        if (deletedPedidoIndex === -1) return null;

        pedidos.splice(deletedPedidoIndex, 1);
        await fs.writeFile(this.file, JSON.stringify(pedidos, null, 2), "utf8");
        return true;
    }
}

module.exports = PedidosModel;
