/**
 * PUNTO CENTRAL DE MODELOS Y ASOCIACIONES
 * 
 * Responsabilidad: Exportar todos los modelos y definir relaciones entre ellos
 * 
 * Concepto: Factory pattern para ORM - centraliza asociaciones
 * Ventajas:
 * - Un solo lugar donde ver relaciones
 * - Evita imports cíclicos
 * - Fácil de entender la estructura de la BD
 * 
 * Relaciones:
 * 1. Solicitud -> Equipo (belongsTo) - cada solicitud pide UN equipo
 * 2. Solicitud -> Usuario (belongsTo 2x) - solicitante Y autorizador
 * 3. Historial -> Solicitud (belongsTo) - auditoría de cada solicitud
 * 4. Historial -> Usuario (belongsTo) - quién hizo la acción
 */

import { sequelize } from '../config/database.js';
import { Usuario } from './Usuario.js';
import { Equipo } from './Equipo.js';
import { Solicitud } from './Solicitud.js';
import { HistorialSolicitud } from './HistorialSolicitud.js';

// ASOCIACIÓN 1: Solicitud belongsTo Equipo
// Una solicitud requiere un equipo (many-to-one)
// Alias 'equipo' para acceder: solicitud.equipo
Solicitud.belongsTo(Equipo,   { foreignKey: 'equipoId',    as: 'equipo' });

// ASOCIACIÓN 2: Solicitud belongsTo Usuario (solicitante)
// Quién pidió el préstamo
Solicitud.belongsTo(Usuario,  { foreignKey: 'usuarioId',   as: 'solicitante' });

// ASOCIACIÓN 3: Solicitud belongsTo Usuario (autorizador)
// Quién aprobó (null si aún está pendiente)
Solicitud.belongsTo(Usuario,  { foreignKey: 'autorizadoPor', as: 'autorizador' });

// ASOCIACIÓN 4: HistorialSolicitud belongsTo Solicitud
// Auditoría pertenece a una solicitud
HistorialSolicitud.belongsTo(Solicitud, { foreignKey: 'solicitudId' });

// ASOCIACIÓN 5: HistorialSolicitud belongsTo Usuario
// Quién registró el cambio (actor)
HistorialSolicitud.belongsTo(Usuario,   { foreignKey: 'usuarioId', as: 'actor' });

// Exportar sequelize y todos los modelos para uso en servicios/rutas
export { sequelize, Usuario, Equipo, Solicitud, HistorialSolicitud };
