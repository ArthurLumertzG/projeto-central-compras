const CampanhasModel = require("../models/campanhaModel");
const DefaultResponseDto = require("../dtos/defaultResponse.dto");
const AppError = require("../errors/AppError");
const { v4: uuidv4 } = require("uuid");

class CampanhasService {
  constructor() {
    this.campanhasModel = new CampanhasModel();
  }

  async getAll() {
    const campanhas = await this.campanhasModel.select();
    if (!campanhas || campanhas.length === 0) {
      return new DefaultResponseDto(true, "Nenhuma campanha encontrada", []);
    }

    return new DefaultResponseDto(true, "Campanhas encontradas com sucesso", campanhas);
  }

  async getById(id) {
    const campanha = await this.campanhasModel.selectById(id);
    if (!campanha) {
      throw new AppError("Campanha não encontrada", 404);
    }
    return new DefaultResponseDto(true, "Campanha encontrada com sucesso", campanha);
  }

  async create(campanha) {
    const newId = uuidv4();
    const newCampanha = {
      id: newId,
      ...campanha,
    };

    const createdCampanha = await this.campanhasModel.create(newCampanha);

    return new DefaultResponseDto(true, "Campanha criada com sucesso", createdCampanha);
  }

  async update(id, campanha) {
    const updatedCampanha = await this.campanhasModel.update(id, campanha);
    if (!updatedCampanha) {
      throw new AppError(`Campanha não encontrada`, 404);
    }

    return new DefaultResponseDto(true, "Campanha atualizada com sucesso", updatedCampanha);
  }

  async delete(id) {
    const campanhaIsDeleted = await this.campanhasModel.delete(id);
    if (!campanhaIsDeleted) {
      throw new AppError(`Campanha não encontrada`, 404);
    }

    return new DefaultResponseDto(true, "Campanha deletada com sucesso", null);
  }
}

module.exports = CampanhasService;
