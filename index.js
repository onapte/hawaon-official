// Js package to decoder METAR code
let metarParser = require("metar-parser");

document.addEventListener("DOMContentLoaded", function () {
  // All pages
  let homePage = document.querySelector("#home-page");
  let tableViewPage = document.querySelector("#metar-table");
  let mapViewPage = document.querySelector("#map-page");
  let satellitePage = document.querySelector("#satellite-page");
  let radarPage = document.querySelector("#radar-page");
  let docsPage = document.querySelector("#docs-page");

  let metarBriefView = document.querySelector("#metar-brief-view");

  // All page links
  let homeLink = document.querySelector("#home-link");
  let tableViewLink = document.querySelector("#table-view-link");
  let mapViewLink = document.querySelector("#map-view-link");
  let satelliteLink = document.querySelector("#satellite-link");
  let radarLink = document.querySelector("#radar-link");
  let docsLink = document.querySelector("#docs-link");
  let refreshLink = document.querySelector('#refresh-link');

  // Links in home page
  let homeLink1 = document.querySelector("#link-to-docs");
  let homeLink2 = document.querySelector("#link-to-table-view");
  let homeLink3 = document.querySelector("#link-to-map-view");
  let homeLink4 = document.querySelector("#link-to-contact");

  // Links in table view page
  //let airportLinks = document.querySelectorAll('.airports');

  // METAR data in the form of HTML table
  let actualData = document.querySelector("#actual-data");

  // Hide all pages except home page
  tableViewPage.style.display = "none";
  mapViewPage.style.display = "none";
  satellitePage.style.display = "none";
  radarPage.style.display = "none";
  tableViewPage.style.display = "none";
  docsPage.style.display = "none";

  metarBriefView.style.display = "none";

  refreshLink.addEventListener('click', function() {
    window.location.reload();
  })

  // Display home page
  homeLink.addEventListener("click", function (e) {
    e.preventDefault();
    //deleteTable();
    hidePagesExcept(homePage);
    makeActiveLink(homeLink);
    metarBriefView.style.display = "block";
  });

  // Display table-view page
  [homeLink2, tableViewLink].forEach((link) => {
    link.addEventListener("click", function () {
      hidePagesExcept(tableViewPage);
      makeActiveLink(tableViewLink);
      activateAirportLinks();
      metarBriefView.style.display = 'block';
      showDetailedView();
      //getMetarData();
    });
  });

  // Display map-view page
  [homeLink3, mapViewLink].forEach((link) => {
    link.addEventListener("click", function () {
      hidePagesExcept(mapViewPage);
      makeActiveLink(mapViewLink);
      getMap();
    });
  });

  // Display satellite page
  satelliteLink.addEventListener("click", function (e) {
    e.preventDefault();
    hidePagesExcept(satellitePage);
    makeActiveLink(satelliteLink);
  });

  // Display radar page
  radarLink.addEventListener("click", function (e) {
    e.preventDefault();
    hidePagesExcept(radarPage);
    makeActiveLink(radarLink);

    let radarImageDivs = document.querySelectorAll(".radar-image-div");
    radarImageDivs.forEach((radarImageDiv) => {
      radarImageDiv.style.display = "none";
    });

    let radarButtons = document.querySelectorAll(".radar-button");
    radarButtons.forEach((radarButton) => {
      radarButton.onclick = function () {
        let station = radarButton.innerText;
        let radarImageDivs = document.querySelectorAll(".radar-image-div");
        radarImageDivs.forEach((radarImageDiv) => {
          radarImageDiv.style.display = "none";
        });
        document.getElementById(`${station}`).style.display = "block";
      };
    });
  });

  // Display docs page
  [homeLink1, docsLink].forEach((link) => {
    link.addEventListener("click", function () {
      hidePagesExcept(docsPage);
      makeActiveLink(docsLink);
      getMarkdown(docsPage);
    });
  });

  // Do not display actual HTML data for table containing METAR codes
  actualData.style.display = "none";
  getMetarData();
  //showTable();
});

