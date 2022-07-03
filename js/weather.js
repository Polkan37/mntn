const weather = document.querySelector(".weather-app");
const temp = document.querySelector(".temp");
const dateOutput = document.querySelector(".date");
const timeOutput = document.querySelector(".time");
const conditionOutput = document.querySelector(".condition");
const nameOutput = document.querySelector(".name");
const icon = document.querySelector(".icon");
const cloudOutput = document.querySelector(".cloud");
const humidityOutput = document.querySelector(".humidity");
const windOutput = document.querySelector(".wind");
const form = document.getElementById("locationInput");
const search = document.querySelector(".search");
const btn = document.querySelector(".submit");
const cities = document.querySelectorAll(".city");
const weatherApiCodes = {
  clear: [1000],
  cloudy: [1003, 1006, 1009, 1030, 1069, 1087, 1135, 1273, 1276, 1279, 1282],
  rainy: [1063, 1069, 1072, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1204, 1207, 1240, 1243, 1246, 1249, 1252],
  snowy: [1066, 1114, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258, 1279, 1282]
} 


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
    console.log(ip);
    let city = await getCity(ip);
    if(city == "Kyiv") city = "Kiev";
    cityInput = city;
    fetchWeatherData();
    weather.style.opacity = "0";
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
    // doSmthForUserInstead()
  }
}

form.addEventListener("submit", (e) => {
  if (search.value.length == 0) {
    alert("Please type the city name");
  } else {
    cityInput = search.value;
    fetchWeatherData();
    search.value = "";
    weather.style.opacity = "0";
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

function fetchWeatherData() {
  fetch(
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
      icon.src = "../img/weather/icons/" + iconId;
      cloudOutput.innerHTML = data.current.cloud + "%";
      humidityOutput.innerHTML = data.current.humidity + "%";
      windOutput.innerHTML = data.current.wind_kph + "km/h";

      let timeOfDay = "day";
      const code = data.current.condition.code;

      if (!data.current.is_day) {
        timeOfDay = "night";
      }

      for(let [group, value] of Object.entries(weatherApiCodes)) {
          if(code == value) {
            weather.style.backgroundImage = `url(../img/weather/images/${timeOfDay}/${group}.jpg)`;
          }
      }
      weather.style.opacity = "1";
    })
    .catch((err) => {
      console.log("err", err);
      alert("City not found, please try again");
      weather.style.opacity = "1";
    });
}



/*
btn.addEventListener('click', (event) =>{
    getUser(1, (err, user) => {
        fetch(http://srany/${user.ip}, (err, data) => {
            data.city
        })
     }

})
*/

/*
const eventPromise = btn.addEventListener('click)
const userPromise = click.then((event) => getUser(1, event))
userPromise.then(() => fetch(http://srany/${user.ip}, (err, data) => {
             city = data.city
        }))
*/

/* async function getCity() {
    console.log('1')
    const event = await btn.addEventListener('click)
    console.log('2')
    const user = await getUser(1, event)
    console.log('3')
    const city = await fetch(http://srany/${user.ip})
    console.log('4')
    return city
}

await getCity()
*/
