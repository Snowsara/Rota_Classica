const express = require('express');
const path = require('path');
const connection = require('./database'); 
// Criação do app usando o Express
const app = express();
app.use(express.json()); //Necessário para fazer o parsing do corpo d requisiçõs POST com JSON

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

app.post('calendario', (req, res) => {
    const {tp_viculo, nm_veiculo, an_veiculo, km_veiculo, dt_utima_manutencao, ds_email} = req.body;

    //Validar os dados recebidos
    if (!tp_viculo || !nm_veiculo || !an_veiculo || isNaN(km_veiculo) || !dt_utima_manutencao || !ds_email){
        res.status(400).send('Todos os campos são obrigatórios');
        return;
    }

    //Inserindo no banco de dados
    const sql = 'INSERT INTO T_MANUTENCAO (tp_veiculo, nm_veiculo, an_veiculo, km_veiculo, dt_utima_manutencao, ds_email) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(sql, [tp_viculo, nm_veiculo, an_veiculo, km_veiculo, dt_utima_manutencao, ds_email], (err, results) => {
        if (err){
            console.error('Error ao inserir manutenção:', err);
            res.status(500).send('Erro ao inserir manutenção');
            return
        }

        //Calcular as datas de manutenção
        const maintenanceInterval = getMaintenanceInterval(tp_viculo, km_veiculo);
        const maintenanceDates = calculateMaintenanceDates(new Date(dt_utima_manutencao), maintenanceInterval);

        //Enviar as datas de manutenção para o front-end
        res.json({ message: 'Manutenção inserida com sucesso', maintenanceDates});
    });
});

//Funções de cáculo 
function getMaintenanceInterval(veiculoTipo, quilometragem){
    //Definindo intervalos de manutenção com base na quilometragem carro e moto
    if (veiculoTipo === 'carro'){
        if (quilometragem <= 5000){
            return 60; //Intervalos maiores para quilometragem baixa
        }else if (quilometragem <= 10000){
            return 30; //Intervalos menores para quilometragem alta
        }else {
            return 15; //Para carros com quilometragem bem alta
        }
    }else if (veiculoTipo === 'moto'){
        if (quilometragem <= 5000){
            return 30; //Intervalos maiores para quilometragem baixa
        }else if (quilometragem <= 10000){
            return 15; //Intervalos menores para quilometragem alta
        }else {
            return 7; //Para motos com quilometragem muito alta
        }
    }else {
        return 30; //Intervalo padrão caso não seja carro nem moto
    }
}

function calculateMaintenanceDates(lastMaintenance, interval){
    const dates = [];
    let currentDate = new Date(lastMaintenance);
    for (let i = 0; i < 12; i++){
        currentDate.setDate(currentDate.getDate() + interval);
        dates.push(new Date(currentDate));
    }
    return dates;
}

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

