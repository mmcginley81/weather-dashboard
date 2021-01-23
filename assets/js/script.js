/* Psuedo Code
1.) Add a search bar in HTML and add event listener on click to search weather API
2.) Prior to this add DOM elements to place where weather information will go
3.) Fetch code from weather API and have it display on main column
4.) Grab following items from fetch weather conditions, temperature, humidity, windspeed, UV index
5.) Assign icons to various data points UV index and 5 day forecast
6.) Keep previous searches in city search history

*/
// DOM Elements
$(document).ready(function(){
    
    // let showWeatherCard = document.querySelector("#search-button")
    // let city = document.querySelector("#search-bar").value
    
    // showWeatherCard.addEventListener(click).siblings("#search-bar").val

    $('#search-button').on('click', function(){
        console.log('click')
        const city = $('.search-bar').val()
        localStorage.setItem("searchName", city)
        searchWeather(city)
        userSearch(city)
    })
    function userSearch(city){
        let searchResult = localStorage.getItem("searchName", city)
        let pastSearch = $('<li>').addClass('list-group-item').text(searchResult)
        $('.list-group').append(pastSearch);

    }

    function searchWeather(city){
        $('#current-weather').empty()
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=f38f6a7de25e9c5bfba8b768dc8d3f45&units=imperial`)
        .then(response => response.json())
        .then(response => {
            
            const card = $('<div>').addClass('card');
            const cityName = $('<h3>').addClass('card-title').text(`${response.name}`)
            const date = $('<h3>').addClass('card-title').text(new Date().toLocaleDateString())
            const icon = $('<img>').attr('src', `http://openweathermap.org/img/w/${response.weather[0].icon}.png`);
            const temp = $('<p>').addClass('card-text').text(`temperature: ${response.main.temp} °F`)
            const humidity = $('<p>').addClass('card-text').text(`humidity: ${response.main.humidity} %`)
            const wind = $('<p>').addClass('card-text').text(`wind-speed: ${response.wind.speed} mph`)
            card.append(cityName, date, icon, temp, humidity, wind)
            const lat = response.coord.lat
            const lon = response.coord.lon

            $('#current-weather').append(card)
            getUV(lat, lon)
        })



    }
    function getUV(lat, lon){
        fetch(`https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=78a87d050ef61463bd5907ddceff6458`)
        .then(response => response.json())
        .then(response =>{
            console.log(response)
            const uvIndex = $('<p>').addClass('card-text').text(`UV Index: ${response.value}`)
                // if(uvIndex < 2){
                //     uvIndex.addClass('moderate') 
                // } else if(uvIndex < 8) { 
                //     uvIndex.addClass('severe')
                // }
                // console.log(uvIndex)
            $('#current-weather .card').append(uvIndex)
            
        })
    }

    
    



})

