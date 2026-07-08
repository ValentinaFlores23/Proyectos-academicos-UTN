/**
 * RUTAS DE EQUIPOS
 * 
 * Responsabilidad: Listar equipos con filtros y validar disponibilidad en rango de fechas.
 * 
 * NOTA: Esta ruta contiene lógica de negocio (filtros de disponibilidad).
 * Idealmente, esta lógica debería estar en un servicio o repositorio,
 * pero se mantiene aquí para no romper la estructura actual.
 * 
 * Flujo:
 * 1. Usuario autenticado solicita GET /api/equipos?filtros
 * 2. Se aplican filtros básicos: categoría, estado
 * 3. Si proporciona rango de fechas, se valida disponibilidad
 * 4. Se excluyen equipos con préstamos aprobados/pendientes superpuestos
 * 5. Retorna lista filtrada
 */

import { Router } from 'express';
import { Op } from 'sequelize';
import { equiposRepository } from '../repositories/equiposRepository.js';
import { Solicitud } from '../models/index.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

// GET /api/equipos?categoria=notebook&estado=disponible&fechaRetiro=2026-07-01&fechaDevolucion=2026-07-05
router.get('/', authMiddleware, async (req, res, next) => {

  try {
    const { categoria, estado, fechaRetiro, fechaDevolucion } = req.query;
    
    // PASO 1: Construir filtros básicos
    const where = {};
    if (categoria) where.categoria = categoria;
    if (estado && !fechaRetiro && !fechaDevolucion) where.estado = estado;
    
    // PASO 2: Consultar equipos base
    let equipos = await equiposRepository.findAll({ where });
    
    // PASO 3: Si se proporciona rango de fechas, validar disponibilidad
    if (fechaRetiro && fechaDevolucion) {
      // Buscar TODAS las solicitudes con estados 'pendiente' o 'aprobada'
      // que superponen el rango de fechas solicitado
      const solicitudesConflicto = await Solicitud.findAll({
        where: {
          estado: { [Op.in]: ['pendiente', 'aprobada'] },
          // Operador AND: si (retiro_anterior < fecha_dev) Y (dev_anterior > fecha_ret)
          // entonces hay superposición
          [Op.and]: [
            { fechaRetiro: { [Op.lt]: fechaDevolucion } },
            { fechaDevolucion: { [Op.gt]: fechaRetiro } },
          ]
        },
        attributes: ['equipoId']  // Solo necesitamos los IDs
      });
      
      // Paso 4: Crear Set con IDs de equipos en conflicto
      const equiposEnConflicto = new Set(solicitudesConflicto.map(s => s.equipoId));
      
      // Paso 5: Filtrar equipos disponibles
      equipos = equipos.filter(eq => !equiposEnConflicto.has(eq.id));
    }
    
    res.json(equipos);
  } catch (e) { next(e); }
});

export default router;
