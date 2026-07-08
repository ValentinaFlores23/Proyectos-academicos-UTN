/**
 * CONTROLADOR DE AUTENTICACIÓN
 * 
 * Responsabilidad: Orquestar flujo de registro y login.
 * - Recibir petición HTTP
 * - Delegar lógica a servicio
 * - Responder al cliente con estado HTTP y datos JSON
 * 
 * Patrón: Controlador thin (delgado).
 * La lógica real está en auth.service.js
 * 
 * Manejo de errores:
 * - try/catch es OBLIGATORIO en async/await
 * - next(err) envía la excepción al error middleware
 */

import * as authService from '../services/auth.service.js';

/**
 * POST /api/auth/register
 * Crear nuevo usuario
 * 
 * Flujo:
 * 1. Recibir req.body con { nombre, email, password, rol? }
 * 2. Llamar authService.registrar()
 * 3. Si es exitoso: responder 201 Created con datos del usuario
 * 4. Si falla: catch captura excepción y envía a middleware de errores
 */
export async function register(req, res, next) {
  try {
    // Delegar al servicio la lógica completa de validación y creación
    const data = await authService.registrar(req.body);
    // 201 Created es el código HTTP correcto al crear un recurso
    res.status(201).json(data);
  } catch (err) {
    // Pasar excepción al middleware de manejo de errores
    next(err);
  }
}

/**
 * POST /api/auth/login
 * Validar credenciales y retornar JWT
 * 
 * Flujo:
 * 1. Recibir req.body con { email, password }
 * 2. Llamar authService.login()
 * 3. Si es válido: responder 200 OK con { token, usuario }
 * 4. Si falla: catch captura excepción (error.status = 401)
 */
export async function login(req, res, next) {
  try {
    const data = await authService.login(req.body);
    // 200 OK es implícito en res.json()
    res.json(data);
  } catch (err) {
    next(err);
  }
}
