/**
 * MIDDLEWARE DE MANEJO DE ERRORES
 * 
 * Responsabilidad: Capturar todas las excepciones no manejadas y responder de forma consistente.
 * 
 * CRÍTICO: Este middleware DEBE tener exactamente 4 parámetros (err, req, res, next)
 * Express lo identifica por eso. Si falta un parámetro no se trigguea.
 * 
 * Flujo:
 * 1. Captura errores lanzados con throw en servicios/rutas
 * 2. Lee err.status si existe (asignado manualmente), sino asume 500
 * 3. Loguea error completo en consola para debugging
 * 4. Responde al cliente sin exponer detalles internos
 * 
 * Buena práctica de seguridad:
 * - No devolver stack trace al cliente (riesgo de information disclosure)
 * - Log en servidor para debugging
 */

// eslint-disable-next-line no-unused-vars
// El parámetro 'next' no se usa pero ES NECESARIO para que Express lo reconozca

export default function errorMiddleware(err, req, res, next) {
  // Registrar completo en servidor para debugging
  console.error(err.stack);
  
  // Leer status personalizado o asumir 500 Internal Server Error
  const status = err.status || 500;
  
  // Responder al cliente sin exponer detalles internos
  res.status(status).json({ error: err.message || 'Error interno del servidor' });
}