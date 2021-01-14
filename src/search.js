var search

function get(url) {
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
  let cityList = get("city.list.json");
  let citySearchResults = [];
  cityList.then(data => {
    data.forEach((element, index) => {
      if(element.name.search(searchValue) >= 0){
        citySearchResults.push(`${element.name}, ${element.country}`);
      }
    });
    console.log(citySearchResults)
  });
}

search("Maka");