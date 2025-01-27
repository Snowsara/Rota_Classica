//Variável para controlar o mês e o ano exibidos
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let maintenanceDates = [];
let veiculoTipo = "";
let quilometragem = 0;

document.addEventListener('DOMContentLoaded', function(){

    document.getElementById('veiculoForm').addEventListener('submit', function(event){
        event.preventDefault();
    
        veiculoTipo = document.getElementById('veiculoTipo').value;
        const veiculoNome = document.getElementById('veiculoNome').value;
        const veiculoAno = document.getElementById('veiculoAno').value;
        quilometragem = Number(document.getElementById('quilometragem').value);
        const lastMaintenance = document.getElementById('lastMaintenance').value; //no formato string
        const email = document.getElementById('email').value;
    
        if (!veiculoTipo || !veiculoNome || !veiculoAno || isNaN(quilometragem) 
            || !lastMaintenance || !email
        ){
            alert('Todos os campos são obrigatórios e a quilometragem deve ser válida.');
            return;
        }
    
        //Enviar os dados ao servidor
        fetch('/calendario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({
                tp_veiculo: veiculoTipo,
                nm_veiculo: veiculoNome,
                an_veiculo: veiculoAno,
                km_veiculo: quilometragem,
                dt_ultima_manutencao: lastMaintenance,
                ds_email: email 
            })
        })
        .then(response => response.text()) // Primeiro converte para texto
        .then(data => {
            console.log('Resposta do servidor:', data); // Verifique a resposta aqui
            const parsedData = JSON.parse(data); // Depois faz o parse se for JSON válido
            maintenanceDates = parsedData.maintenanceDates.map(dateString => new Date(dateString));
            displayCalendario(maintenanceDates, veiculoTipo, quilometragem);
        })

        document.getElementById('calendario').style.display = 'block';
    
        //Limpar os campos do formulário
        document.querySelectorAll('#veiculoForm input, #veiculoForm select').forEach(input => {
            input.value = "";
        });
    
    })
    .catch(err => {
        console.error('Erro ao enviar os dados:', err);
        alert('Ocorreu um erro ao enviar os dados.');
    });
});

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

function getCarMaintenance(quilometragem){
    //Definindo manutenção específicas para carros clássicos
    if (quilometragem <= 5000){
        return ['Verificação de óleo', 'Revisão de freios'];
    }else if (quilometragem <= 10000){
        return ['Verificação da bateria', 'Limpeza do interior'];
    }else {
        return ['Manutenção da pintura e cromados', 'Verificação de suspensão e direção'];
    }
}

function getMotoMaintenance(quilometragem){
    //Definindo manutenção específicas para motos clássicas
    if (quilometragem <= 5000){
        return ['Verificação de pneus', 'Revisão de freios'];
    }else if (quilometragem <= 10000){
        return ['Verificação de óleo', 'Verificação da corrente'];
    }else {
        return ['Verificação da bateria', 'Verificação de filtros e sistema de iluminação'];
    }
}

function displayCalendario(maintenanceDates, veiculoTipoGlobal, quilometragemGlobal){
    const calendarioBody = document.getElementById('calendarioBody');
    calendarioBody.innerHTML = "";

    const now = new Date();
    const today = now.getDate();

    //Filtrar as datas de manutenção para o mês e ano atuais
    const currentMonthDates = maintenanceDates.filter(date => date.getMonth() === currentMonth
        && date.getFullYear() === currentYear
    );

    //Exibir título com mês e ano
    document.getElementById('calendarHeader').innerHTML = `<span id="prevMonth">&#9664;</span> 
    ${new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric'}).format(new Date(currentYear, currentMonth))}
    <span id="nextMonth">&#9654;</span>`;

    //Obtem o primeiro dia do mês    
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    
    //Obter o último dia do mês
    const lastDayOfMonth = new Date( currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    
    //Calcular o dia da semana do primeiro dia do mês (0 = domingo, 1 = segunda ...)    
    const firstDayOfTheWeek = firstDayOfMonth.getDay();


    //Criar a primeira linha com os dias da semana vazios antes do primeiro dia do mês
    let row = document.createElement('tr');
    for (let j = 0; j < firstDayOfTheWeek; j++){
        const emptyCell = document.createElement('td');
        row.appendChild(emptyCell);
    }

    let day = 1;
    for (let i = firstDayOfTheWeek; day <= daysInMonth; i++){
        if (i % 7 === 0){ //Cria uma nova linha a cada sete dias
            row = document.createElement('tr');
            calendarioBody.appendChild(row);
        }
        
        const cell = document.createElement('td');
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        
        //Destaca o dia atual
        if (day == today && currentMonth == now.getMonth() && currentYear == now.getFullYear()){
            dayNumber.style.color = 'red';
            dayNumber.style.fontWeight = 'bold';
        } else if (day < today && currentMonth === now.getMonth() && currentYear === now.getFullYear()){
            dayNumber.style.color = 'gray'; //Dias passados em cinza
        }

        cell.appendChild(dayNumber);

        //Verifica se há manutenção para este dia
        const maintenance = currentMonthDates.find(date => date.getDate() === day);

        if (maintenance){
            const maintenanceDiv = document.createElement('div');
            maintenanceDiv.className = 'maintenance';

            let maintenanceDescription;
            if (veiculoTipoGlobal === 'carro'){
                maintenanceDescription = getCarMaintenance(quilometragemGlobal).join(' e ');
            }else if (veiculoTipoGlobal === 'moto'){
                maintenanceDescription = getMotoMaintenance(quilometragemGlobal).join(' e ');
            }
                
            maintenanceDiv.textContent = `Manutenção: ${maintenanceDescription}`;
            cell.appendChild(maintenanceDiv);
        }
        row.appendChild(cell);
        day++;
    }
    //Adiciona a última linha ao calendário
    calendarioBody.appendChild(row);
}

document.addEventListener('click', function(event){
    if (event.target.id === 'prevMonth'){
        currentMonth--;
        if (currentMonth < 0){
            currentMonth = 11;
            currentYear--;
        }
        displayCalendario(maintenanceDates, veiculoTipo, quilometragem); //Atualiza o calendário com as manutenções
    }else if (event.target.id === 'nextMonth'){
        currentMonth++;
        if (currentMonth > 11){
            currentMonth = 0;
            currentYear++;
        }
        displayCalendario(maintenanceDates, veiculoTipo, quilometragem); //Atualiza o calendário com as manutenções
    }
});