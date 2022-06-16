var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var userFormEl = document.querySelector("#user-form");
var searchBtn = $("button");
var city = "";
var displayedWeather = document.querySelector("#displayed-weather");
var pastCity = JSON.parse(localStorage.getItem("city")) || [];
var fiveDay = $("#displayed-five-day");

var getGeoLocation = function (event) {
    event.preventDefault();
    console.log(event);
    if (event.target.textContent === "Get City") {
        city = $(this).siblings("input").val();
        console.log(city);
        pastCity.push(city);
        localStorage.setItem("city", JSON.stringify(pastCity));
    } else {
        city = event.target.textContent;
    }
    var apiURl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=e715e0f339e72a095b8b42261bf31b23";

    fetch(apiURl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    getWeather(data[0].lat, data[0].lon);
                    displayCity();
                });
            } else {
                alert("Error: Try new location!");
            }
        })
        .catch(function (error) {
            alert("we are having issues connecting to the weather");
        })
}

var getWeather = function (lat, lon) {
    var apiURl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=6cb7afe611e6da766bf3f95291d49163&units=imperial";
    fetch(apiURl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    displayCurrent(data);
                    displayFiveDay(data);
                });
            } else {
                alert("Error: Try new location!");
            }
        })
        .catch(function (error) {
            alert("we are having issues connecting to the weather");
        })
}


var displayCurrent = function (data) {
    displayedWeather.innerHTML = "";
    var currentSection = document.createElement("div");
    currentSection.setAttribute("class", "card-body");

    var currentCity = document.createElement("h4");
    currentCity.setAttribute("class", "btn");
    currentCity.textContent = city;
    currentSection.appendChild(currentCity);

    var currentWeatherBox = document.createElement("div");
    currentWeatherBox.setAttribute("class", "card-header");
    currentWeatherBox.textContent = moment().format('MM/D/YYYY');

    var currentIcon = document.createElement("img");
    currentIcon.setAttribute("src", "https://openweathermap.org/img/w/"+ data.current.weather[0].icon + ".png");
    currentWeatherBox.appendChild(currentIcon);

    var currentTemp = document.createElement("div");
    currentTemp.textContent = "Temperature: " + data.current.temp;
    currentWeatherBox.appendChild(currentTemp);

    var currentHumidity = document.createElement("div");
    currentHumidity.textContent = "Humidity: " + data.current.humidity;
    currentWeatherBox.appendChild(currentHumidity);

    var currentWindSpeed = document.createElement("div");
    currentWindSpeed.textContent = "Wind Speed: " + data.current.wind_speed;
    currentWeatherBox.appendChild(currentWindSpeed);

    var currentUVI = document.createElement("div");
    currentUVI.textContent = "UV Index: " + data.current.uvi;
    currentWeatherBox.appendChild(currentUVI);

    currentSection.appendChild(currentWeatherBox);
    displayedWeather.appendChild(currentSection);
}

var displayCity = function () {
    repoContainerEl.innerHTML = "";
    var pastCity = JSON.parse(localStorage.getItem("city")) || [];
    pastCity.forEach(city => {
        var cityEL = document.createElement("div");
        cityEL.textContent = city;
        cityEL.setAttribute("class", "list-item");
        repoContainerEl.appendChild(cityEL);
    });
}

var displayFiveDay = function (data) {
    fiveDay.empty();
    for (var i = 1; i < 6; i++) {
        var currentSection = document.createElement("div");
        currentSection.setAttribute("class", "card-body");

        var currentWeatherBox = document.createElement("div");
        currentWeatherBox.setAttribute("class", "card-header");
        currentWeatherBox.textContent = moment().add([i] + 10,"hours").format("MM/DD/YYYY");

        var currentIcon = document.createElement("img");
        currentIcon.setAttribute("src", "https://openweathermap.org/img/w/"+ data.daily[i].weather[0].icon + ".png");
        currentWeatherBox.appendChild(currentIcon);

        var currentTemp = document.createElement("div");
        currentTemp.textContent = "Temperature: " + data.daily[i].temp.max;
        currentWeatherBox.appendChild(currentTemp);

        var currentHumidity = document.createElement("div");
        currentHumidity.textContent = "Humidity: " + data.daily[i].humidity;
        currentWeatherBox.appendChild(currentHumidity);

        var currentWindSpeed = document.createElement("div");
        currentWindSpeed.textContent = "Wind Speed: " + data.daily[i].wind_speed;
        currentWeatherBox.appendChild(currentWindSpeed);


        currentSection.appendChild(currentWeatherBox);
        fiveDay.append(currentSection);
    }
}

repoContainerEl.addEventListener("click", getGeoLocation);

searchBtn.on("click", getGeoLocation);

displayCity();