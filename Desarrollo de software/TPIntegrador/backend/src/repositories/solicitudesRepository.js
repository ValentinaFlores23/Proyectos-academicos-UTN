/**
 * REPOSITORIO ESPECIALIZADO: SOLICITUDES
 * 
 * Responsabilidad: Acceso a datos de solicitudes con queries complejas
 * 
 * Métodos personalizados:
 * - findConDetalle: fetch con relaciones (equipo, usuarios)
 * - haySuperposicion: detecta conflictos de fechas
 * 
 * Patrón: Extender BaseRepository con lógica específica de dominio
 */

import { Op } from 'sequelize';
import { BaseRepository } from './baseRepository.js';
import { Solicitud, Equipo, Usuario } from '../models/index.js';

class SolicitudesRepository extends BaseRepository {
  constructor() {
    super(Solicitud);
  }

  // Obtener solicitud con detalles relacionados (JOIN)
  // Trae equipo, solicitante y autorizador en una sola query
  findConDetalle(id) {
    return this.model.findByPk(id, {
      include: [
        { model: Equipo, as: 'equipo' },
        { model: Usuario, as: 'solicitante', attributes: ['nombre', 'email'] },
        { model: Usuario, as: 'autorizador', attributes: ['nombre', 'email'] },
      ],
    });
  }

  // Detectar superposición de fechas
  // Retorna true si hay conflicto, false si está disponible
  // 
  // Lógica: dos rangos se superponen si:
  // rango1.inicio < rango2.fin AND rango1.fin > rango2.inicio
  // 
  // excluirId: ignorar una solicitud (útil al editar la misma)
  // estados: qué estados bloquean (aprobada, pendiente, etc)
  async haySuperposicion(equipoId, fechaRetiro, fechaDevolucion, excluirId = null, estados = ['aprobada']) {
    const where = {
      equipoId,
      estado: { [Op.in]: estados },
      [Op.and]: [
        { fechaRetiro:    { [Op.lt]: fechaDevolucion } },
        { fechaDevolucion: { [Op.gt]: fechaRetiro } },
      ],
    };
    
    if (excluirId) where.id = { [Op.ne]: excluirId };
    return (await this.model.count({ where })) > 0;
  }
}

export const solicitudesRepository = new SolicitudesRepository();
