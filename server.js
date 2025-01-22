const express = require('express');
const path = require('path');
const connection = require('./database'); 

// Criação do app usando o Express
const app = express();

// Definir a porta onde o servidor será executado
const port = 3000;

app.use(express.static('public'));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "inicial", "index.html"));
});

//Listar os eventos, usando GET
app.get('/eventos',(req, res) => {
    connection.query('SELECT * FROM T_EVENTO', (err, results) => {
        if (err){
            console.error('Erro ao buscar eventos:', err);
            res.status(500).send('Erro ao buscar eventos');
            return;
        }
        res.json(results);
    });
});

//Ver detalhes de um evento, usando GET junto com id
app.get('/eventos/:id', (req, res) => {
    const idEvento = req.params.id;
    connection.query('SELECT * FROM T_EVENTO WHERE id_eventoPK = ?', 
    [idEvento], (err, results) => {
        if (err){
            console.error('Erro ao buscar evento:', err);
            res.status(500).send('Erro ao buscar evento');
            return;
        }
        if (results.length === 0){
            res.status(400).send('Evento não encontrado');
            return;
        }
        res.json(results[0]); //Retorna o evento específico
    });
});

//Adicionar um novo envento, só adminstradores, usando POST
app.post('/eventos', (res, req) => {
    const {nm_evento, dt_evento, ds_localizacao, ds_evento, img_evento } = req.body;
    const sql = 'INSERT INTO T_EVENTO (nm_evento, dt_evento, ds_localizacao, ds_evento, img_evento) VALUES (?, ?, ?, ?, ?)';
    connection.query(sql, [nm_evento, dt_evento, ds_localizacao, ds_evento, img_evento], (err, results) => {
        if (err){
            console.error('Erro ao adicionar evento:', err);
            res.status(500).send('Error ao adicionar evento');
            return;
        }
        res.send('Evento adicionado com sucesso!');
    });
});

//Excluir um evento, só adminstradores, usando POST
app.post('/eventos', (res, req) => {
    const {nm_evento, dt_evento, ds_localizacao, ds_evento, img_evento } = req.body;
    const sql = 'DELETE INTO T_EVENTO (nm_evento, dt_evento, ds_localizacao, ds_evento, img_evento) VALUES (?, ?, ?, ?, ?)';
    connection.query(sql, [nm_evento, dt_evento, ds_localizacao, ds_evento, img_evento], (err, results) => {
        if (err){
            console.error('Erro ao remover evento:', err);
            res.status(500).send('Error ao removr evento');
            return;
        }
        res.send('Evento removido com sucesso!');
    });
});


// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

