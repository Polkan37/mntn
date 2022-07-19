const weather = document.querySelector(".weather-app");
const body = document.querySelector("body");
const clouds = document.querySelector(".clouds");
const mountains = document.querySelector(".mountain");
const healWithMan = document.querySelector(".heal");
const temp = document.querySelector(".temp");
const dateOutput = document.querySelector(".date");
const timeOutput = document.querySelector(".time");
const conditionOutput = document.querySelector(".condition");
const nameOutput = document.querySelector(".name");
const icon = document.querySelector(".icon");
const headIcon = document.querySelector(".main-icon");
const cloudOutput = document.querySelector(".cloud");
const humidityOutput = document.querySelector(".humidity");
const windOutput = document.querySelector(".wind");
const form = document.getElementById("locationInput");
const search = document.querySelector(".location");
const btn = document.querySelector(".search");
const cities = document.querySelectorAll(".city");
const weatherApiCodes = {
  clear: [1000],
  cloudy: [1003, 1006, 1009, 1030, 1069, 1087, 1273, 1276, 1279, 1282],
  rainy: [
    1063, 1069, 1072, 1135, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195,
    1204, 1207, 1240, 1243, 1246, 1249, 1252,
  ],
  snowy: [
    1066, 1114, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258, 1279, 1282,
  ],
};

//Default city when the page load
async function getResponseByType(url, type = "text") {
  const res = await fetch(url);
  return res[type]?.();
}
let cityInput;
getResponseByType("https://www.cloudflare.com/cdn-cgi/trace").then(
  async (data) => {
    const ipRegex = /ip=[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}/;
    const ip = data.match(ipRegex)[0].slice(3);
    let city = await getCity(ip);
    if(!city) city = "london"; // city by default
    if (city == "Kyiv") city = "Kiev";
    cityInput = city;
    console.log('city', city)
    
    fetchWeatherData();
    body.style.opacity = "0";
  }
);

async function getCity(ip) {
  try {
    const data = await getResponseByType(
      `http://ip-api.com/json/${ip}`,
      "json"
    );
    const { city } = data;
    return city;
  } catch (error) {
    city = "Kyiv";
    return city;
  }
}

form.addEventListener("submit", (e) => {
  if (search.value.length == 0) {
    alert("Please type the city name");
  } else {
    cityInput = search.value;
    fetchWeatherData();
    search.value = "";
    body.style.opacity = "0";
  }

  e.preventDefault();
});

function dayOfTheWeek(day, month, year) {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return weekday[new Date(`${month}/${day}/${year}`).getDay()];
}

function weatherStyle(state, timeOfDay) {
  const clearSky = "no-repeat center top/100%  url(img/bg-00-sunny.jpeg)";
  const greySky = "none";
  const clearNightSky =
    "no-repeat center top/100% url(img/bg-00-night-clear.png)";
  const nightCloudySky =
    "no-repeat center top/100% url(img/bg-00-night-cloudy.png)";
  let backgroundWeather = {};
  switch (state) {
    case "clear":
      clouds.style.display = "none";
      timeOfDay == "day"
        ? (body.style.background = clearSky)
        : (body.style.background = clearNightSky);
      break;
    case "cloudy":
      clouds.style.display = "block";
      timeOfDay == "day"
        ? (body.style.background = clearSky)
        : (body.style.background = nightCloudySky);
      break;
    case "rainy":
      clouds.style.display = "block";
      timeOfDay == "day"
        ? (body.style.background = greySky)
        : (body.style.background = nightCloudySky);
      break;
    case "snowy":
      timeOfDay == "day"
        ? (body.style.background = clearSky)
        : (body.style.background = nightCloudySky);
      mountains.src = "img/bg-01-snowy.png";
      healWithMan.src = "img/bg-02-snow.png";
      break;
  }
}

async function fetchWeatherData() {
  await fetch(
    `https://api.weatherapi.com/v1/current.json?key=e955a0e530264aa6af6105653223006&q=${cityInput}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      temp.innerHTML = data.current.temp_c + "&#176;C";
      conditionOutput.innerHTML = data.current.condition.text;

      const date = data.location.localtime;
      const y = parseInt(date.substr(0, 4));
      const m = parseInt(date.substr(5, 2));
      const d = parseInt(date.substr(8, 2));
      const time = date.substr(11);

      dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}/${m}/   ${y}`;
      timeOutput.innerHTML = time;

      nameOutput.innerHTML = data.location.name;

      const iconId = data.current.condition.icon.substr(
        "//cdn.weatherapi.com/weather/64x64/".length
      );
      icon.src = "img/weather/icons/" + iconId;
      headIcon.href = "img/weather/icons/" + iconId;
      cloudOutput.innerHTML = data.current.cloud + "%";
      humidityOutput.innerHTML = data.current.humidity + "%";
      windOutput.innerHTML = data.current.wind_kph + "km/h";

      let timeOfDay = "day";
      const code = data.current.condition.code;

      if (!data.current.is_day) {
        timeOfDay = "night";
      }
      function findCode(array) {
        for (let el of array) {
          if (code == el) return true;
        }
      }

      for (let [group, value] of Object.entries(weatherApiCodes)) {
        if (findCode(value)) weatherStyle(group, timeOfDay);
      }
      body.style.opacity = "1";
    })
    .catch((err) => {
      console.log("err", err);
      alert("City not found, please try again");
      body.style.opacity = "1";
    });
}