function showDetailedView() {
  let detailedButton = document.querySelector('#detailed-button');
  let detailedParentDiv = document.querySelector('#in-brief');
  let counter = 0;
  detailedButton.onclick = function() {
    counter++;
    if (counter == 1) {

      for (let i = 0; i < decodedData.length; i++) {
        let detailedDiv = document.createElement('div');
        detailedDiv.className = "detailed";
        detailedDiv.innerHTML = `<h1>${decodedData[i][1]}</h1>`;
        detailedDiv.innerHTML += `<p><b>Code </b>: ${decodedData[i][2].station}</p>`;
        if (decodedData[i][2].altimeter) {
          detailedDiv.innerHTML += `<p><b>Altimeter</b>: ${decodedData[i][2].altimeter.inches} inches </p>`;
        }
  
        if (decodedData[i][2].clouds.length > 0) {
          detailedDiv.innerHTML += `<p><b>Clouds</b>: <br>`
          for (let j = 0; j < decodedData[i][2].clouds.length; j++) {
            detailedDiv.innerHTML += `${decodedData[i][2].clouds[j].meaning} at ${decodedData[i][2].clouds[j].altitude}m altitude <br>`;
          }
          detailedDiv.innerHTML += `</p>`;
        }
  
        if (decodedData[i][2].dewpoint) {
          detailedDiv.innerHTML += `<p><b>Dewpoint</b>: ${decodedData[i][2].dewpoint.celsius} °C / ${decodedData[i][2].dewpoint.fahrenheit} F </p>`;
        }
  
        if (decodedData[i][2].temperature) {
          detailedDiv.innerHTML += `<p><b>Temperature</b>: ${decodedData[i][2].temperature.celsius} °C / ${decodedData[i][2].temperature.fahrenheit} F </p>`;
        }
  
        if (decodedData[i][2].time) {
          detailedDiv.innerHTML += `<p><b>Time</b>: ${decodedData[i][2].time.date}</p>`;
        }
  
        if (decodedData[i][2].visibility) {
          detailedDiv.innerHTML += `<p><b>Visibility</b>: ${decodedData[i][2].visibility.feet} ft / ${decodedData[i][2].visibility.kilometers} km / ${decodedData[i][2].visibility.meters} m </p>`;
        }
  
        if (decodedData[i][2].wind) {
          detailedDiv.innerHTML += `<p><b>Wind</b>: Direction = ${decodedData[i][2].wind.direction}, Speed (Kt) = ${decodedData[i][2].wind.speedKt}</p>`;
        }
  
        if (decodedData[i][2].weather.length > 0) {
          detailedDiv.innerHTML += `<p><b>Weather</b>: <br>`
          for (let j = 0; j < decodedData[i][2].weather.length; j++) {
            detailedDiv.innerHTML += `${decodedData[i][2].weather[j].intensity} with ${decodedData[i][2].weather[j].obscuration} <br>`;
          }
          detailedDiv.innerHTML += '</p>';
        }
  
        detailedParentDiv.append(detailedDiv);
        
      }
    }
  }
}

// Fetch markdown file(s) and render to docs page
function getMarkdown(docsPage) {
  fetch(
    "https://young-waters-99383.herokuapp.com/https://github.com/onapte/test/blob/main/content/docs.md"
  )
    .then((response) => response.blob())
    .then((blob) => blob.text())
    .then((markdown) => {
      let pos = markdown.indexOf("Welcome to");
      docsPage.innerHTML = markdown.substring(pos);
      docsPage.innerHTML = document.querySelector("#readme").innerHTML;
    });
}

