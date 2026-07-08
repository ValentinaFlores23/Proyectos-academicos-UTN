/**
 * MODELO: EQUIPO
 * Estructura de equipos disponibles para préstamo
 * 
 * Responsabilidad: Representar equipos que pueden ser prestados
 * 
 * Campos críticos:
 * - codigoInventario: ÚNICO, identificador para auditoría
 * - estado: ENUM define ciclo de vida del equipo
 * - requiereAutorizacion: seguridad para equipos valiosos
 */

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Equipo = sequelize.define('Equipo', {
  id: { type: DataTypes.INTEGER,
     primaryKey: true,
     autoIncrement: true },

  // Código de inventario ÚNICO para rastreo físico
  codigoInventario: { type: DataTypes.STRING,
     allowNull: false,
     unique: true },

  nombre: { type: DataTypes.STRING,
     allowNull: false },

  // Categoría: notebook, proyector, cámara, kit de red, tablet
  categoria: { type: DataTypes.STRING,
     allowNull: false },

  // Estado ENUM: disponible|prestado|mantenimiento|baja
  // disponible: listo para prestar
  // prestado: hay usuario usando
  // mantenimiento: fuera de servicio
  // baja: descartado permanentemente
  estado: {
    type: DataTypes.ENUM('disponible', 'prestado', 'mantenimiento', 'baja'),
    defaultValue: 'disponible',

  },
  ubicacion: { type: DataTypes.STRING,
     allowNull: false },

  // Si true: solo admin/encargado pueden aprobar préstamo
  // Si false: usuarios normales pueden pedir
  requiereAutorizacion: { type: DataTypes.BOOLEAN,
     defaultValue: false },
});

