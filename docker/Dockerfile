# Usa una imagen base de Node.js
FROM node:18

# Establece el directorio de trabajo del contenedor
WORKDIR /usr/src/app

# Copia los archivos package*.json
COPY ../package*.json ./

# Copia el archivo tsconfig.json
COPY ../tsconfig.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el código fuente
COPY ../src/ ./src/

# Copia los archivos de configuración adicionales
COPY ../.env* ./

# Compila el proyecto TypeScript
RUN npm run build

# Expone el puerto en el que se ejecutará la aplicación
EXPOSE 3001

# Comando para ejecutar la aplicación
CMD ["node", "dist/index.js"]