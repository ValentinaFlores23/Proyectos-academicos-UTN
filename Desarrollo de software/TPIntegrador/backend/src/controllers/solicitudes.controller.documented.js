/**
 * CONTROLADOR DE SOLICITUDES DE PRÉSTAMO
 * 
 * Responsabilidad: Orquestar flujo HTTP para solicitudes.
 * - Recibir req.params, req.query, req.body
 * - Extraer datos del usuario autenticado (req.usuario)
 * - Delegar lógica al servicio
 * - Responder con estado HTTP apropiado
 * 
 * Patrón: Controlador thin que delega todo al servicio.
 * 
 * Conceptos:
 * - Asincronismo: async/await en todas las funciones
 * - try/catch: manejo de promesas rechazadas
 * - Separación de capas: controlador -> servicio -> repositorio
 */

import * as svc from '../services/solicitudes.service.js';

/**
 * GET /api/solicitudes
 * Listar solicitudes con filtros y paginación
 * 
 * Flujo:
 * 1. req.usuario viene de authMiddleware
 * 2. req.query contiene: page, limit, estado, equipoId, categoria, desde, hasta
 * 3. Pasar rol del usuario para filtrado por permiso
 * 4. Responder 200 OK con { total, pagina, limite, solicitudes }
 */
export const listar = async (req, res, next) => {
  try {
    const result = await svc.listar({
      ...req.query,
      usuarioRol: req.usuario.rol,  // Para que usuarios vean solo sus propias
      usuarioId: req.usuario.id,
    });
    res.json(result);
  } catch (e) { next(e); }
};

/**
 * GET /api/solicitudes/:id
 * Obtener detalles de una solicitud
 * 
 * Flujo:
 * 1. Leer ID de params
 * 2. Buscar solicitud con detalles (equipo, usuarios, historial)
 * 3. Responder 200 OK o 404 Not Found
 */
export const detalle = async (req, res, next) => {
  try { res.json(await svc.obtener(req.params.id)); }
  catch (e) { next(e); }
};

/**
 * GET /api/solicitudes/:id/historial
 * Obtener auditoría de cambios
 * 
 * Flujo:
 * 1. Leer ID de params
 * 2. Retornar lista cronológica de cambios
 */
export const historial = async (req, res, next) => {
  try { res.json(await svc.obtenerHistorial(req.params.id)); }
  catch (e) { next(e); }
};

/**
 * POST /api/solicitudes
 * Crear nueva solicitud de préstamo
 * 
 * Flujo:
 * 1. Validar equipo existe y está disponible
 * 2. Validar fechas (retiro < devolución)
 * 3. Validar que no hay conflicto de fechas
 * 4. Crear solicitud en BD
 * 5. Registrar entrada de historial
 * 6. Responder 201 Created
 */
export const crear = async (req, res, next) => {
  try {
    const sol = await svc.crear(req.body, req.usuario.id);
    res.status(201).json(sol);
  } catch (e) { next(e); }
};

/**
 * PUT /api/solicitudes/:id
 * Editar solicitud pendiente
 * 
 * Flujo:
 * 1. Verificar que solicitud está en estado 'pendiente'
 * 2. Verificar permisos (usuario solo edita las propias)
 * 3. Actualizar fechas y motivo
 * 4. Registrar cambios en historial
 * 5. Responder 200 OK
 */
export const editar = async (req, res, next) => {
  try {
    const sol = await svc.editar(
      req.params.id,
      req.body,
      req.usuario.id,
      req.usuario.rol
    );
    res.json(sol);
  } catch (e) { next(e); }
};

/**
 * PATCH /api/solicitudes/:id/cancelar
 * Cambiar estado a 'cancelada'
 * 
 * Flujo:
 * 1. Verificar que no está ya devuelta o rechazada
 * 2. Verificar permisos
 * 3. Cambiar estado
 * 4. Registrar en historial
 * 5. Responder 200 OK
 */
export const cancelar = async (req, res, next) => {
  try {
    const sol = await svc.cancelar(req.params.id, req.usuario.id, req.usuario.rol);
    res.json(sol);
  } catch (e) { next(e); }
};

/**
 * PATCH /api/solicitudes/:id/aprobar
 * Cambiar 'pendiente' -> 'aprobada' (SOLO admin/encargado)
 * 
 * Flujo:
 * 1. Verificar estado es 'pendiente'
 * 2. Verificar disponibilidad de equipo
 * 3. Verificar sin conflictos de fechas
 * 4. Cambiar estado y registrar autorizador
 * 5. Registrar en historial
 * 6. Responder 200 OK
 */
export const aprobar = async (req, res, next) => {
  try {
    const sol = await svc.aprobar(req.params.id, req.usuario.id, req.usuario.rol);
    res.json(sol);
  } catch (e) { next(e); }
};

/**
 * PATCH /api/solicitudes/:id/rechazar
 * Cambiar 'pendiente' -> 'rechazada' (SOLO admin/encargado)
 * 
 * Flujo:
 * 1. Verificar estado es 'pendiente'
 * 2. Cambiar estado
 * 3. Registrar en historial
 * 4. Responder 200 OK
 */
export const rechazar = async (req, res, next) => {
  try {
    const sol = await svc.rechazar(req.params.id, req.usuario.id);
    res.json(sol);
  } catch (e) { next(e); }
};

/**
 * PATCH /api/solicitudes/:id/devolver
 * Cambiar 'aprobada' -> 'devuelta' (SOLO admin/encargado)
 * 
 * Flujo:
 * 1. Verificar estado es 'aprobada'
 * 2. Cambiar estado a 'devuelta'
 * 3. Cambiar equipo a 'disponible'
 * 4. Registrar en historial
 * 5. Responder 200 OK
 */
export const devolver = async (req, res, next) => {
  try {
    const sol = await svc.devolver(req.params.id, req.usuario.id);
    res.json(sol);
  } catch (e) { next(e); }
};

/**
 * GET /api/solicitudes/resumen (orden importa: antes que /:id)
 * Estadísticas agregadas (SOLO admin/encargado)
 * 
 * Flujo:
 * 1. Contar solicitudes pendientes
 * 2. Contar solicitudes vencidas
 * 3. Contar equipos prestados
 * 4. Agrupar equipos disponibles por categoría
 * 5. Responder 200 OK con objeto de métricas
 */
export const resumen = async (req, res, next) => {
  try { res.json(await svc.resumen()); }
  catch (e) { next(e); }
};
