/**
 * MODELO: HISTORIAL SOLICITUD
 * Auditoría de cambios en solicitudes
 * 
 * Responsabilidad: Registrar QUIÉN hizo QUÉ y CUÁNDO en cada solicitud
 * 
 * Concepto: Patrón de auditoría para compliance y debugging
 * 
 * Campos:
 * - accion: ENUM de operaciones realizadas
 * - valorAnterior, valorNuevo: diff para rastrear cambios
 * - fechaHora: timestamp exacto del cambio
 */

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const HistorialSolicitud = sequelize.define('HistorialSolicitud', {
  id: { type: DataTypes.INTEGER,
     primaryKey: true,
     autoIncrement: true },

  // FK: Solicitud siendo auditada
  solicitudId: { type: DataTypes.INTEGER,
     allowNull: false },

  // FK: Usuario que hizo la acción
  usuarioId: { type: DataTypes.INTEGER,
     allowNull: false },

  // ENUM: acción realizada (creacion, edicion, aprobacion, rechazo, cancelacion, devolucion)
  accion: {
    type: DataTypes.ENUM('creacion', 'edicion', 'aprobacion', 'rechazo', 'cancelacion', 'devolucion'),
    allowNull: false,
  },

  // Timestamp exacto (para auditoría y debugging)
  fechaHora: { type: DataTypes.DATE,
     defaultValue: DataTypes.NOW },

  // JSON stringified del estado anterior (permite ver qué cambió)
  valorAnterior: { type: DataTypes.TEXT,
     allowNull: true },

  // JSON stringified del estado nuevo
  valorNuevo: { type: DataTypes.TEXT,
     allowNull: true },
});

