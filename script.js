
const map = L.map('map').setView([51.505, -0.09], 13) //13 zoom

L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_background/{z}/{x}/{y}{r}.{ext}', {
    minZoom: 0,
    maxZoom: 20,
    attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: 'png'
}).addTo(map);

const getIconByMagnitude = (magnitude) => {
    if (magnitude > 0 && magnitude < 1) {
        return L.icon({
            iconUrl: 'assets/iconwhite.svg',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
        });
    } else if (magnitude >= 1 && magnitude < 2) {
        return L.icon({
            iconUrl: 'assets/icongreen.svg',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
        });
    } else if (magnitude >= 2 && magnitude < 3) {
        return L.icon({
            iconUrl: 'assets/iconmilitary.svg',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
        });
    } else if (magnitude >= 3 && magnitude < 4) {
        return L.icon({
            iconUrl: 'assets/iconyellow.svg',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
        });
    } else if (magnitude >= 4 && magnitude < 5) {
        return L.icon({
            iconUrl: 'assets/icongold.svg',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
        });
    } else if (magnitude >= 5 && magnitude < 6) {
        return L.icon({
            iconUrl: 'assets/iconmustard.svg',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
        });
    } else if (magnitude >= 6 && magnitude < 7) {
        return L.icon({
            iconUrl: 'assets/iconred.svg',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
        });
    } else {
        return L.icon({
            iconUrl: 'assets/iconpurple.svg',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
        });
    }
}

const fetchApi = async () => {
    try {
        const respuesta = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
        const data = await respuesta.json()
        const allInfo = data.features
        procesarCoordenadas(allInfo)
        return allInfo;
    } catch (error) {
        console.log(error);
    }
}
fetchApi()

const markers = [];
const coordenadas = [];

const procesarCoordenadas = (array) => {
    markers.forEach(marker => map.removeLayer(marker));
    markers.length = 0;
    coordenadas.length = 0;
    array.forEach((element, i) => {
        coordenadas.push(element.geometry.coordinates)
        const titulo = element.properties.title
        const fecha = new Date(element.properties.time)
        const ubicacion = element.properties.place
        const code = element.properties.code
        const magnitud = element.properties.mag
        const medida = element.properties.magType
        const marker = L.marker([coordenadas[i][1], coordenadas[i][0]], { icon: getIconByMagnitude(magnitud) }).addTo(map);
        marker.bindPopup(`<div><h2>${titulo}</h2><p>${fecha}</p><p>${ubicacion}</p>
        <p>${code}</p><p>${magnitud}${medida}</p></div>`).openPopup();
        markers.push(marker);
    });
}

const filterButton = document.querySelector('#filterButton')
const filterInput = document.querySelector('#filterInput')
const filterMinDate = document.querySelector('#minDate')
const filterMaxDate = document.querySelector('#maxDate')

filterButton.addEventListener('click', () => {
    const magnitud = parseInt(filterInput.value)
    filterMinDate.addEventListener('change', () => {
        const minDate = filterMinDate.value
        callDatesFetch(minDate)
    })
    filterMaxDate.addEventListener('change', () => {
        const maxDate = filterMaxDate.value
        callDatesFetch(maxDate)
    })
    if (isNaN(magnitud) || magnitud <= 0 || magnitud === '') {
        alert('Ingresa valor valido de magnitud')
    } else {
        callDatesFetch(magnitud)
    }
});

const callDatesFetch = async (magnitud, minDate, maxDate) => {
    try {
        let url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson`;
        if (minDate) url += `&starttime=${minDate}`;
        if (maxDate) url += `&endtime=${maxDate}`;
        if(magnitud) url += `&minmagnitude=${magnitud}`
        const respuesta = await fetch(url);
        const data = await respuesta.json();
        const allInfo = data.features;
        procesarCoordenadas(allInfo);
        return allInfo;
    } catch (error) {
        console.log(error);
    }
};