// Store Latitude and Longitude of a city along with their color key
let LatLongStore = [
  { latitude: 23.8315, longitude: 91.2868, title: "Agartala", color: "green" },
  { latitude: 23.0225, longitude: 72.5714, title: "Ahmedabad", color: "green" },
  { latitude: 25.4358, longitude: 81.8463, title: "Allahabad", color: "green" },
  { latitude: 31.634, longitude: 74.8723, title: "Amritsar", color: "green" },
  { latitude: 12.9716, longitude: 77.5946, title: "Bangalore", color: "green" },
  { latitude: 22.3072, longitude: 73.1812, title: "Baroda", color: "green" },
  { latitude: 23.2599, longitude: 77.4126, title: "Bhopal", color: "green" },
  { latitude: 20.2961, longitude: 85.81, title: "Bhubaneswar", color: "green" },
  { latitude: 13.0827, longitude: 80.2707, title: "Chennai", color: "green" },
  { latitude: 11.0168, longitude: 76.9558, title: "Coimbatore", color: "green",},
  { latitude: 6.9271, longitude: 79.8612, title: "Colombo", color: "green" },
  { latitude: 28.7041, longitude: 77.1025, title: "Delhi", color: "green" },
  { latitude: 30.3165, longitude: 78.0322, title: "Dehradun", color: "green" },
  { latitude: 26.1445, longitude: 91.7362, title: "Gauhati", color: "green" },
  { latitude: 24.7914, longitude: 85.0002, title: "Gaya", color: "green" },
  { latitude: 15.2993, longitude: 74.124, title: "Goa", color: "green" },
  { latitude: 17.385, longitude: 78.4867, title: "Hyderabad", color: "green" },
  { latitude: 22.7196, longitude: 75.8577, title: "Indore", color: "green" },
  { latitude: 23.1815, longitude: 79.9864, title: "Jabalpur", color: "green" },
  { latitude: 26.9124, longitude: 75.7873, title: "Jaipur", color: "green" },
  { latitude: 9.9312, longitude: 76.2673, title: "Kochi", color: "green" },
  { latitude: 22.5726, longitude: 88.3639, title: "Kolkata", color: "green" },
  { latitude: 11.2588, longitude: 75.7804, title: "Kozhikode ", color: "green" },
  { latitude: 26.8467, longitude: 80.9462, title: "Lucknow", color: "green" },
  { latitude: 9.9252, longitude: 78.1198, title: "Madurai ", color: "green" },
  { latitude: 27.4728, longitude: 94.9120, title: "Mohanbari", color: "green" },
  { latitude: 19.0760, longitude: 72.8777, title: "Mumbai", color: "green" },
  { latitude: 21.1458, longitude: 79.0882, title: "Nagpur", color: "green" },
  { latitude: 20.0997, longitude: 73.9285, title: "Ozar", color: "green" },
  { latitude: 25.5941, longitude: 85.1376, title: "Patna", color: "green" },
  { latitude: 32.2733, longitude: 75.6522, title: "Pathankot ", color: "green" },
  { latitude: 21.2514, longitude: 81.6296, title: "Raipur", color: "green" },
  { latitude: 28.5647, longitude: 77.1949, title: "Safdarjung", color: "green" },
  { latitude: 31.1048, longitude: 77.1734, title: "Shimla", color: "green" },
  { latitude: 21.1702, longitude: 72.8311, title: "Surat", color: "green" },
  { latitude: 23.3441, longitude: 85.3096, title: "Ranchi", color: "green" },
  { latitude: 10.7905, longitude: 78.7047, title: "Trichy", color: "green" },
  { latitude: 8.5241, longitude: 76.9366, title: "Trivandrum", color: "green" },
  { latitude: 24.5854, longitude: 73.7125, title: "Udaipur", color: "green" },
  { latitude: 25.3176, longitude: 82.9739, title: "Varanasi", color: "green" },
  { latitude: 17.6868, longitude: 83.2185, title: "Vizag", color: "green" },
  { latitude: 4.1755, longitude: 73.5093, title: "Male", color: "green" },
  { latitude: 0.6960, longitude: 73.1556, title: "Gan", color: "green" },
  { latitude: 27.7172, longitude: 85.3240, title: "Kathmandu", color: "green" },
  { latitude: 23.8103, longitude: 90.4125, title: "Dhaka", color: "green" },
  { latitude: 31.5204, longitude: 74.3587, title: "Lahore", color: "green" },
  { latitude: 34.1526, longitude: 77.5771, title: "Leh", color: "green" },
  { latitude: 34.0837, longitude: 74.7973, title: "Sri Nagar", color: "green" },
  { latitude: 32.7266, longitude: 74.8570, title: "Jammu", color: "green" },
  { latitude: 26.2389, longitude: 73.0243, title: "Jodhpur", color: "green" },
  { latitude: 26.9157, longitude: 70.9083, title: "Jaisalmer", color: "green" },
  { latitude: 23.2859, longitude: 69.6688, title: "Bhuj-Rudra", color: "green" },
  { latitude: 26.7606, longitude: 83.3732, title: "Gorakhpur", color: "green" },
  { latitude: 27.1767, longitude: 78.0081, title: "Agra", color: "green" },
  { latitude: 26.6986, longitude: 88.3117, title: "Bagdogra", color: "green" },
  { latitude: 26.2124, longitude: 78.1772, title: "Gwalior", color: "green" },
  { latitude: 18.5204, longitude: 73.8567, title: "Pune", color: "green" },
  { latitude: 30.7333, longitude: 76.7794, title: "Chandigarh", color: "green" },
  { latitude: 22.4707, longitude: 70.0577, title: "Jamnagar", color: "green" },
];

