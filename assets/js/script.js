/* Psuedo Code
1.) Add a search bar in HTML and add event listener on click to search weather API
2.) Prior to this add DOM elements to place where weather information will go
3.) Fetch code from weather API and have it display on main column
4.) Grab following items from fetch weather conditions, temperature, humidity, windspeed, UV index
5.) Assign icons to various data points UV index and 5 day forecast
6.) Keep previous searches in city search history with local storage

*/
// DOM Elements
$(document).ready(function(){

    $('#search-button').on('click', function(){
        console.log('click')
        const city = $('.search-bar').val()
        localStorage.setItem("searchName", city)
        searchWeather(city)
        userSearch(city)
    })
    function userSearch(city){
        let searchResult = localStorage.getItem("searchName", city)
        let pastSearch = $('<li>').addClass('list-group-item').text(searchResult).attr("id","id"+city )
        $('.list-group').append(pastSearch);
        
        //add event listener for list items to call function searchWeather for past cities
        $(document).on('click', "#id"+city, function(event)
        {
            searchWeather(city)
        })
            

    }

    function searchWeather(city){
        $('#current-weather').empty()
        
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=f38f6a7de25e9c5bfba8b768dc8d3f45&units=imperial`)
        .then(response => response.json())
        .then(response => {
            //Check for correct city spelling and if correct run function
            if (response.message === "city not found"){
                alert("City not found, please check your spelling and try again.")
            }else{
                const card = $('<div>').addClass('card');
                const cityName = $('<h3>').addClass('card-title').text(`${response.name}`)
                const date = $('<h3>').addClass('card-title').text(new Date().toLocaleDateString())
                const icon = $('<img>').attr('src', `http://openweathermap.org/img/w/${response.weather[0].icon}.png`);
                const temp = $('<p>').addClass('card-text').text(`temperature: ${response.main.temp} °F`)
                const humidity = $('<p>').addClass('card-text').text(`humidity: ${response.main.humidity} %`)
                const wind = $('<p>').addClass('card-text').text(`wind-speed: ${response.wind.speed} mph`)
                card.append(cityName, date, icon, temp, humidity, wind)
                
                // keys for other functions
                const lat = response.coord.lat
                const lon = response.coord.lon
                const searchName = response.name

    
                $('#current-weather').append(card)
                getUV(lat, lon);
                getFutureForecast(searchName);
            }
            
        })



    }
    function getUV(lat, lon){
        fetch(`https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=78a87d050ef61463bd5907ddceff6458`)
        .then(response => response.json())
        .then(response =>{
            console.log(response.value)
            const uvIndex = $('<button>').addClass('btn').text(`UV Index: ${response.value}`)
                //check the UV index to classify a warning system.
                if(response.value > 3 && response.value < 8){
                    uvIndex.addClass('btn-warning') 
                } else if(response.value > 8) { 
                    uvIndex.addClass('btn btn-danger')
                }
                console.log(uvIndex)
            $('#current-weather .card').append(uvIndex)
            
        })
    }

    function getFutureForecast(searchName){
        $('#future-forecast').empty()
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchName}&units=imperial&appid=78a87d050ef61463bd5907ddceff6458`)
        .then(response => response.json())
        .then(response =>{
            
            //console.log(response)
            console.log(response.list[1])
            //let (response.list) = i
            const forecastHeading = $('<h2>').addClass("forecast-heading").text(`5 Day Forecast:`)
            for(let i = 0; i < response.list.length; i++){
                if (response.list[i].dt_txt.indexOf("15:00:00") != -1){
                    response => response.then(response => response.json())
                    console.log(response.list[i])
                    
                    //convert unix date to local string date
                    let dt_txtElement = new Date(response.list[i].dt *1000).toLocaleDateString();

                    const futureCard = $('<div>').addClass('card text-white bg-primary mb-3 future-card');
                    const futureDateName = $('<h5>').addClass('card-title').text(`Date: ${dt_txtElement}`);
                    const futureIcon = $('<img>').attr('src', `http://openweathermap.org/img/w/${response.list[i].weather[0].icon}.png`);
                    const futureTemp = $('<p>').addClass('card-text').text(`temperature: ${response.list[i].main.temp} °F`)
                    const futureHumidity = $('<p>').addClass('card-text').text(`humidity: ${response.list[i].main.humidity} %`)

                    //append to card
                    futureCard.append(futureDateName, futureIcon, futureTemp, futureHumidity)

                    //append to document
                    $('#future-forecast').prepend(forecastHeading)
                    $('#future-forecast').append(futureCard)

                }

            }
        })
    }
    



})

