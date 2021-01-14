var weatherApp = (function(){
  //cache DOM

  //bind events

  function render(){
    
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
  
  function search(searchValue){
    let cityList = getJSON("city.list.json");
    let citySearchResults = [];
    cityList.then(data => {
      data.forEach((element, index) => {
        if(element.name.search(searchValue) >= 0){
          citySearchResults.push(`${element.name}, ${element.country}`);
        }
      });
      //
      console.log(citySearchResults)
    });
  }

  function fetchCity(city){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=029e7e2df9f48e38c3eac1b2c7ada7d5`, { mode: 'cors' })
    .then(response => response.json())
    .then(data => {
      //document.querySelector("body").append(data.weather[0].main);
      //console.log(data.weather[0].main);
    })
    .catch(error => console.log(error));
  }
})();

