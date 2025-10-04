FROM node:20

WORKDIR /app

# Especifica la plataforma y arquitectura explícitamente
ENV npm_config_platform=linux
ENV npm_config_arch=x64

# Instala dependencias del sistema para sharp
RUN apt-get update && apt-get install -y \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

# Copia solo los archivos de dependencias primero
COPY package*.json ./

# Instala sharp con flags explícitos y omite opcionales no necesarios
RUN npm install --include=optional sharp --os=linux --cpu=x64 sharp
RUN npm install

# Copia el resto de la aplicación
COPY . .

EXPOSE 3443

CMD ["npm", "start"]