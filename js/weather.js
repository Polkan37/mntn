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

//Default city when the page load

let cityInput = "london";
cities.forEach((city) => {
  city.addEventListener("click", (e) => {
    cityInput = e.target.innerHTML;
    fetchWeatherData();
    weather.style.opacity = "0";
  });
});

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

      //   const validCodesForSmth = [1003, 1006, 1009, 1030, 1069, 1087, 1135, 1273, 1276, 1279, 1282]

      if (code === 1000) {
        weather.style.backgroundImage = `url(../img/weather/images/${timeOfDay}/clear.jpg)`;
        btn.style.background = "#e5ba92";
        if (timeOfDay == "nigth") {
          btn.style.background = "#181e27";
        }
      } else if (
        code == 1003 ||
        code == 1006 ||
        code == 1009 ||
        code == 1030 ||
        code == 1069 ||
        code == 1087 ||
        code == 1135 ||
        code == 1273 ||
        code == 1276 ||
        code == 1279 ||
        code == 1282
        // validCodesForSmth.find((elCode) => elCode === code)
      ) {
        weather.style.backgroundImage = `url(../img/weather/images/${timeOfDay}/cloudy.jpg)`;
        btn.style.background = "#fa6d1b";
        if (timeOfDay == "nigth") {
          btn.style.background = "#181e27";
          // and rain
        }
      } else if (
        code == 1063 ||
        code == 1069 ||
        code == 1072 ||
        code == 1150 ||
        code == 1153 ||
        code == 1180 ||
        code == 1183 ||
        code == 1186 ||
        code == 1189 ||
        code == 1192 ||
        code == 1195 ||
        code == 1204 ||
        code == 1207 ||
        code == 1240 ||
        code == 1243 ||
        code == 1246 ||
        code == 1249 ||
        code == 1252
      ) {
        weather.style.backgroundImage = `url(../img/weather/images/${timeOfDay}/rainy.jpg)`;
        btn.style.background = "#647d75";
        if (timeOfDay == "nigth") {
          btn.style.background = "#325c80";
          // and snow
        }
      } else {
        weather.style.backgroundImage = `url(../img/weather/images/${timeOfDay}/snowy.jpg)`;
        btn.style.background = "#4d72aa";
        if (timeOfDay == "nigth") {
          btn.style.background = "#1b1b1b";
        }
      }
      // showUpEvery
      weather.style.opacity = "1";
    })
    .catch((err) => {
      console.log("err", err);
      alert("City not found, please try again");
      weather.style.opacity = "1";
    });
}

fetchWeatherData();

async function getResponseByType(url, type = "text") {
  const res = await fetch(url);
  return res[type]?.();
}

getResponseByType("https://www.cloudflare.com/cdn-cgi/trace").then(
  async (data) => {
    const ipRegex = /ip=[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}/;
    const ip = data.match(ipRegex)[0].slice(3);
    console.log(ip);
    const city = await getCity(ip);
    console.log(city);
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
