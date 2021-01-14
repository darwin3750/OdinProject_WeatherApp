var weatherApp = (function(){
  let selectedCity, selectedCityCountry, selectedCityWeather, selectedCityWeatherDescription, selectedCityTemperature;
  let citySearchResults = [];

  //cache DOM
  let searchInput = document.querySelector("#search");
  let searchResults = document.querySelector("#searchResults");
  let currentLocation = document.querySelector("#location");
  let currentWeather = document.querySelector("#weather");
  let currentTemperature = document.querySelector("#temperature");

  //bind events
  function setNewCity(newCity){
    fetchCityData(newCity)
        .then(() => renderCityDisplay());
  }

  //functions
  function render(){
    fetchCityData()
        .then(() => renderCityDisplay());
    fetchSearchResults("Maka")
        .then(() => renderSearchResults());
  }

  function renderCityDisplay(){
    currentLocation.textContent = `${selectedCity}, ${selectedCityCountry}`;
    currentWeather.textContent = selectedCityWeather;
    currentTemperature.textContent = selectedCityTemperature;
  }

  function renderSearchResults(){
    //console.log(citySearchResults);
    citySearchResults.forEach(element => {
      let searchResult = document.createElement("li");
      searchResult.classList.add("p-2");
      searchResult.onclick = () => {setNewCity(element.substring(0, element.search(",")))};
      searchResult.textContent = element;
      searchResults.appendChild(searchResult);
    });
  }

  function clearSearch(){
    citySearchResults = [];
    searchInput.textContent = "";
  }

  function getJSON(url) {
    return new Promise((resolve, reject) => {
      const xhttp = new XMLHttpRequest();
      xhttp.overrideMimeType("application/json");
      xhttp.open("GET", url, true);
      xhttp.onload = () => {
        if (xhttp.readyState == 4 && xhttp.status == "200") {
          resolve(JSON.parse(xhttp.response));
        } else {
          reject(xhttp.statusText);
        }
      };
      xhttp.onerror = () => {
        reject(xhttp.statusText);
      };
      xhttp.send();
    });
  }
  
  function fetchSearchResults(searchValue){
    return new Promise(function (resolve, reject){
      let cityList = getJSON("city.list.json");
      cityList.then(data => {
        data.forEach((element, index) => {
          if(element.name.search(searchValue) >= 0){
            citySearchResults.push(`${element.name}, ${element.country}`);
          }
        });
        resolve("Data fetched successfully.");
        //console.log(citySearchResults)
      })
      .catch(error => reject(error));
    });
  }
  
  function fetchCityData(city) {
    return new Promise(function (resolve, reject){
      city = city == null ? "Mandaluyong" : city;
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=029e7e2df9f48e38c3eac1b2c7ada7d5`, 
          { mode: 'cors' })
      .then(response => response.json())
      .then(data => {
        selectedCity = data.name;
        selectedCityCountry = data.sys.country;
        selectedCityWeather = `${data.weather[0].main} (${data.weather[0].description})`;
        selectedCityWeatherDescription = data.weather[0].description;
        selectedCityTemperature = data.main.temp;
        resolve("Data fetched successfully.")
      })
      .catch(error => reject(error));
    });
  }

  render();
})();



