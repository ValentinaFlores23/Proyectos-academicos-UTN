/**
 * REPOSITORIO ESPECIALIZADO: EQUIPOS
 * 
 * Responsabilidad: Acceso a datos de equipos
 * 
 * Actualmente es una envoltura simple de BaseRepository
 * pero permite crecer con métodos específicos de equipos
 * 
 * Ejemplo futuro:
 * - findByCategoria()
 * - findAvailableInRange()
 * - aggregateByStatus()
 */

import { BaseRepository } from './baseRepository.js';
import { Equipo } from '../models/index.js';

class EquiposRepository extends BaseRepository {
  constructor() {
    super(Equipo);
  }
}

// Exportar singleton para reutilizar la misma instancia
export const equiposRepository = new EquiposRepository();
