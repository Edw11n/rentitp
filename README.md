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
HTTPS_PORT=3443
# Configuración de la base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=usuario_mysql
DB_PASSWORD=contraseña_mysql
DB_NAME=rentitp
# Tamaño máximo de imagenes permitido
MAX_IMAGE_SIZE=5MB
MAX_DOC_SIZE=10MB
# Tipos MIME permitidos
ALLOWED_MIME_TYPES=image/jpeg,image/png,image/webp,image/jpg
ALLOWED_DOWNLOAD_TYPES=application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
ALLOWED_MIMES=image/jpeg,image/png,image/webp,image/svg+xml
MAX_FILE_SIZE=10485760 # 10MB
MAX_FILES=10
# Origenes permitidos (cliente)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3443
NODE_ENV=development
#autenticacion
JWT_SECRET=ClaveSecreta
JWT_EXPIRES=10m
JWT_REFRESH_SECRET=ClaveSecretaDeRefresco
JWT_REFRESH_EXPIRES=7d
# Google Auth 2.0
GOOGLE_CLIENT_ID=ID del cliente de Google para Auth2.0
GOOGLE_CLIENT_SECRET=ClaveSecretaGoogle
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback
SESSION_SECRET=SesionSecreta
# Encriptacion de datos
ENCRYPTION_KEY=ClaveParaEncriptarArchivos
IV_LENGTH=16
# Paso 3: Configurar el frontend
3.1 Volver al root y entrar al frontend:
cd ../frontend
3.2 Instalar dependencias:
npm install
3.3 Crear archivo .env:
# Para conexión con https
REACT_APP_API_URL=https://localhost:3443
# GoogleClientID
REACT_APP_GOOGLE_CLIENT_ID=GoogleClientID
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

# 2.	MÉTODO CON DOCKER
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
