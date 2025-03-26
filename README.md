<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Atronautas API

API REST desarrollada con NestJS que proporciona autenticación de usuarios y gestión de productos.

## 🚀 Requisitos

- Node.js v18+
- Docker y Docker Compose
- MongoDB

## 🛠️ Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/andress1014/astronautas2.git
```

2. Copiar las variables de entorno:
```bash
cp .env.example .env
```

3. Instalar las dependencias:
```bash
npm install
```

## 🐳 Dockerización

Para iniciar el proyecto con Docker, utiliza los siguientes comandos:

```bash
# Construir los contenedores
docker-compose build

# Iniciar los contenedores
docker-compose up
```

## 🏃‍♂️ Ejecución del proyecto

Para ejecutar el proyecto en modo desarrollo:

```bash
npm run start:dev
```

## 🧪 Pruebas

Para ejecutar las pruebas unitarias:

```bash
npm run test
```

## 📖 Documentación de la API

La documentación de la API está disponible en Swagger. Una vez que el proyecto esté en ejecución, accede a las siguientes URLs:

- Documentación principal: `http://localhost:3000/api`
- Documentación extendida: `http://localhost:3000/api/docs`

## 📚 Endpoints

### Autenticación
- **POST /auth/login**: Inicia sesión con credenciales de usuario.
- **POST /auth/register**: Registra un nuevo usuario.

### Productos
- **GET /products**: Lista todos los productos con paginación.
- **POST /products**: Crea un nuevo producto.
- **PUT /products/:id**: Actualiza un producto por su ID.
- **DELETE /products/:id**: Elimina (desactiva) un producto por su ID.

## Licencia

Este proyecto está bajo la licencia [MIT](https://github.com/nestjs/nest/blob/master/LICENSE).
