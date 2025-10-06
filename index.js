const { Console } = require('console');
const express =  require('express');

const path = require('path');
require('dotenv').config()


//Db Config
const {dbConnection} = require('./database/config')
dbConnection();

// Express app (web server)
const app = express();

//Read and parse body
app.use(express.json());

//Node Server
const server = require('http').createServer(app);  // Creates HTTP server
module.exports.io  = require('socket.io')(server);  /// Attaches socket.io to server

require('./sockets/socket'); // Loads socket logic (the call operator)

//Path publico
const publicPath = path.resolve(__dirname,'public');  // Static files location

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl} - Body:`, req.body, 'Headers:', req.headers['x-token']);
  next();
});


//My routes
app.use('/api/signup',require('./routes/auth'));
app.use('/api/signin',require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/support', require('./routes/support'));

app.use(express.static(publicPath)); // Serve index.html from /public

const PORT = process.env.PORT ||3000;

server.listen(PORT, ( err )=>{
    if (err) throw new Error(err);

    console.log('Servidor corriendo en puerto!: ',PORT);
});