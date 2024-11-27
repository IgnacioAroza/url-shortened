# Usa una imagen base de Node.js
FROM node:18

# Establece el directorio de trabajo del contenedor
WORKDIR /usr/src/app

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependecias del proyect
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

# Compila el proyecto TypeScript
RUN npm run build

# Expone el puerto en el que se ejecutara la aplicacion
EXPOSE 3001

# Comando para ejecutar la aplicacion
CMD ["node", "dist/index.js"]