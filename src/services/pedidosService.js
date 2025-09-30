const fs = require("fs").promises;
const path = require("path");

class PedidosService {
    constructor() {
        this.filePath = path.join(__dirname, "../data/order.json");
    }

    async getAll() {
        const data = await fs.readFile(this.filePath, "utf-8");
        return JSON.parse(data || "[]");
    }

    async getById(id) {
        const pedidos = await this.getAll();
        return pedidos.find((pedido) => pedido.id === id);
    }

    async getByDate(date) {
        const pedidos = await this.getAll();
        return pedidos.filter((pedido) => pedido.date.startsWith(date));
    }

    async create(pedido) {
        const pedidos = await this.getAll();

        const newPedido = {
            id: crypto.randomUUID(),
            ...pedido,
            date: pedido.date || new Date().toISOString(),
        };

        pedidos.push(newPedido);
        await fs.writeFile(this.filePath, JSON.stringify(pedidos, null, 2));
        return newPedido;
    }

    async update(id, updateData) {
        const pedidos = await this.getAll();
        const index = pedidos.findIndex((pedido) => pedido.id === id);

        if (index === -1) return null;

        pedidos[index] = {
            ...pedidos[index],
            ...updateData,
        };

        await fs.writeFile(this.filePath, JSON.stringify(pedidos, null, 2));
        return pedidos[index];
    }

    async delete(id) {
        const pedidos = await this.getAll();
        const index = pedidos.findIndex((pedido) => pedido.id === id);

        if (index === -1) return null;

        const deletedPedido = pedidos.splice(index, 1);
        await fs.writeFile(this.filePath, JSON.stringify(pedidos, null, 2));
        return deletedPedido[0];
    }
}

module.exports = PedidosService;
