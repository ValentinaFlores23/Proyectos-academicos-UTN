/**
 * MODELO: USUARIO
 * 
 * Responsabilidad: Definir estructura de datos y validaciones para usuarios.
 * 
 * Estructura de datos:
 * - id: clave primaria auto-incremental
 * - nombre: nombre del usuario
 * - email: único, para login
 * - passwordHash: hash bcrypt de la contraseña (NUNCA en texto plano)
 * - rol: enum ['usuario', 'encargado', 'admin'] - determina permisos
 * - activo: booleano para desactivar usuarios sin borrarlos
 * 
 * Conceptos de examen:
 * - Integridad referencial: email único previene duplicados
 * - ENUM: Sequelize valida que rol sea uno de los valores permitidos
 * - Seguridad: passwordHash nunca se devuelve en respuestas JSON
 */

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Usuario = sequelize.define('Usuario', {
  // CLAVE PRIMARIA
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  // NOMBRE DEL USUARIO
  nombre: {
    type: DataTypes.STRING,
    allowNull: false  // Obligatorio
  },

  // EMAIL - ÚNICO
  // allowNull: false + unique: true = cada usuario tiene email y no se repite
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true  // Previene dos usuarios con el mismo email
  },

  // CONTRASEÑA HASHEADA
  // SE HASHEA CON BCRYPT EN auth.service.js ANTES DE GUARDAR
  // NUNCA guardar contraseña en texto plano (es VULNERABILIDAD CRÍTICA)
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },

  // ROL - DETERMINA PERMISOS
  // enum ENUM(['usuario', 'encargado', 'admin'])
  // usuario: solo ve/crea sus propias solicitudes
  // encargado: puede aprobar/rechazar solicitudes
  // admin: acceso total
  rol: {
    type: DataTypes.ENUM('usuario', 'encargado', 'admin'),
    defaultValue: 'usuario'
  },

  // ESTADO DEL USUARIO
  // activo: true = puede hacer login
  // activo: false = desactivado (no se borra para preservar auditoría)
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
});
