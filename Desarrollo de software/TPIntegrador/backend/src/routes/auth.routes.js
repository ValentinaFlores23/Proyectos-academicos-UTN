/**
 * RUTAS DE AUTENTICACIÓN
 * 
 * Responsabilidad: Mapear endpoints HTTP a acciones de autenticación.
 * 
 * Patrón: Router de Express.
 * Sin middlewares de autorización porque el registro y login deben ser públicos.
 * 
 * Flujo REST:
 * 1. POST /api/auth/register - crear nuevo usuario
 * 2. POST /api/auth/login - validar credenciales e retornar JWT
 */

import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';

const router = Router();

// POST: Recurso público de registro
// Petición: { nombre, email, password, rol? }
// Respuesta: usuario creado (sin hash) o error 400
router.post('/register', register);

// POST: Recurso público de login
// Petición: { email, password }
// Respuesta: { token, usuario } o error 401
router.post('/login', login);

export default router;