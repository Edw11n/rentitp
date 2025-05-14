# Etapa 1: construir la app
FROM node:18 AS builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Etapa 2: usar Nginx para servir el contenido estático
FROM nginx:alpine

# Copia los archivos de build a la carpeta que Nginx sirve
COPY --from=builder /app/build /usr/share/nginx/html

# Copia tu configuración personalizada de Nginx (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
