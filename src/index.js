import '../node_modules/bootstrap'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './main.css'

let mapboxgl = require('../node_modules/mapbox-gl/dist/mapbox-gl.js')
const APIkey  = '0d7082d4-ec0c-4ed7-8cd7-375b3783dc35'
let countrySelect, stateSelect, citySelect

let appendData = (data) => {
    let weather = data.data.current.weather
    let pollution = data.data.current.pollution

    document.querySelector('.timestamp').innerText = weather.ts
    document.querySelector('.temperature').innerText = weather.tp
    document.querySelector('.humidity').innerText = weather.hu
    document.querySelector('.aqi').innerText = pollution.aqius
    
    switch (pollution.mainus){
        case 'p2':
            document.querySelector('.main-pollutant').innerText = 'pm2.5'
            break;
        case 'p1':
            document.querySelector('.main-pollutant').innerText = 'pm10'
            break;
        case 'o3':
            document.querySelector('.main-pollutant').innerText = 'Ozone'
            break;
        case 'n2':
            document.querySelector('.main-pollutant').innerText = 'Nitrogen dioxide'
            break;
        case 's2':
            document.querySelector('.main-pollutant').innerText = 'Sulfur dioxide'
            break;
        case 'co':
            document.querySelector('.main-pollutant').innerText = 'Carbon monoxide'
            break;
    }

    return data
}

let relocate = (data) => {
    map.flyTo({
        center: [
        data.data.location.coordinates[0],
        data.data.location.coordinates[1]
        ],
        zoom : 10
    });

    return data;
}

let getDataByCity = () => {
    let url = `https://api.airvisual.com/v2/city?city=${citySelect}&state=${stateSelect}&country=${countrySelect}&key=${APIkey}`

    fetch(url, { mode: 'cors'}).then((response) => response.json())
    .then((dataJSON) => {
        console.log(dataJSON);
        return dataJSON;
    }).then(appendData)
    .then(relocate)
};

mapboxgl.accessToken = 'pk.eyJ1Ijoiam9uLXkiLCJhIjoiY2syYzliN2doMGJwbzNtcWs3aW45ZjRzcSJ9.jIai_6O14Ms6DldmvtQgbw';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [-77.38, 39],
    zoom: 6
});

let onload = new Promise((resolve, reject) => {
    window.addEventListener('load', () => {
        console.log('page is fully loaded');
        resolve();
    });
});

onload.then(() => {
    let url = `https://api.airvisual.com/v2/countries?key=${APIkey}`;

    return fetch(url, {mode: 'cors'}).then((response) => response.json());
}).then((dataJSON) => {
    let countries = dataJSON.data;
    for(let i = 0; i < countries.length; i++){
        let country = document.createElement('option');
        let container = document.querySelector('.dropdown_countries');

        country.innerText = countries[i].country;
        country.value = countries[i].country;
        container.appendChild(country);
    }
})


let countries = document.querySelector('.dropdown_countries');

countries.addEventListener('input', (e) => {
    let country = e.target.value;
    countrySelect = country;

    let url = `https://api.airvisual.com/v2/states?country=${countrySelect}&key=${APIkey}`;
    fetch(url, {mode: 'cors'}).then((response) => response.json())
    .then((dataJSON) => {
        let states = dataJSON.data;
        let container = document.querySelector('.dropdown_states');
        let previous = document.querySelectorAll('.dropdown_states > option').length;
        
        for(let i = 1; i < previous; i++){
            container.remove(1);
        }
    
        for(let i = 0; i < states.length; i++){
            let state = document.createElement('option');
            
            state.innerText = states[i].state;
            state.value = states[i].state;
            container.appendChild(state);
        }
    })
})

let states = document.querySelector('.dropdown_states');

states.addEventListener('input', (e) => {
    let state = e.target.value;
    stateSelect = state;

    let url = `https://api.airvisual.com/v2/cities?state=${stateSelect}&country=${countrySelect}&key=${APIkey}`;
    fetch(url, {mode: 'cors'}).then((response) => response.json())
    .then((dataJSON) => {
        let cities = dataJSON.data;
        let container = document.querySelector('.dropdown_cities');
        let previous = document.querySelectorAll('.dropdown_cities > option').length;
        
        for(let i = 1; i < previous; i++){
            container.remove(1);
        }
    
        for(let i = 0; i < cities.length; i++){
            let city = document.createElement('option');
            
            city.innerText = cities[i].city;
            city.value = cities[i].city;
            container.appendChild(city);
        }
    })
})

let cities = document.querySelector('.dropdown_cities');

cities.addEventListener('input', (e) => {
    citySelect = e.target.value;
})

let btn = document.querySelector('.btn_city');

btn.addEventListener('click', () => {
    getDataByCity();
});






