# Rentitp

Aplicación para gestión de alquileres.

## Estructura del proyecto

- `client/`: Frontend de la aplicación.
- `server/`: Backend de la aplicación.
- `asd.txt`: Archivo de prueba.

## Cómo iniciar el proyecto

1. Clona el repositorio.
2. Instala dependencias con `npm install` (en client y server).
3. Inicia con `npm start`.

## Ejecución con Docker

Este proyecto incluye archivos Dockerfile para el frontend (`client/`) y backend (`server/`), así como un archivo de Docker Compose para facilitar la ejecución de ambos servicios.

### Requisitos específicos
- Node.js versión `22.13.1` (definido en los Dockerfile de client y server)
- Los archivos `.env` deben estar presentes en `client/` y `server/` si se requieren variables de entorno personalizadas

### Puertos expuestos
- **Frontend (client):** 3000
- **Backend (server):** 3001 (HTTP), 3443 (HTTPS)

### Instrucciones

1. Asegúrate de tener Docker y Docker Compose instalados.
2. Coloca los archivos `.env` necesarios en las carpetas `client/` y `server/`.
3. Desde la raíz del proyecto, ejecuta:

   ```bash
   docker compose up --build
   ```

   Esto construirá y levantará los servicios `js-client` y `js-server`.

4. Accede a la aplicación:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001 o https://localhost:3443

### Notas
- Los servicios se comunican a través de la red interna `appnet` definida en el archivo de Docker Compose.
- Los certificados para HTTPS deben estar en `server/certs/` (por defecto: `cert.pem` y `key.pem`).
- Los volúmenes de uploads se gestionan dentro del contenedor del backend.

## Autor

19jairo
