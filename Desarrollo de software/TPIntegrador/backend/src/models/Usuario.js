/**
 * MODELO: USUARIO
 * Estructura y validaciones de usuarios en la BD
 * 
 * Responsabilidad: Definir datos y reglas de integridad
 * 
 * Campos críticos:
 * - email: ÚNICO, para login
 * - passwordHash: NUNCA en texto plano. Se hashea con bcrypt antes de guardar
 * - rol: ENUM ['usuario', 'encargado', 'admin'] - determina permisos
 * - activo: permite desactivar sin borrar (preserva auditoría)
 */

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Usuario = sequelize.define('Usuario', {
  id: { type: DataTypes.INTEGER,
     primaryKey: true,
     autoIncrement: true },

  nombre: { type: DataTypes.STRING,
      allowNull: false },

  // Email ÚNICO: previene dos usuarios con el mismo correo
  email: { type: DataTypes.STRING,
      allowNull: false,
      unique: true },

  // Hash de contraseña (NUNCA en texto). Se crea con bcrypt.hash()
  passwordHash: { type: DataTypes.STRING,
      allowNull: false },

  // Rol ENUM: usuario|encargado|admin
  // usuario: ve/crea solo sus solicitudes
  // encargado/admin: pueden aprobar y ver todas
  rol: { type: DataTypes.ENUM('usuario', 'encargado', 'admin'),
     defaultValue: 'usuario' },

  // activo: true = puede hacer login; false = desactivado pero no borrado
  activo: { type: DataTypes.BOOLEAN,
     defaultValue: true },
});

