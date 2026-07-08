import { Sequelize } from 'sequelize';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { DB_STORAGE, NODE_ENV } from './env.js';

/**
 * CONFIGURACIÓN DE BASE DE DATOS (ORM Sequelize + SQLite)
 * 
 * Responsabilidad: Crear y exportar la instancia de Sequelize para toda la aplicación.
 * Patrón: Singleton — una única conexión compartida.
 * 
 * Flujo:
 * 1. Lee NODE_ENV para decidir dónde guardar la DB
 * 2. Si es test: usa memoria (:memory:) para aislamiento
 * 3. Si es dev/prod: usa archivo db.sqlite
 * 4. Crea instancia Sequelize con SQLite
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ESTRATEGIA DE TESTING: DB en memoria
// En tests usamos ':memory:' para que cada corrida sea independiente
// No contamina la DB de desarrollo y cada test comienza con tabla limpia
const storage = NODE_ENV === 'test'
  ? ':memory:'
  : join(__dirname, '../../', DB_STORAGE);

// Sequelize es la conexión ORM a la base de datos SQLite
// logging: false evita imprimir todas las queries (ruido innecesario)
export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage,
  logging: false,  // Para desarrollo, cambiar a console.log si necesitas ver queries
});
