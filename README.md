# MANUAL DE INSTALACIÓN Y EJECUCIÓN DE RENTITP

1. MÉTODO TRADICIONAL
   Requisitos previos
   •	Node.js y npm instalados
   •	MySQL en ejecución y con base de datos configurada
   •	.env para frontend y backend configurados

# Paso 1: Clonar el repositorio

git clone https://github.com/edw11n /rentitp.git
cd rentitp

# Paso 2: Configurar el backend

•	Entrar al directorio:
cd backend
•	Instalar dependencias:
npm install
•	Configurar el archivo .env:
Crea un archivo .env con lo siguiente (ajustar según el entorno):

# Puertos de servidor

PORT=3001
HTTPS\_PORT=3443

# Configuración de la base de datos

DB\_HOST=localhost
DB\_PORT=3306
DB\_USER=usuario\_mysql
DB\_PASSWORD=contraseña\_mysql
DB\_NAME=rentitp

# Tamaño máximo de imagenes permitido

MAX\_IMAGE\_SIZE=5MB
MAX\_DOC\_SIZE=10MB

# Tipos MIME permitidos

ALLOWED\_MIME\_TYPES=image/jpeg,image/png,image/webp,image/jpg
ALLOWED\_DOWNLOAD\_TYPES=application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
ALLOWED\_MIMES=image/jpeg,image/png,image/webp,image/svg+xml
MAX\_FILE\_SIZE=10485760 # 10MB
MAX\_FILES=10

# Origenes permitidos (cliente)

ALLOWED\_ORIGINS=http://localhost:3000,http://localhost:3443
NODE\_ENV=development
#autenticacion
JWT\_SECRET=ClaveSecreta
JWT\_EXPIRES=10m
JWT\_REFRESH\_SECRET=ClaveSecretaDeRefresco
JWT\_REFRESH\_EXPIRES=7d

# Google Auth 2.0

GOOGLE\_CLIENT\_ID=ID del cliente de Google para Auth2.0
GOOGLE\_CLIENT\_SECRET=ClaveSecretaGoogle
GOOGLE\_CALLBACK\_URL=http://localhost:3001/auth/google/callback
SESSION\_SECRET=SesionSecreta

# Encriptacion de datos

ENCRYPTION\_KEY=ClaveParaEncriptarArchivos
IV\_LENGTH=16

# Paso 3: Configurar el frontend

3.1 Volver al root y entrar al frontend:
cd ../frontend
3.2 Instalar dependencias:
npm install
3.3 Crear archivo .env:

# Para conexión con https

REACT\_APP\_API\_URL=https://localhost:3443

# GoogleClientID

REACT\_APP\_GOOGLE\_CLIENT\_ID=GoogleClientID
Paso 4: Ejecutar ambos servidores
Terminal 1 – Backend:
cd backend
npm start
Terminal 2 – Frontend:
cd frontend
npm start
Aplicación funcionando:
Frontend: http://localhost:3000
Backend API: http://localhost:3443/

# 2\.	MÉTODO CON DOCKER

Requisitos previos
•	Docker y Docker Compose instalados
•	.env para frontend y backend configurados (como en el método tradicional)

# Paso 1: Estructura de archivos necesaria

Asegúrate de tener estos archivos en rentitp/:
docker-compose.yml

# Paso 2: docker-compose.yml

En la raíz del proyecto asegurate de que esté presente el archivo: (rentitp/docker-compose.yml):

# Paso 3: Construir y ejecutar los contenedores

docker-compose up
Esto:
•	Levanta MySQL
•	Inicia el backend en https://localhost:3443 y http://localhost:3001 que redirecciona a https
•	Inicia el frontend en http://localhost:80
Para detener los contenedores
docker-compose down

# Comandos útiles

Ver contenedores en ejecución:
docker ps
Ver logs de un servicio:
docker-compose logs backend
Acceder al contenedor MySQL:
docker exec -it mysql-rentitp mysql -u root -p
Verificar que todo funcione
Abre: http://localhost:80
Prueba el login, registro, y demás funcionalidades
Asegúrate de que las peticiones al backend se hagan correctamente







Problemas comunes :

1\. Error de conexión a MySQL:

&nbsp;  - Solución: Verificar credenciales en .env y que el servicio de MySQL esté activo.

2\. Error de dependencias (npm install falla):

&nbsp;  - Solución: Borrar la carpeta node\_modules y el archivo package-lock.json, y volver a ejecutar npm install.

3\. Fallo en la comunicación Frontend/Backend (CORS o HTTPS):

&nbsp;  - Solución: Asegurar que REACT\_APP\_API\_URL en el frontend y ALLOWED\_ORIGINS en el backend apunten a los puertos correctos (3000 y 3443/3001).

