
const mysql = require('mysql2');

// Criação da conexão com o banco de dados
const connection = mysql.createConnection({
    host: 'localhost',     
    port: 3306,
    user: 'root',          
    password: 'Snowsara123@', 
    database: 'DB_ROTACLASSICA' 
});

// Conecta ao banco de dados
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.stack);
        return;
    }
    console.log('Conectado ao banco de dados com sucesso!');
});

module.exports = connection;
