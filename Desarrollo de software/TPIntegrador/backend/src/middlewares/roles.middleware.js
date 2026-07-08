/**
 * MIDDLEWARE DE AUTORIZACIÓN POR ROL
 * 
 * Responsabilidad: Verificar que el usuario tiene un rol permitido.
 * 
 * Flujo:
 * 1. Requiere que authMiddleware haya ejecutado primero
 * 2. Lee req.usuario.rol (agregado por authMiddleware)
 * 3. Comprueba si es 'admin' o 'encargado'
 * 4. Si no, rechaza con 403 Forbidden
 * 
 * Diferencia entre 401 y 403:
 * - 401: No autenticado (sin token o token inválido)
 * - 403: Autenticado pero sin permisos suficientes
 */

export function soloAdmin(req, res, next) {
  // Verifica que req.usuario existe (debería venir de authMiddleware)
  // Y que su rol está en la lista permitida
  if (!['admin', 'encargado'].includes(req.usuario?.rol)) {
    // 403 Forbidden: El usuario está autenticado pero no tiene permisos
    return res.status(403).json({ error: 'No tenés permisos para esta acción' });
  }
  // Si el rol es válido, permite que continúe
  next();
}