const key = "";

const getCity = async (city) => {
    const base = "http://dataservice.accuweather.com/locations/v1/cities/search";
    const query = `?apikey=${key}&q=${city}`;

    const response = await fetch(base + query);
    const data = await response.json();

    return data[0];
};

const getWeather = async (cityCode) => {
    const base = "http://dataservice.accuweather.com/currentconditions/v1/";
    const query = `${cityCode}?apikey=${key}`;

    const response = await fetch(base + query);
    const data = await response.json();

    return data[0];
};

const cityUpdate = async (city) => {
    const cityDetails = await getCity(city);
    const weather = await getWeather(cityDetails.Key);

    return {
        cityDetails: cityDetails,
        weather: weather
    };
};

const form = document.querySelector("form");
const cityName = document.querySelector(".cityName");
const weatherInfo = document.querySelector(".weatherInfo");
const weatherText = document.querySelector(".weatherText");
const span = document.querySelector("span");
const temperature = document.querySelector(".temperature");
const icon = document.querySelector(".icon img");

form.addEventListener("submit", e => {
    e.preventDefault();

    const value = form.city.value.trim();

    cityUpdate(value)
        .then(data => {

            console.log(data);
            if (data.weather.IsDayTime) {
                weatherInfo.style.backgroundImage = `url("img/day.svg")`;
                temperature.style.color = "#000";
                weatherText.style.color = "#000";
            } else {
                weatherInfo.style.backgroundImage = `url("img/night.svg")`;
                temperature.style.color = "#fff";
                weatherText.style.color = "#fff";
            }

            span.innerHTML = data.weather.Temperature.Metric.Value;
            weatherText.innerHTML = data.weather.WeatherText;
            cityName.innerHTML = value;
            icon.setAttribute("src", `img/icons/${data.weather.WeatherIcon}.svg`);

            form.reset();

        })
        .catch(err => console.error(err));


    // SET LOCAL STORAGE
    localStorage.setItem("city", value);
});

// LOCAL STORAGE
if (localStorage.getItem("city")) {
    cityUpdate(localStorage.getItem("city"))
        .then(data => {
            // 
            console.log(data);
            if (data.weather.IsDayTime) {
                weatherInfo.style.backgroundImage = `url("img/day.svg")`;
                temperature.style.color = "#000";
                weatherText.style.color = "#000";
            } else {
                weatherInfo.style.backgroundImage = `url("img/night.svg")`;
                temperature.style.color = "#fff";
                weatherText.style.color = "#fff";
            }

            span.innerHTML = data.weather.Temperature.Metric.Value;
            weatherText.innerHTML = data.weather.WeatherText;
            cityName.innerHTML = localStorage.getItem("city");
            icon.setAttribute("src", `img/icons/${data.weather.WeatherIcon}.svg`);

            form.reset();
            // 
        })
        .catch(err => console.error(err));
}