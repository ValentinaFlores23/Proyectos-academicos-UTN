/**
 * PUNTO DE ENTRADA - CONFIGURACIÓN DEL SERVIDOR EXPRESS
 * 
 * Responsabilidad: 
 * - Crear la aplicación Express
 * - Configurar middleware global (CORS, JSON parsing)
 * - Montar las rutas de la API
 * - Configurar manejo de errores centralizado
 * - Arrancar el servidor (solo en modo producción)
 * 
 * Patrón: Express app factory — permite que tests importen el app sin llamar listen()
 */

import express from 'express';
import cors from 'cors';
import { PORT, NODE_ENV } from './config/env.js';
import { sequelize } from './config/database.js';
import './models/index.js';  // Importa PRIMERO los modelos para registrar asociaciones
import authRoutes from './routes/auth.routes.js';
import equiposRoutes from './routes/equipos.routes.js';
import solicitudesRoutes from './routes/solicitudes.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';

const app = express();

// MIDDLEWARE GLOBAL #1: CORS
// Solo permite peticiones desde http://localhost:5173 (el front-end React local)
// Previene ataques CSRF y acceso desde orígenes maliciosos
app.use(cors({ origin: 'http://localhost:5173' }));

// MIDDLEWARE GLOBAL #2: Parseo de JSON
// Transforma req.body raw a objeto JavaScript
// Debe estar ANTES de las rutas para que los controladores accedan a req.body
app.use(express.json());

// ENRUTAMIENTO: Monta cada grupo de rutas bajo su prefijo
// CONVENCIÓN REST: /api/{recurso}
app.use('/api/auth', authRoutes);        // POST /api/auth/login, /api/auth/register
app.use('/api/equipos', equiposRoutes);  // GET /api/equipos?filtros
app.use('/api/solicitudes', solicitudesRoutes);  // Todas las operaciones de solicitudes

// MIDDLEWARE GLOBAL #3: Manejo de Errores
// CRÍTICO: Debe ir SIEMPRE al final.
// Captura todos los throw/next(err) de rutas y middlewares anteriores
app.use(errorMiddleware);

// STARTUP condicional
// En modo test, no arrancamos servidor: Jest/Supertest se encarga
// En producción, sincronizamos DB y escuchamos en el puerto
async function startServer() {
  // sequelize.sync() crea/altera tablas según los modelos definidos
  // En desarrollo es cómodo; en producción se usan migraciones
  await sequelize.sync();
  app.listen(PORT, () => console.log(`Backend corriendo en puerto ${PORT}`));
}

if (NODE_ENV !== 'test') {
  startServer();
}

// Exportamos app para que tests la importen sin llamar a listen()
export default app;