// Delete table in table view page
function deleteTable() {
  let tableParentDiv = document.querySelector("#metar-table");
  let tableDivs = document.querySelectorAll(".metar-table-entry");
  tableDivs.forEach(tableDiv => {
    tableDiv.remove();
  })
  // tableDivs.forEach((tableDiv) => {
  //   tableParentDiv.removeChild(tableDiv);
  // });
}

// Hide all pages except the page passed as parameter
function hidePagesExcept(thisPage) {
  let pages = document.querySelectorAll(".page");
  pages.forEach((page) => {
    page.style.display = "none";
  });
  thisPage.style.display = "block";
}

// Deactivate all the links except for the one passed as parameter
function makeActiveLink(navbarLink) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.style.color = "grey";
  });
  navbarLink.style.color = "ghostwhite";
}

/* Store Metar data for each city */
let cleanData = [];

/* Add intermediate entries to cleanData */
let adder = [];

/* Decoded Metar for each city */
let decodedData = [];

// Get latest METAR codes
async function getMetarData() {
  const response = await fetch(
    "https://young-waters-99383.herokuapp.com/https://amssdelhi.gov.in/Palam4.php",
    {
      method: "GET",
      
    }
  )
    .then((response) => response.text())
    .then((data) => {
      document.querySelector("#actual-data").innerHTML = data;
      let tables = document.querySelectorAll("table");
      let counter = 0;

      tables.forEach((table) => {
        for (let row of table.rows) {
          for (let cell of row.cells) {
            if (counter == 1) {
              adder.push(cell.innerText);
            }
          }
          if (counter == 1) {
            cleanData.push(adder);
            adder = [];
          }
        }
        counter++;
      });
      showData();
      //storeLatLong();
    });
}

// Show Metar data in table view page
function showData() {
  let tList = [];
  for (let i = 1; i < cleanData.length; i++) {
    let data = cleanData[i];
    for (let j = 0; j < data.length; j++) {
      if (j == 2) {
        tList.push(metarParser(data[j]));
      } else {
        tList.push(data[j]);
      }
    }
    decodedData.push(tList);
    tList = [];
  }
  showTable();
}

