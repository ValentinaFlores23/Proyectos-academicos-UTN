import 'dotenv/config';

/**
 * CONFIGURACIÓN CENTRALIZADA DE VARIABLES DE ENTORNO
 * 
 * Rol: Centralizar todas las variables de configuración en un único punto.
 * Ventajas:
 * - Fácil de cambiar sin tocar código
 * - Separación de configuración y lógica (buena práctica de 12-factor app)
 * - Permite diferentes valores en dev/test/prod
 */

// Puerto donde escucha el servidor Express
export const PORT = process.env.PORT || 3001;

// Clave secreta para firmar JWT. En producción DEBE venir de environment variables
// Nunca hardcodear este valor en código, es una vulnerabilidad de seguridad
export const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Ambiente: 'development', 'test' o 'production'
// Se usa para diferentes comportamientos (ej: DB en memoria en test)
export const NODE_ENV = process.env.NODE_ENV || 'development';

// Ruta del archivo SQLite. En tests usaremos ':memory:' para aislamiento
export const DB_STORAGE = process.env.DB_STORAGE || 'db.sqlite';
