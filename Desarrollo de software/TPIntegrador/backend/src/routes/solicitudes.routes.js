/**
 * RUTAS DE SOLICITUDES DE PRÉSTAMO
 * 
 * Responsabilidad: Mapear endpoints HTTP para solicitudes de equipos.
 * 
 * PatrÓn: Router con middlewares de autenticación y autorización por rol.
 * 
 * FLUJO DE CICLO DE VIDA:
 * usuario crea solicitud (pendiente)
 *   → admin/encargado revisa
 *   → puede aprobar (aprobada) o rechazar (rechazada)
 *   → si aprobada: usuario puede devolver (devuelta)
 *   → usuario o admin pueden cancelar (cancelada) en cualquier momento
 * 
 * Endpoints organizados por responsabilidad:
 * - Consulta: listar, detalle, historial, resumen
 * - Creación: crear
 * - Edición: editar
 * - Transiciones de estado: cancelar, aprobar, rechazar, devolver
 */

import { Router } from 'express';
import * as ctrl from '../controllers/solicitudes.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { soloAdmin } from '../middlewares/roles.middleware.js';

const router = Router();

// CONSULTA: Listado de solicitudes
// Filtrado por rol del usuario (usuarios verán solo las propias)
// Soporta paginación, filtros de estado, equipo, categoría
router.get('/', authMiddleware, ctrl.listar);

// CONSULTA: Resumen estadístico (SOLO admin/encargado)
// Totales: pendientes, vencidas, equipos por categoría, etc.
router.get('/resumen', authMiddleware, soloAdmin, ctrl.resumen);

// CONSULTA: Detalle de una solicitud
router.get('/:id', authMiddleware, ctrl.detalle);

// CONSULTA: Historial (auditoría) de cambios en una solicitud
router.get('/:id/historial', authMiddleware, ctrl.historial);

// CREACIÓN: Nueva solicitud (usuario autenticado)
// Petición: { equipoId, fechaRetiro, fechaDevolucion, motivo }
// Respuesta: 201 con solicitud creada
router.post('/', authMiddleware, ctrl.crear);

// EDICIÓN: Modificar solicitud pendiente
// Solo el solicitante o admin pueden editar
router.put('/:id', authMiddleware, ctrl.editar);

// CANCELACIÓN: Cambiar estado a 'cancelada'
// Usuario puede cancelar sus propias solicitudes
router.patch('/:id/cancelar', authMiddleware, ctrl.cancelar);

// APROBACIÓN: Cambiar 'pendiente' -> 'aprobada' (SOLO admin/encargado)
router.patch('/:id/aprobar', authMiddleware, soloAdmin, ctrl.aprobar);

// RECHAZO: Cambiar 'pendiente' -> 'rechazada' (SOLO admin/encargado)
router.patch('/:id/rechazar', authMiddleware, soloAdmin, ctrl.rechazar);

// DEVOLUCIÓN: Cambiar 'aprobada' -> 'devuelta' (SOLO admin/encargado)
router.patch('/:id/devolver', authMiddleware, soloAdmin, ctrl.devolver);

export default router;