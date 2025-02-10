let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let maintenanceDates = [];
let veiculoTipo = "";
let quilometragem = 0;

document.getElementById('veiculoForm').addEventListener('submit', function(event){
    event.preventDefault();

    // Atualizando as variáveis globais, sem redeclará-las
    veiculoTipo = document.getElementById('veiculoTipo').value;
    const veiculoNome = document.getElementById('veiculoNome').value;
    const veiculoAno = document.getElementById('veiculoAno').value;
    quilometragem = Number(document.getElementById('quilometragem').value);
    const lastMaintenance = new Date(document.getElementById('lastMaintenance').value);
    const email = document.getElementById('email').value;

    if (!veiculoTipo || !veiculoNome || !veiculoAno || isNaN(quilometragem) 
        || !lastMaintenance || !email
    ){
        alert('Todos os campos são obrigatórios e a quilometragem deve ser válida.');
        return;
    }

    const maintenanceInterval = getMaintenanceInterval(veiculoTipo, quilometragem);
    maintenanceDates = calculateMaintenanceDates(lastMaintenance, maintenanceInterval);
    displayCalendario(maintenanceDates, veiculoTipo, quilometragem);

    document.getElementById('calendario').style.display = 'block';

    //Limpar os campos do formulário
    document.querySelectorAll('#veiculoForm input, #veiculoForm select').forEach(input => {
        input.value = "";
    });
});

function getMaintenanceInterval(veiculoTipo, quilometragem){
    if (veiculoTipo === 'carro'){
        if (quilometragem <= 5000){
            return 60;
        }else if (quilometragem <= 10000){
            return 30;
        }else {
            return 15;
        }
    }else if (veiculoTipo === 'moto'){
        if (quilometragem <= 5000){
            return 30;
        }else if (quilometragem <= 10000){
            return 15;
        }else {
            return 7;
        }
    }else {
        return 30;
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
    if (quilometragem <= 5000){
        return ['Verificação de óleo', 'Revisão de freios'];
    }else if (quilometragem <= 10000){
        return ['Verificação da bateria', 'Limpeza do interior'];
    }else {
        return ['Manutenção da pintura e cromados', 'Verificação de suspensão e direção'];
    }
}

function getMotoMaintenance(quilometragem){
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

    const currentMonthDates = maintenanceDates.filter(date => date.getMonth() === currentMonth
        && date.getFullYear() === currentYear
    );

    document.getElementById('calendarHeader').innerHTML = `<span id="prevMonth">&#9664;</span> 
    ${new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric'}).format(new Date(currentYear, currentMonth))}
    <span id="nextMonth">&#9654;</span>`;

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date( currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const firstDayOfTheWeek = firstDayOfMonth.getDay();

    let row = document.createElement('tr');
    for (let j = 0; j < firstDayOfTheWeek; j++){
        const emptyCell = document.createElement('td');
        row.appendChild(emptyCell);
    }

    let day = 1;
    for (let i = firstDayOfTheWeek; day <= daysInMonth; i++){
        if (i % 7 === 0){
            row = document.createElement('tr');
            calendarioBody.appendChild(row);
        }
        
        const cell = document.createElement('td');
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;

        if (day == today && currentMonth == now.getMonth() && currentYear == now.getFullYear()){
            dayNumber.style.color = 'red';
            dayNumber.style.fontWeight = 'bold';
        } else if (day < today && currentMonth === now.getMonth() && currentYear === now.getFullYear()){
            dayNumber.style.color = 'gray';
        }

        cell.appendChild(dayNumber);

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

    calendarioBody.appendChild(row);
}

document.addEventListener('click', function(event){
    if (event.target.id === 'prevMonth'){
        currentMonth--;
        if (currentMonth < 0){
            currentMonth = 11;
            currentYear--;
        }
        displayCalendario(maintenanceDates, veiculoTipo, quilometragem);
    }else if (event.target.id === 'nextMonth'){
        currentMonth++;
        if (currentMonth > 11){
            currentMonth = 0;
            currentYear++;
        }
        displayCalendario(maintenanceDates, veiculoTipo, quilometragem);
    }
});
