# **Banco API**

### 0) Instalar MongoDB:

    Asegurarse que corra en puerto 27017

### 1) Instalar Node:

    Versión: v18.13.0

### 2) Instalar paquetes:

1. `npm i`
2. `npm i nodemon`

### 3) Generar nuevo archivo .env con las siguientes variables de ambiente (ejemplos):

    PORT=3000
    ENV = "DEV"
    MONGO_URL = "mongodb://localhost:27017/banco-api"
    MIGRATE_dbConnectionUri=mongodb://localhost:27017/banco-api
    JWT_SECRET = "my-32-character-ultra-secure-and-ultra-long-secret"
    JWT_EXPIRES_IN = '1d'
    JWT_EXPIRES_COOKIE_IN = 86400000
    PASSWORD = "Password123!"

### 4) Correr migraciones en el siguiente orden:

1. `node_modules/.bin/migrate up initial_migration`
2. `node_modules/.bin/migrate up movements`
3. `node_modules/.bin/migrate up product`
4. `node_modules/.bin/migrate up user_product`

### 5) Ejecutar programa

    npm run dev


# **Perfiles para sign in**

- Usename: Admin 
- Username: Employee

**La constraseña de cada perfil se setea como variable de ambiente**

