# **Banco API**

### 0) Instalar MongoDB:

    Asegurarse que corra en puerto 27017

### 1) Instalar Node:

    Versión: v18.13.0

### 2) Instalar paquetes:

`npm i`
`npm i nodemon`

### 3) Correr migraciones en el siguiente orden:

`node_modules/.bin/migrate up initial_migration`
`node_modules/.bin/migrate up movements`
`node_modules/.bin/migrate up product`
`node_modules/.bin/migrate up user_product`

### 4) Generar nuevo archivo .env con las siguientes variables de ambiente:

    PORT=3000
    ENV = "DEV"
    MONGO_URL = "mongodb://localhost:27017/banco-api"
    MIGRATE_dbConnectionUri=mongodb://localhost:27017/banco-api
    JWT_SECRET = "my-32-character-ultra-secure-and-ultra-long-secret"
    JWT_EXPIRES_IN = '1d'
    JWT_EXPIRES_COOKIE_IN = 86400000
    PASSWORD = "Perritos123!"

### 5) Ejecutar programa

    npm run dev


# **Perfiles para sign in**

- Usename: Admin 
- Username: Employee

**La constraseña de cada perfil se setea como variable de ambiente**

