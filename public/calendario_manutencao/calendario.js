document.getElementById('veiculoForm').addEventListener('submit', function(event){
    event.preventDefault();

    const veiculoTipo = document.getElementById('veiculoTipo').value;
    const veiculoNome = document.getElementById('veiculoNome').value;
    const veiculoAno = document.getElementById('veiculoAno').value;
    const quilometragem = document.getElementById('quilometragem').value;
    const lastMaintenance = new Date(document.getElementById('lastMaintenance').value);
    const email = document.getElementById('email').value;

    if (!veiculoTipo || !veiculoNome || !veiculoAno || !quilometragem || !lastMaintenance
        || !email
    ){
        alert('Todos os campos são obrigatórios.');
        return;
    }

    const maintenanceInterval = getMaintenanceInterval(veiculoTipo, quilometragem);
    const maintenanceDates = calculateMaintenanceDates(lastMaintenance, maintenanceInterval);
    displayCalendario(maintenanceDates);

    document.getElementById('calendario').style.display = 'block';

    //Limpar os campos do formulário
    document.querySelectorAll('veiculoForm input, #veiculoForm select').forEach(input => {
        input.value = "";
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

function displayCalendario(maintenanceDates){
    const calendarioBody = document.getElementById('calendarioBody');
    calendarioBody.innerHTML = "";

    //Obtem o primeiro dia do mês
    const firstDayOfMonth = new Date(maintenanceDates[0]);
    firstDayOfMonth.setDate(1);

    //Obter o último dia do mês
    const lastDayOfMonth = new Date(maintenanceDates[0].getFullYear(), maintenanceDates[0].getMonth() + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    //Calcular o dia da semana do primeiro dia do mês (0 = domingo, 1 = segunda ...)
    const firstDayOfTheWeek = firstDayOfMonth.getDay();

    //Criar a primeira linha com os dias da semana vazios antes do primeiro dia do mês
    let row = document.createElement('tr');
    for (let j = 0; j < firstDayOfMonth; j++){
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
        if (day <= daysInMonth){
            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.textContent = day;
            cell.appendChild(dayNumber);

            const maintenance = maintenanceDates.find(date => date.getDate() === day
            && date.getMonth() === maintenanceDates[0].getMonth());

            if (maintenance){
                const maintenanceDiv = document.createElement('div');
                maintenanceDiv.className = 'maintenance';
                maintenanceDiv.textContent = 'Manutenção';
                cell.appendChild(maintenanceDiv);
            }
            day++;
        }
        row.appendChild(cell);
    }
}