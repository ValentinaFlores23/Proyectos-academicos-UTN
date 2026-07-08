/**
 * REPOSITORIO BASE - TEMPLATE GENÉRICO CRUD
 * 
 * Responsabilidad: Proveer métodos comunes para acceso a BD
 * 
 * Patrón: Repository + Template Method
 * Ventajas:
 * - Evita repetir queries en servicios
 * - Centraliza lógica de acceso a ORM
 * - Fácil de testear al aislar BD
 * 
 * Método de operación:
 * 1. Recibe modelo Sequelize en constructor
 * 2. Wrappea métodos Sequelize comunes
 * 3. Repositorios especializados extienden esta clase
 * 
 * CRUD: Create, Read, Update, Delete
 */

export class BaseRepository {
  constructor(model) {
    // Guarda referencia al modelo Sequelize
    this.model = model;
  }

  // READ: Obtener registro por ID
  findById(id, options = {}) {
    return this.model.findByPk(id, options);
  }

  // READ: Obtener todos (con where/limit/offset opcionales)
  findAll(options = {}) {
    return this.model.findAll(options);
  }

  // READ: Obtener primer resultado que coincida con filtro
  findOne(options = {}) {
    return this.model.findOne(options);
  }

  // CREATE: Insertar nuevo registro
  create(data) {
    return this.model.create(data);
  }

  // READ: Contar registros que coincidan con filtro
  count(options = {}) {
    return this.model.count(options);
  }

  // READ + COUNT: Obtener registros y contar total (útil para paginación)
  findAndCountAll(options = {}) {
    return this.model.findAndCountAll(options);
  }
}

