var map, service, infoWindow;
var markers = []; // Para armazenar os marcadores e limpar depois

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -27.242339, lng: -50.218856}, // Localização padrão em SC
        zoom: 12
    });

    infoWindow = new google.maps.InfoWindow;
    service = new google.maps.places.PlacesService(map);
    

    // Tenta obter a localização do usuário
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            //Adiciona o marcardor de locaização atual
            var marker = new google.maps.Marker({
                position: pos,  
                map: map,
                icon: {
                    url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                }
            });

            //Exibir serviços próximos
            map.setCenter(pos);
            showNearbyServices(pos);
 
            //Exibir infoWindow ao clicar no marcador
            google.maps.event.addListener(marker, 'click', function(){
                infoWindow.setContent('Você está aqui!');
                infoWindow.open(map, marker);
            });

        })
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Erro: O serviço de geocalização falhou.' :
        'Erro: Seu navegador não suporta geolocalização.'
    );
    infoWindow.open(map);
}

// Função para exibir os serviços próximos ao usuário
function showNearbyServices(position) {
    var request = {
        location: position,
        radius: '5000', // Raio de 5 km
        type: ['hospital', 'gas_station'] // Exemplo de serviços (hospital e posto de gasolina)
    };

    service.nearbySearch(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            // Limpar marcadores antigos
            clearMarkers();

            results.forEach(function(place) {
                var marker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location
                });

                google.maps.event.addListener(marker, 'click', function() {
                    infoWindow.setContent(place.name);
                    infoWindow.open(map, marker);
                     // Redireciona para o Google Maps com o lugar
                     window.location.href = `https://www.google.com/maps/search/?api=1&query=${place.name}`;
                });

                markers.push(marker); // Adiciona o marcador na lista
            });
        }
    });
}

// Função para limpar os marcadores
function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

// Função de pesquisa personalizada (chamada quando o usuário digita na barra de pesquisa)
function searchNearby() {
    var query = document.getElementById('caixaPesquisa').value;
    
    if (query.length < 3) { // Só faz a busca se o usuário digitar pelo menos 3 caracteres
        return;
    }

    var request = {
        location: map.getCenter(), // Localização central do mapa
        radius: '5000', // Raio de 5 km
        query: query // O que o usuário digitou na pesquisa
    };

    service.textSearch(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            // Limpar marcadores antigos
            clearMarkers();

            results.forEach(function(place) {
                var marker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location
                });

                google.maps.event.addListener(marker, 'click', function() {
                    infoWindow.setContent(place.name);
                    infoWindow.open(map, marker);
                });

                markers.push(marker); // Adiciona o marcador na lista
            });
        }
    });
    
}