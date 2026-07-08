/**
 * MIDDLEWARE DE AUTENTICACIÓN JWT
 * 
 * Responsabilidad: Validar token JWT y adjuntar datos del usuario a la petición.
 * 
 * Flujo:
 * 1. Lee header Authorization
 * 2. Extrae token del formato "Bearer {token}"
 * 3. Verifica firma JWT con JWT_SECRET
 * 4. Si es válido, guarda payload en req.usuario
 * 5. Si falla, responde 401 Unauthorized
 * 
 * Seguridad:
 * - Valida que el token no haya sido modificado
 * - Comprueba expiración automáticamente
 * - Rechaza peticiones sin Authorization header
 */

import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';

export default function authMiddleware(req, res, next) {
  // PASO 1: Leer header Authorization
  const authHeader = req.headers['authorization'];

  // PASO 2: Validar formato "Bearer {token}"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  // PASO 3: Extraer token quitando prefijo "Bearer "
  const token = authHeader.split(' ')[1];

  // PASO 4: Verificar JWT
  try {
    // jwt.verify lanza excepción si:
    // - Firma no coincide con JWT_SECRET
    // - Token está expirado
    // - Formato es inválido
    const payload = jwt.verify(token, JWT_SECRET);
    
    // PASO 5: Guardar datos del usuario para uso posterior en controladores
    // payload contiene: { id, email, rol }
    req.usuario = payload;
    
    // PASO 6: Permitir que continúe al siguiente middleware
    next();
  } catch {
    // Si jwt.verify falla, devolver 401
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}