// Construct a table in table view page and load the decoded data
function showTable() {
  let tableParentDiv = document.querySelector("#metar-table");

  for (let row = 0; row < decodedData.length; row++) {
    let tableDiv = document.createElement("div");
    let tableDivColor = "Springgreen";
    tableDiv.className = "metar-table-entry";
    let weather = document.createElement("div");
    let airport = document.createElement("div");
    airport.className = "airports";
    let temp = document.createElement("div");
    let vis = document.createElement("div");
    if (decodedData[row][2].weather.length > 0) {
      weather.innerText = decodedData[row][2].weather[0].obscuration;
    } else {
      weather.innerText = "No information available";
    }
    airport.innerText = decodedData[row][1];

    if (decodedData[row][2].temperature) {
      temp.innerText = decodedData[row][2].temperature.celsius;
    } else {
      temp.innerText = "No information available";
    }

    if (decodedData[row][2].visibility) {
      vis.innerText = decodedData[row][2].visibility.meters;
      if (parseInt(decodedData[row][2].visibility.meters) <= 1000) {
        tableDivColor = "rgb(240, 116, 116)";
      } else if (parseInt(decodedData[row][2].visibility.meters) <= 1500) {
        tableDivColor = "yellow";
      }
    } else {
      vis.innerText = "No information available";
    }
    tableDiv.append(airport);
    tableDiv.append(temp);
    tableDiv.append(vis);
    tableDiv.append(weather);
    tableParentDiv.appendChild(tableDiv);
    tableDiv.style.backgroundColor = tableDivColor;
  }
}

function activateAirportLinks() {
  let airports = document.querySelectorAll('.airports');
  airports.forEach(airport => {
    airport.addEventListener('click', function() {
      let metarBriefView = document.querySelector('#metar-brief-view');
      metarBriefView.style.display = "block";
    })
  })
}

// Display map in the map view page
function getMap() {
  let mapViewPage = document.querySelector("#map-page");
  var chart = am4core.create("chartdiv", am4maps.MapChart);
  chart.homeZoomLevel = 4;
  chart.homeGeoPoint = {
    latitude: 23,
    longitude: 83,
  };

  // Set map definition
  chart.geodata = am4geodata_worldIndiaLow;

  // Set projection
  chart.projection = new am4maps.projections.Miller();

  // Create map polygon series
  var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

  // Exclude Antartica
  polygonSeries.exclude = ["AQ"];

  // Make map load polygon (like country names) data from GeoJSON
  polygonSeries.useGeodata = true;

  // Configure series
  var polygonTemplate = polygonSeries.mapPolygons.template;
  polygonTemplate.tooltipText = "{name}";
  polygonTemplate.fill = am4core.color("#66a5b2");

  // Create hover state and set alternative fill color
  var hs = polygonTemplate.states.create("hover");
  hs.properties.fill = am4core.color("#6689b2");

  var imageSeries = chart.series.push(new am4maps.MapImageSeries());

  var imageSeriesTemplate = imageSeries.mapImages.template;
  var circle = imageSeriesTemplate.createChild(am4core.Circle);
  circle.radius = 6;

  circle.nonScaling = true;
  circle.tooltipText = "{title}";

  setMarkersColor();

  imageSeriesTemplate.propertyFields.latitude = "latitude";
  imageSeriesTemplate.propertyFields.longitude = "longitude";
  imageSeriesTemplate.propertyFields.fill = "color";

  imageSeries.data = LatLongStore;

  // Select India
  chart.events.on("ready", function (ev) {
    polygonSeries.getPolygonById("IN").isHover = true;
  });
}

// Set color property of the respective entry in the LatLongStore based on numerous factors
function setMarkersColor() {
  for (let i = 0; i < LatLongStore.length; i++) {
    let station = LatLongStore[i].title;
    for (let j = 0; j < decodedData.length; j++) {
      if (decodedData[j][1].includes(LatLongStore[i].title)) {
        if (decodedData[j][2].visibility) {
          if (parseInt(decodedData[j][2].visibility.meters) <= 1000) {
            LatLongStore[i].color = "red";
          } else if (parseInt(decodedData[j][2].visibility.meters) <= 1500) {
            LatLongStore[i].color = "yellow";
          }
        } else {
          LatLongStore[i].color = "blue";
        }
        break;
      }
    }
  }
}
