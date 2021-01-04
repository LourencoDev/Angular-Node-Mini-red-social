const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')

const port = process.env.PORT || 8080
require('./database.js')

// Archivo de rutas
const user_route = require('./routes/user')

// Middlewars
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Cors
app.use(cors())

// Cargar rutas
app.use('/api', user_route)

// Servidor
app.listen(port, () => {
    console.log('Servidor corriendo en el puerto', port)
})