# MateCode Tasks

SPA de gestión de tareas construida como Proyecto Integrador 4 (FSM4 - Henry). Permite a los usuarios registrarse, iniciar sesión y gestionar sus tareas personales de forma segura y persistente en la nube.

**URL de producción:** https://matecode-tasks-r57x9ceva-kvc.vercel.app

## Contexto

MateCode es una startup ficticia que desarrolla aplicaciones web para pequeñas empresas. Este proyecto resuelve la necesidad de un cliente de gestionar tareas diarias de forma organizada, persistente y accesible desde cualquier dispositivo.

## Stack tecnológico

- **Frontend:** React + TypeScript + Vite
- **Backend as a Service:** Firebase (Authentication + Firestore)
- **Notificaciones por email:** AWS SES
- **Deploy:** Vercel
- **Testing:** Vitest + React Testing Library

## Decisiones arquitectónicas

### Estructura por capas

El proyecto separa responsabilidades en capas claras dentro de `src/`:

- `pages/` — vistas completas asociadas a una ruta (Login, Register, Tasks)
- `components/` — piezas de UI reutilizables (TodoForm, TodoList)
- `features/` — lógica de negocio por dominio (AuthContext)
- `services/` — integración con servicios externos (Firebase, Firestore, AWS SES)
- `routes/` — configuración de rutas protegidas
- `hooks/` — lógica reutilizable con estado (useAuth, useTasks)
- `types/` — definiciones de TypeScript compartidas
- `api/` — funciones serverless de Vercel (envío de email con SES)

Esta separación permite que agregar funcionalidades sea predecible: la lógica de negocio no se mezcla con la UI, y las integraciones externas están aisladas en `services/`.

### Autenticación y estado global

Se usa React Context (`AuthContext`) junto con `onAuthStateChanged` de Firebase (patrón Observer) para mantener el estado de sesión sincronizado en toda la app sin prop drilling. El estado `loading` evita redirecciones prematuras mientras Firebase determina si existe una sesión activa.

### Seguridad de datos

La protección real de los datos no depende del filtrado en el cliente, sino de las **Firestore Security Rules**, que verifican que `request.auth.uid` coincida con el `userId` del documento antes de permitir lectura, escritura, actualización o borrado. Se verificó explícitamente que un usuario no puede acceder a las tareas de otro usuario, usando dos cuentas de prueba distintas.

### Credenciales y variables de entorno

- Las credenciales de Firebase están en variables de entorno con prefijo `VITE_` (requerido por Vite para exponerlas al bundle del cliente). Estas credenciales son públicas por diseño; la seguridad real vive en las Firestore Rules.
- Las credenciales de AWS viven **sin** el prefijo `VITE_`, exclusivamente como variables de entorno del lado del servidor (función serverless en Vercel), nunca en el frontend. Esto evita que puedan extraerse inspeccionando el bundle del navegador.

## Instalación local

```bash
git clone https://github.com/katherine-vasquez/matecode-tasks.git
cd matecode-tasks
npm install
```

Crear un archivo `.env` en la raíz (ver `.env.example`) con las siguientes variables:

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=


Estos valores se obtienen desde Firebase Console → Project Settings → tu app web.

```bash
npm run dev
```

## Scripts disponibles

- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción
- `npm run test` — corre los tests con Vitest
- `npm run preview` — sirve el build de producción localmente

## Variables de entorno necesarias

### Frontend (con prefijo `VITE_`, expuestas al navegador)

VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID


### Función serverless (sin prefijo, solo lado servidor)

AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
SES_SENDER_EMAIL


Todas configuradas directamente en Vercel (Project Settings → Environment Variables), nunca en el código fuente.

## Estado de funcionalidades

| Funcionalidad | Estado |
|---|---|
| Registro, login, logout | ✅ Funcional |
| Sesión persistente | ✅ Funcional |
| Rutas protegidas | ✅ Funcional |
| CRUD de tareas con sincronización en tiempo real (onSnapshot) | ✅ Funcional |
| Firestore Security Rules (aislamiento por usuario) | ✅ Funcional y verificado con dos usuarios distintos |
| Tests unitarios y de componentes (Vitest + RTL) | ✅ 4 tests pasando |
| Deploy en Vercel | ✅ Funcional |
| Email de resumen vía AWS SES | ✅ Funcional y verificado en producción |

## Flujo de envío de emails

1. El usuario hace click en el botón "Enviar resumen por email" desde la vista de tareas.
2. El frontend hace un `POST` a `/api/send-summary` con su email y el array de tareas actuales (título, descripción, estado de completado).
3. La función serverless (`api/send-summary.ts`) valida el payload, arma un resumen HTML (total de tareas, completadas, pendientes, listado) y llama a `SendEmailCommand` de `@aws-sdk/client-ses`, usando credenciales que solo existen en el entorno del servidor.
4. AWS SES envía el email al remitente/destinatario verificado (la cuenta está en modo sandbox, por lo que solo puede enviar a direcciones verificadas explícitamente en la consola de SES).
5. La función responde con éxito o error, y el frontend refleja el estado (loading/success/error) sin recargar la página.

En ningún momento las credenciales de AWS quedan expuestas en el código del cliente: el frontend solo conoce la ruta `/api/send-summary`, nunca las claves de acceso.

## Uso de IA en el desarrollo

Se utilizó Claude (Anthropic) como asistente de desarrollo a lo largo de todo el proyecto, con un patrón de trabajo basado en:

- **Auditar el código generado con preguntas específicas**: se verificó explícitamente, con dos cuentas de usuario reales, que las Security Rules impiden el acceso cruzado a datos entre usuarios, en lugar de asumir que las reglas escritas funcionan como se espera.
- **Depuración guiada por mensajes de error reales**: ante fallos concretos (módulos no encontrados por inconsistencias en nombres de archivo, archivos guardados vacíos, un `vite.config.ts` con sintaxis duplicada), se usó el mensaje de error como punto de partida para diagnosticar la causa antes de aplicar una solución, en vez de reintentar cambios a ciegas.
- **Lectura de logs de producción para diagnosticar fallos no evidentes desde el frontend**: cuando la integración con SES devolvía errores genéricos, se usó `vercel logs --expand` para obtener el stack trace completo del servidor. Esto permitió identificar dos errores concretos de transcripción: una variable de entorno (`AWS_REGION`) que contenía por error el comando de terminal en lugar del valor real, y un `AWS_SECRET_ACCESS_KEY` mal copiado que generaba un error de firma (`SignatureDoesNotMatch`). Esto reforzó la importancia de verificar el valor real de cada variable de entorno en producción, no solo su existencia.