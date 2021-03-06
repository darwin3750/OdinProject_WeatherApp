var weatherApp = (function(){
  let selectedCity, selectedCityCountry, selectedCityWeather, selectedCityWeatherDescription, selectedCityTemperature, selectedWeatherGIF;
  let citySearchResults = [];
  let tempUnitIsCelsius = true;

  //cache DOM
  let searchInput = document.querySelector("#search");
  let searchResults = document.querySelector("#searchResults");
  let currentLocation = document.querySelector("#location");
  let currentWeather = document.querySelector("#weather");
  let currentTemperature = document.querySelector("#temperature");
  let tempToggleButton = document.querySelector("#temperature-switch");
  let tempColorDisplays = document.querySelectorAll(".weatherapp-temp-gradient");
  let currentWeatherGIF = document.querySelector("#weatherGIF");
  let gifSpinner = document.querySelector("#gif-spinner");
  let searchSpinner = document.querySelector("#search-spinner");

  //bind events
  tempToggleButton.addEventListener('change', event => {
    tempUnitIsCelsius = !event.target.checked;
    renderCityDisplay()
    .then(
      tempColorDisplays.forEach(el => {
        el.style.backgroundImage = 
            `linear-gradient(to right, #f00a0a ${(selectedCityTemperature-20)*2}%, #b20000, #5d567c, #194bff, #0022c9)`;
        el.style.opacity = 1;
      })
    );
  })
  searchInput.addEventListener('keyup', (event) => {
    if (((event.keyCode >=65 && event.keyCode <= 90) // letters
        || (event.keyCode >=48 && event.keyCode <= 57)) // digits
        || event.keyCode == 8) { //backspace
      console.log(searchInput.value + " " + searchInput.value.length);
      fetchSearchResults(searchInput.value)
        .then(() => renderSearchResults());
   }
  })

  //functions
  function render(newCity){
    fetchCityData(newCity)
        .then(() => fetchGIF(selectedCityWeather))
        .then(() => renderCityDisplay())
        .then(() => renderWeatherGIF())
        .then(() => {
          anime.timeline({ loop: false })
          .add({
            targets: '.weatherapp-animate-slidescale',
            scaleX: [0,1],
            opacity: [0,1],
            easing: "easeOutQuad",
            offset: '+=600',
            duration: 800,
          })
        });
    fetchSearchResults(searchInput.value)
        .then(() => renderSearchResults());
  }

  function renderCityDisplay(){
    return new Promise((resolve, reject) => {
      currentLocation.textContent = `${selectedCity}, ${selectedCityCountry}`;
      currentWeather.textContent = `${selectedCityWeather} (${selectedCityWeatherDescription})`;
      currentTemperature.textContent = tempUnitIsCelsius ? 
          selectedCityTemperature+'\xB0C' : celsiustoFarenheit(selectedCityTemperature)+'\xB0F';
      tempColorDisplays.forEach(el => {
        el.style.backgroundImage = 
            `linear-gradient(to right, #f00a0a ${(selectedCityTemperature-20)*2}%, #b20000, #5d567c, #194bff, #0022c9)`;
        el.style.opacity = 0;
      });
      resolve("Render success!");
    });
  }

  function renderWeatherGIF(){
    return new Promise((resolve, reject) => {
      currentWeatherGIF.src = selectedWeatherGIF;
      gifSpinner.classList.replace("d-block", "d-none");
      resolve("Render success!");
    });
  }

  function renderSearchResults(){
    return new Promise((resolve, reject) => {
      while (searchResults.firstChild) {searchResults.removeChild(searchResults.lastChild);}
      citySearchResults.forEach(element => {
        let searchResult = document.createElement("li");
        searchResult.classList.add("p-2");
        searchResult.onclick = () => {render(element.substring(0, element.search(",")))};
        searchResult.textContent = element;
        searchResults.appendChild(searchResult);
        searchSpinner.classList.replace("d-block", "d-none");
        resolve("Render success!");
      });
    });
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
      searchSpinner.classList.replace("d-none", "d-block");
      searchResults.innerHTML = "";
      citySearchResults = []; //empty the array first before putting new search results in
      let cityList = getJSON("city.list.json");
      cityList.then(data => {
        try{
          data.forEach((element, index) => {
            if(element.name.toUpperCase().search(searchValue != null ? searchValue.toUpperCase() : searchValue) >= 0){
              citySearchResults.push(`${element.name}, ${element.country}`);
              if(citySearchResults.length > 10){throw "break"}
            }
          });
        }catch (e) {
          if (e !== "break") throw e;
        }
        resolve("Data fetched successfully.");
      })
      .catch(error => reject(error));
    });
  }
  
  function fetchCityData(city) {
    return new Promise(function (resolve, reject){
      city = city == null ? "Mandaluyong" : city;
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=029e7e2df9f48e38c3eac1b2c7ada7d5`, 
          { mode: 'cors' })
      .then(response => response.json())
      .then(data => {
        selectedCity = data.name;
        selectedCityCountry = data.sys.country;
        selectedCityWeather = data.weather[0].main;
        selectedCityWeatherDescription = data.weather[0].description;
        selectedCityTemperature = data.main.temp;
        resolve("Data fetched successfully.")
      })
      .catch(error => reject(error));
    });
  }

  function fetchGIF(searchword) {
    return new Promise(function (resolve, reject){
      gifSpinner.classList.replace("d-none", "d-block");
      currentWeatherGIF.src = "";
      fetch(`https://api.giphy.com/v1/gifs/translate?api_key=uAjM22jFEPRzJbiqeoRvh0cRE6aFVfic&s=${searchword}`, 
          { mode: 'cors' })
      .then(function(response) {
        return response.json();
      })
      .then(function(response) {
        selectedWeatherGIF = response.data.images.original.url;
        resolve("Data fetched successfully.");
      })
      .catch(error => reject(error));
    });
  }

  function celsiustoFarenheit(celsius) {
    return ((celsius * (9/5)) + 32).toPrecision(4);
  }

  render();
})();



