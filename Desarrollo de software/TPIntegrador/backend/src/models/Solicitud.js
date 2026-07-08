/**
 * MODELO: SOLICITUD
 * Estructura de solicitudes de préstamo de equipos
 * 
 * Responsabilidad: Registrar ciclo de vida de un préstamo
 * 
 * Ciclo de estados:
 * pendiente -> (aprobada o rechazada)
 *   si aprobada -> devuelta
 *   si rechazada -> fin
 * En cualquier momento -> cancelada
 * 
 * Campos críticos:
 * - equipoId, usuarioId: llaves foráneas
 * - fechaRetiro, fechaDevolucion: definen disponibilidad
 * - autorizadoPor: rastrea quién aprobó
 */

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Solicitud = sequelize.define('Solicitud', {
  id: { type: DataTypes.INTEGER,
     primaryKey: true,
     autoIncrement: true },

  // FK: Referencia al equipo siendo solicitado
  equipoId: { type: DataTypes.INTEGER,
     allowNull: false },

  // FK: Usuario que hace la solicitud
  usuarioId: { type: DataTypes.INTEGER,
     allowNull: false },

  // Fecha inicio del préstamo (YYYY-MM-DD)
  fechaRetiro: { type: DataTypes.DATEONLY,
     allowNull: false },

  // Fecha fin del préstamo (YYYY-MM-DD)
  fechaDevolucion: { type: DataTypes.DATEONLY,
     allowNull: false },

  // Razón del préstamo (ej: "Proyecto final", "Práctica de lab")
  motivo: { type: DataTypes.STRING,
     allowNull: false },

  // ENUM: ciclo de vida de la solicitud
  // pendiente: aguardando revisión
  // aprobada: autorizado, usuario puede retirar
  // rechazada: denegado
  // cancelada: cancelado por usuario o admin
  // devuelta: préstamo completado
  estado: {
    type: DataTypes.ENUM('pendiente', 'aprobada', 'rechazada', 'cancelada', 'devuelta'),
    defaultValue: 'pendiente',
  },

  // FK: Usuario admin/encargado que aprobó (null si no aprobada aún)
  autorizadoPor: { type: DataTypes.INTEGER, allowNull: true },
});

