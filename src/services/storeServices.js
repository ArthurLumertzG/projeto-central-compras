const StoresModel = require("../models/storesModel");
const DefaultResponseDto = require("../dtos/defaultResponse.dto");
const AppError = require("../errors/AppError");
const { validateStore } = require("../utils/validator");

const { v4: uuidv4 } = require("uuid");

class StoresService {
  constructor() {
    this.storesModel = new StoresModel();
  }

  async getAll() {
    const stores = await this.storesModel.select();
    if (!stores || stores.length === 0) {
      return new DefaultResponseDto(true, "Nenhuma loja encontrada", []);
    }

    return new DefaultResponseDto(true, "Lojas encontradas com sucesso", stores);
  }

  async getById(id) {
    const store = await this.storesModel.selectById(id);
    if (!store) {
      throw new AppError("Loja não encontrada", 404);
    }
    return new DefaultResponseDto(true, "Loja encontrada com sucesso", store);
  }

  async create(store) {
    const storeError = validateStore(store);
    if (storeError) throw new AppError(storeError, 400);

    store.email = store.email.toLowerCase();
    const { email } = store;
    const existingStore = await this.storesModel.selectByEmail(email);

    if (existingStore) {
      throw new AppError("Já existe uma loja com este email", 409);
    }

    const newId = uuidv4();
    const newStore = {
      id: newId,
      ...store,
    };

    const createdStore = await this.storesModel.create(newStore);

    return new DefaultResponseDto(true, "Loja criada com sucesso", createdStore);
  }

  async update(id, store) {
    const updatedStore = await this.storesModel.update(id, store);
    if (!updatedStore) {
      throw new AppError(`Loja não encontrada`, 404);
    }

    return new DefaultResponseDto(true, "Loja atualizada com sucesso", updatedStore);
  }

  async delete(id) {
    const storeIsDeleted = await this.storesModel.delete(id);
    if (!storeIsDeleted) {
      throw new AppError(`Loja não encontrada`, 404);
    }

    return new DefaultResponseDto(true, "Loja deletada com sucesso", null);
  }
}

module.exports = StoresService;
