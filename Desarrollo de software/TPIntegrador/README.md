# TP Equipamiento — DDS 2026 · Curso 3K3

Sistema full stack para administrar solicitudes de préstamo de equipamiento. Permite pedir equipos, validar disponibilidad, gestionar autorizaciones y registrar el historial completo de cada solicitud.

---

## Instrucciones para ejecutar

### Requisitos previos

- Node.js v18 o superior
- npm v9 o superior

### 1. Backend

```bash
cd backend
npm install
npm run seed        # Carga datos iniciales (8 equipos, 4 usuarios, 12 solicitudes)
npm run dev         # Inicia el servidor en http://localhost:3001
```

> El backend usa SQLite como base de datos. El archivo `db.sqlite` se crea automáticamente en la raíz del directorio `backend/`. No es necesario configurar ningún motor externo.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev         # Inicia la aplicación en http://localhost:5173
```

### 3. Variables de entorno (opcionales)

El backend funciona sin archivo `.env`. Si se quiere personalizar, crear `backend/.env`:

```
PORT=3001
JWT_SECRET=mi_clave_secreta
NODE_ENV=development
DB_STORAGE=db.sqlite
```

---

## Usuarios de prueba

Los usuarios semilla se crean al ejecutar `npm run seed`. Las contraseñas están hasheadas con `bcryptjs` (salt 10).

| Rol       | Nombre          | Email               | Contraseña  |
|-----------|-----------------|---------------------|-------------|
| admin     | Admin Sistema   | admin@dds.com       | admin123    |
| encargado | Encargado Lab   | encargado@dds.com   | encarg123   |
| usuario   | Ana López       | ana@dds.com         | user123     |
| usuario   | Carlos Vera     | carlos@dds.com      | user123     |

> Las contraseñas se almacenan como hash en la base de datos. No se exponen en ninguna respuesta de la API ni en el payload del JWT.

---

## Endpoints principales

### Autenticación

| Método | Ruta                  | Auth | Descripción                        |
|--------|-----------------------|------|------------------------------------|
| POST   | /api/auth/register    | No   | Registrar un nuevo usuario         |
| POST   | /api/auth/login       | No   | Iniciar sesión y obtener JWT       |

### Equipos

| Método | Ruta           | Auth | Descripción                                          |
|--------|----------------|------|------------------------------------------------------|
| GET    | /api/equipos   | Sí   | Listar equipos. Acepta `categoria`, `estado`, `fechaRetiro`, `fechaDevolucion` como filtros |

### Solicitudes

| Método | Ruta                              | Auth                 | Descripción                                        |
|--------|-----------------------------------|----------------------|----------------------------------------------------|
| GET    | /api/solicitudes                  | Sí                   | Listar solicitudes con filtros y paginación        |
| GET    | /api/solicitudes/resumen          | Sí (admin/encargado) | Panel resumen administrativo                       |
| GET    | /api/solicitudes/:id              | Sí                   | Detalle de una solicitud                           |
| GET    | /api/solicitudes/:id/historial    | Sí                   | Historial de cambios de una solicitud              |
| POST   | /api/solicitudes                  | Sí                   | Crear una nueva solicitud                          |
| PUT    | /api/solicitudes/:id              | Sí                   | Editar fechas o motivo (solo si está pendiente)    |
| PATCH  | /api/solicitudes/:id/cancelar     | Sí                   | Cancelar una solicitud propia                      |
| PATCH  | /api/solicitudes/:id/aprobar      | Sí (admin/encargado) | Aprobar una solicitud pendiente                    |
| PATCH  | /api/solicitudes/:id/rechazar     | Sí (admin/encargado) | Rechazar una solicitud pendiente                   |
| PATCH  | /api/solicitudes/:id/devolver     | Sí (admin/encargado) | Marcar una solicitud aprobada como devuelta        |

**Parámetros de filtro y paginación para `GET /api/solicitudes`:**

| Param    | Tipo   | Descripción                                 |
|----------|--------|---------------------------------------------|
| estado   | string | pendiente, aprobada, rechazada, cancelada, devuelta |
| equipoId | number | ID del equipo                               |
| categoria| string | notebook, proyector, cámara, kit de red, tablet |
| desde    | date   | Fecha de retiro mínima (YYYY-MM-DD)         |
| hasta    | date   | Fecha de retiro máxima (YYYY-MM-DD)         |
| page     | number | Número de página (default: 1)               |
| limit    | number | Resultados por página (default: 10)         |
| sortBy   | string | Campo por el que ordenar (default: createdAt)|
| order    | string | ASC o DESC (default: DESC)                  |

---

## Rutas del frontend

| Ruta                        | Acceso              | Descripción                                           |
|-----------------------------|---------------------|-------------------------------------------------------|
| /login                      | Público             | Iniciar sesión                                        |
| /register                   | Público             | Registrarse                                           |
| /solicitudes                | Autenticado         | Listado con filtros, paginación y acceso a detalle    |
| /solicitudes/nueva          | Autenticado         | Crear nueva solicitud                                 |
| /solicitudes/:id            | Autenticado         | Detalle, historial y acciones según rol               |
| /solicitudes/:id/editar     | Autenticado         | Editar solicitud (solo si está pendiente)             |
| /resumen                    | Admin / Encargado   | Panel de administración con métricas                  |
| *                           | —                   | Página 404 para rutas desconocidas                    |

Las rutas protegidas redirigen a `/login` si no hay sesión activa. La ruta `/resumen` redirige a `/solicitudes` si el rol no es admin ni encargado.

---

## Disponibilidad del equipo y autorización de préstamos

### ¿Cuándo un equipo está disponible?

Un equipo se considera disponible para un período cuando cumple **todas** estas condiciones:

1. Su campo `estado` es `disponible` (no `prestado`, `mantenimiento` ni `baja`).
2. No tiene otra solicitud con estado `aprobada` cuyas fechas se superpongan con el período solicitado (superposición: `fechaRetiro` de la nueva es anterior a `fechaDevolucion` de la existente **y** `fechaDevolucion` de la nueva es posterior a `fechaRetiro` de la existente).

Las solicitudes en estado `pendiente` no bloquean la disponibilidad del equipo para nuevas solicitudes, pero sí se advierte su existencia.

### ¿Qué pasa al aprobar una solicitud?

- El estado del equipo pasa automáticamente a `prestado`.
- Si el equipo tiene `requiereAutorizacion: true`, solo usuarios con rol `admin` o `encargado` pueden aprobar la solicitud.

### ¿Qué pasa al devolver?

- El estado del equipo vuelve a `disponible`.
- Solo se puede devolver una solicitud cuyo estado sea `aprobada`.

### Flujo completo de estados

```
[creación] → pendiente
pendiente  → aprobada   (admin/encargado)
pendiente  → rechazada  (admin/encargado)
pendiente  → cancelada  (propietario o admin/encargado)
aprobada   → cancelada  (propietario o admin/encargado)
aprobada   → devuelta   (admin/encargado)
```

Transiciones no permitidas: devolver una solicitud que no esté `aprobada`, aprobar una solicitud `cancelada` o `rechazada`.

### Solicitudes vencidas

Una solicitud se considera vencida cuando su `estado` es `aprobada` y su `fechaDevolucion` es anterior a la fecha actual. El cálculo se realiza en el backend al listar y al consultar el detalle; el frontend muestra una insignia visual de "vencida".

---

## JWT, roles y permisos

### Cómo funciona el JWT

Al hacer login exitoso, el backend genera un JWT firmado con `JWT_SECRET` y duración de 1 hora. El payload contiene únicamente:

```json
{
  "id": 1,
  "email": "admin@dds.com",
  "rol": "admin"
}
```

No se incluye contraseña ni `passwordHash` en ningún momento.

El frontend almacena el token en `localStorage` y lo adjunta automáticamente a todas las peticiones mediante un interceptor de Axios:

```
Authorization: Bearer <token>
```

Al expirar el token o recibir un 401, el interceptor elimina la sesión y redirige a `/login`.

### Roles y permisos

| Acción                                    | usuario | encargado | admin |
|-------------------------------------------|:-------:|:---------:|:-----:|
| Ver sus propias solicitudes               | ✅      | ✅        | ✅    |
| Ver todas las solicitudes                 | ❌      | ✅        | ✅    |
| Crear una solicitud                       | ✅      | ✅        | ✅    |
| Editar su propia solicitud (pendiente)    | ✅      | ✅        | ✅    |
| Cancelar su propia solicitud              | ✅      | ✅        | ✅    |
| Aprobar / Rechazar solicitudes            | ❌      | ✅        | ✅    |
| Marcar devolución                         | ❌      | ✅        | ✅    |
| Ver panel resumen                         | ❌      | ✅        | ✅    |

Las rutas protegidas responden:
- `401` si no se envía token o el token es inválido/expirado.
- `403` si el token es válido pero el rol no tiene permiso para la acción.

---

## Ejecutar pruebas

```bash
cd backend
npm test
```

Los tests usan una base de datos SQLite en memoria (`sync({ force: true })` en `beforeAll`) y no afectan la base de datos de desarrollo. Se ejecutan en serie (`--runInBand`) para evitar condiciones de carrera entre tests que comparten estado.

### Casos cubiertos

| # | Caso                                                         |
|---|--------------------------------------------------------------|
| 1 | Login correcto devuelve token (200)                          |
| 2 | Login con contraseña incorrecta devuelve 401                 |
| 3 | Listado de solicitudes con token (200)                       |
| 4 | Listado sin token devuelve 401                               |
| 5 | Detalle de solicitud inexistente devuelve 404                |
| 6 | Creación válida de solicitud devuelve 201                    |
| 7 | Creación con fechas inconsistentes (retiro ≥ devolución) devuelve 400 |
| 8 | Creación con equipo en mantenimiento devuelve 400            |
| 9 | Acceso sin JWT a ruta protegida devuelve 401                 |
| 10| Usuario común intentando aprobar devuelve 403                |
| 11| Devolver una solicitud no aprobada devuelve 400              |
| 12| Aprobar una solicitud ya cancelada devuelve 400              |

---

## Estructura de carpetas

```
tp_integrador/
├── backend/
│   ├── src/
│   │   ├── config/          # Variables de entorno y conexión a DB
│   │   ├── controllers/     # Reciben req/res y delegan al servicio
│   │   ├── db/              # Sequelize, seed y reset
│   │   ├── middlewares/     # auth JWT, roles, manejo de errores
│   │   ├── models/          # Definición de entidades Sequelize
│   │   ├── repositories/    # Acceso a datos (queries)
│   │   ├── routes/          # express.Router por recurso
│   │   ├── services/        # Reglas de negocio y validaciones
│   │   └── utils/           # Helpers (respuestas API)
│   ├── tests/
│   │   └── solicitudes.test.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # EstadoBadge, Navbar, ProtectedRoute
│   │   ├── context/         # AuthContext (usuario, token, rol)
│   │   ├── layouts/         # LayoutPrincipal con Navbar
│   │   ├── pages/           # Una página por pantalla principal
│   │   ├── services/        # api.js, auth.service, solicitudes.service, equipos.service
│   │   └── utils/           # fechaUtils
│   └── package.json
└── README.md
```

---

## Decisiones técnicas

### Persistencia

Se eligió **SQLite con Sequelize** porque permite persistencia real entre reinicios sin requerir instalar un servidor de base de datos externo, lo que simplifica la puesta en marcha para corrección. El archivo `db.sqlite` se genera automáticamente. Cambiar a PostgreSQL o MySQL solo requiere modificar `config/database.js`.

### División de responsabilidades

La separación sigue el patrón **Rutas → Controller → Service → Repository**:
- Las **rutas** solo aplican middlewares y delegan al controller.
- Los **controllers** reciben `req/res`, extraen datos y llaman al service.
- Los **services** contienen todas las reglas de negocio (disponibilidad, superposición, transiciones de estado, historial).
- Los **repositories** encapsulan las queries de Sequelize, facilitando el reemplazo del ORM sin tocar la lógica.

### Autenticación en frontend

El `AuthContext` persiste `usuario`, `token` y `rol` en `localStorage` para sobrevivir recargas de página. El interceptor de Axios inyecta el token en cada request y maneja la expiración globalmente.

### Contraseñas

Todos los usuarios (incluidos los semilla) tienen la contraseña almacenada como hash `bcrypt` con salt 10. Las contraseñas en texto plano que figuran en este README son solo para facilitar las pruebas; nunca viajan por la red ni se almacenan en texto plano.

---

## Limitaciones conocidas

- El campo `activo` del usuario existe en el modelo pero no hay endpoint para activar/desactivar usuarios desde la interfaz. Un usuario con `activo: false` no puede iniciar sesión (validado en el service), pero la gestión debe hacerse directamente en la base de datos o via seed.
- El ordenamiento en el listado acepta `sortBy` y `order` como parámetros, pero el frontend no expone controles visuales para ello; se puede usar directamente desde la API.
- No hay refresh token: el JWT expira a la hora y el usuario debe volver a iniciar sesión.
- Los tests corren sobre una base de datos en memoria independiente; no requieren `npm run seed` previo.
- Formato de fechas en los filtros: los selectores de fecha del listado de solicitudes y del formulario de alta/edición dependen del idioma configurado en el sistema operativo y el navegador. Si el sistema está en inglés, los campos de fecha se mostrarán en formato `mm/dd/yyyy` en lugar de `dd/mm/yyyy`. Para visualizar correctamente las fechas en formato latinoamericano (DD/MM/YYYY) se recomienda abrir la aplicación en un navegador cuyo idioma esté configurado en español. En Chrome: `Configuración → Idiomas → Agregar español (Latinoamérica o Argentina) y moverlo al primer lugar`. Las fechas que se muestran en el detalle de la solicitud y en el historial sí se renderizan siempre en formato argentino independientemente del idioma del navegador, ya que se formatean manualmente desde el código.