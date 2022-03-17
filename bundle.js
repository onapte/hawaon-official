(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// Js package to decoder METAR code
let metarParser = require("metar-parser");
let controller = new AbortController();
let signal = controller.signal;

document.addEventListener("DOMContentLoaded", function () {

  window.addEventListener('beforeunload', function(e) {
  })

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

  makeActiveLink(homeLink);

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

  let site = 'amssdelhi.gov.in/Palam4.php';
  if (window.location.href.includes(site)) {
    window.location.href = 'https://hawa-on.netlify.app/';
  }
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
          detailedDiv.innerHTML += `<p><b>Pressure</b>: ${decodedData[i][2].altimeter.inches} inches / ${decodedData[i][2].altimeter.millibars} hPa </p>`;
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
            detailedDiv.innerHTML += `Intensity = ${decodedData[i][2].weather[j].intensity}`;
            if (decodedData[i][2].weather[j].obscuration) {
              detailedDiv.innerHTML += `, Obscuration = ${decodedData[i][2].weather[j].obscuration}`;
            }
            else {
              detailedDiv.innerHTML += `, Obscuration = none`;
            }

            if (decodedData[i][2].weather[j].precipitation) {
              detailedDiv.innerHTML += `; Precipitation expected`;
            }
            else {
              detailedDiv.innerHTML += `, Precipitation = none`;
            }
          }
          detailedDiv.innerHTML += '</p>';
        }

        if (decodedData[i][2].nosig) {
          detailedDiv.innerHTML += '<p>No significant change expected in the next 2 hours</p>';
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
  { latitude: 23.8315, longitude: 91.2868, title: "Agartala", color: "#299617" },
  { latitude: 23.0225, longitude: 72.5714, title: "Ahmedabad", color: "#299617" },
  { latitude: 25.4358, longitude: 81.8463, title: "Allahabad", color: "#299617" },
  { latitude: 31.634, longitude: 74.8723, title: "Amritsar", color: "#299617" },
  { latitude: 12.9716, longitude: 77.5946, title: "Bangalore", color: "#299617" },
  { latitude: 22.3072, longitude: 73.1812, title: "Baroda", color: "#299617" },
  { latitude: 23.2599, longitude: 77.4126, title: "Bhopal", color: "#299617" },
  { latitude: 20.2961, longitude: 85.81, title: "Bhubaneswar", color: "#299617" },
  { latitude: 13.0827, longitude: 80.2707, title: "Chennai", color: "#299617" },
  { latitude: 11.0168, longitude: 76.9558, title: "Coimbatore", color: "#299617",},
  { latitude: 6.9271, longitude: 79.8612, title: "Colombo", color: "#299617" },
  { latitude: 28.7041, longitude: 77.1025, title: "Delhi", color: "#299617" },
  { latitude: 30.3165, longitude: 78.0322, title: "Dehradun", color: "#299617" },
  { latitude: 26.1445, longitude: 91.7362, title: "Gauhati", color: "#299617" },
  { latitude: 24.7914, longitude: 85.0002, title: "Gaya", color: "#299617" },
  { latitude: 15.2993, longitude: 74.124, title: "Goa", color: "#299617" },
  { latitude: 17.385, longitude: 78.4867, title: "Hyderabad", color: "#299617" },
  { latitude: 22.7196, longitude: 75.8577, title: "Indore", color: "#299617" },
  { latitude: 23.1815, longitude: 79.9864, title: "Jabalpur", color: "#299617" },
  { latitude: 26.9124, longitude: 75.7873, title: "Jaipur", color: "#299617" },
  { latitude: 9.9312, longitude: 76.2673, title: "Kochi", color: "#299617" },
  { latitude: 22.5726, longitude: 88.3639, title: "Kolkata", color: "#299617" },
  { latitude: 11.2588, longitude: 75.7804, title: "Kozhikode ", color: "#299617" },
  { latitude: 26.8467, longitude: 80.9462, title: "Lucknow", color: "#299617" },
  { latitude: 9.9252, longitude: 78.1198, title: "Madurai ", color: "#299617" },
  { latitude: 27.4728, longitude: 94.9120, title: "Mohanbari", color: "#299617" },
  { latitude: 19.0760, longitude: 72.8777, title: "Mumbai", color: "#299617" },
  { latitude: 21.1458, longitude: 79.0882, title: "Nagpur", color: "#299617" },
  { latitude: 20.0997, longitude: 73.9285, title: "Ozar", color: "#299617" },
  { latitude: 25.5941, longitude: 85.1376, title: "Patna", color: "#299617" },
  { latitude: 32.2733, longitude: 75.6522, title: "Pathankot ", color: "#299617" },
  { latitude: 21.2514, longitude: 81.6296, title: "Raipur", color: "#299617" },
  { latitude: 28.5647, longitude: 77.1949, title: "Safdarjung", color: "#299617" },
  { latitude: 31.1048, longitude: 77.1734, title: "Shimla", color: "#299617" },
  { latitude: 21.1702, longitude: 72.8311, title: "Surat", color: "#299617" },
  { latitude: 23.3441, longitude: 85.3096, title: "Ranchi", color: "#299617" },
  { latitude: 10.7905, longitude: 78.7047, title: "Trichy", color: "#299617" },
  { latitude: 8.5241, longitude: 76.9366, title: "Trivandrum", color: "#299617" },
  { latitude: 24.5854, longitude: 73.7125, title: "Udaipur", color: "#299617" },
  { latitude: 25.3176, longitude: 82.9739, title: "Varanasi", color: "#299617" },
  { latitude: 17.6868, longitude: 83.2185, title: "Vizag", color: "#299617" },
  { latitude: 4.1755, longitude: 73.5093, title: "Male", color: "#299617" },
  { latitude: 0.6960, longitude: 73.1556, title: "Gan", color: "#299617" },
  { latitude: 27.7172, longitude: 85.3240, title: "Kathmandu", color: "#299617" },
  { latitude: 23.8103, longitude: 90.4125, title: "Dhaka", color: "#299617" },
  { latitude: 31.5204, longitude: 74.3587, title: "Lahore", color: "#299617" },
  { latitude: 34.1526, longitude: 77.5771, title: "Leh", color: "#299617" },
  { latitude: 34.0837, longitude: 74.7973, title: "Sri Nagar", color: "#299617" },
  { latitude: 32.7266, longitude: 74.8570, title: "Jammu", color: "#299617" },
  { latitude: 26.2389, longitude: 73.0243, title: "Jodhpur", color: "#299617" },
  { latitude: 26.9157, longitude: 70.9083, title: "Jaisalmer", color: "#299617" },
  { latitude: 23.2859, longitude: 69.6688, title: "Bhuj-Rudra", color: "#299617" },
  { latitude: 26.7606, longitude: 83.3732, title: "Gorakhpur", color: "#299617" },
  { latitude: 27.1767, longitude: 78.0081, title: "Agra", color: "#299617" },
  { latitude: 26.6986, longitude: 88.3117, title: "Bagdogra", color: "#299617" },
  { latitude: 26.2124, longitude: 78.1772, title: "Gwalior", color: "#299617" },
  { latitude: 18.5204, longitude: 73.8567, title: "Pune", color: "#299617" },
  { latitude: 30.7333, longitude: 76.7794, title: "Chandigarh", color: "#299617" },
  { latitude: 22.4707, longitude: 70.0577, title: "Jamnagar", color: "#299617" },
  { latitude: 26.2487, longitude: 81.3784, title: "Fursatganj", color: "#299617" },
  { latitude: 29.0222, longitude: 79.4908, title: "Pantnagar", color: "#299617" },

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
      signal: signal,
      headers: {
        'connection': 'close',
        'x-requested-with': 'GET'
      }
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

    controller.abort();
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
  return false;
}

// Construct a table in table view page and load the decoded data
function showTable() {
  let tableParentDiv = document.querySelector("#metar-table");

  for (let row = 0; row < decodedData.length; row++) {
    let tableDiv = document.createElement("div");
    let tableDivColor = "Springgreen";
    tableDiv.className = "metar-table-entry";
    let weather = document.createElement("div");
    let wind = document.createElement("div");
    let time = document.createElement("div");
    let airport = document.createElement("div");
    airport.className = "airports table-airport";
    let temp = document.createElement("div");
    let vis = document.createElement("div");
    temp.className = "table-temp";
    vis.className = "table-vis";
    wind.className = "table-wind";
    time.className = "table-time";
    if (decodedData[row][2].weather.length > 0) {
      weather.innerText = decodedData[row][2].weather[0].obscuration;
      if (decodedData[row][2].weather[0].precipitation) {
        weather.innerText += ` with precipitation`;
      }
    } else {
      weather.innerText = "No information available";
    }

    if (decodedData[row][2].time) {
      time.innerText = decodedData[row][2].time.date;
    }

    if (decodedData[row][2].wind.direction || decodedData[row][2].wind.speed) {
      wind.innerText = `Direction: ${decodedData[row][2].wind.direction}, Speed: ${decodedData[row][2].wind.speedKt} Kt`;
    }
    else {
      wind.innerText = "Latest info not available";
    }

    airport.innerText = decodedData[row][1];

    if (decodedData[row][2].temperature) {
      temp.innerText = decodedData[row][2].temperature.celsius;
    } else {
      temp.innerText = "Latest info not available";
    }

    if (decodedData[row][2].visibility) {
      vis.innerText = decodedData[row][2].visibility.meters;
      if (parseInt(decodedData[row][2].visibility.meters) <= 1000) {
        tableDivColor = "rgb(240, 116, 116)";
      } else if (parseInt(decodedData[row][2].visibility.meters) <= 1500) {
        tableDivColor = "yellow";
      }
    } else {
      vis.innerText = "Latest info not available";
      tableDivColor = 'rgb(0,206,209)';
    }
    tableDiv.append(airport);
    tableDiv.append(temp);
    tableDiv.append(vis);
    tableDiv.append(wind);
    tableDiv.append(time);
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


  // Chart legend
  //chart.legend = new am4charts.Legend();

  // Create map polygon series
  var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

  // Exclude Antartica
  polygonSeries.exclude = ["AQ"];

  // Make map load polygon (like country names) data from GeoJSON
  polygonSeries.useGeodata = true;
  polygonSeries.include = ['IN', 'PK', 'LK', 'NP', 'BD', 'MV'];

  chart.events.on("ready", function(ev) {
    chart.zoomToMapObject(polygonSeries.getPolygonById("IN"));
  });
  // Configure series
  var polygonTemplate = polygonSeries.mapPolygons.template;
  polygonTemplate.tooltipText = "{name}";
  polygonTemplate.fill = am4core.color('#FFD0B9');

  // Create hover state and set alternative fill color
  var hs = polygonTemplate.states.create("hover");
  hs.properties.fill = am4core.color("#FFD0B9");

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
          LatLongStore[i].color = "#2D5DA1";
        }
        break;
      }
    }
  }
}

},{"metar-parser":2}],2:[function(require,module,exports){
/**
 * Simple object check.
 * @param {any} item Subject
 * @returns {boolean} isObject
 */
function isObject(item) {
    return (item && typeof item === "object" && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 * @param {Object} target Object to merge in
 * @param {Object} sources Objects to merge
 * @returns {Object} Merged object
 */
function mergeDeep(target, ...sources) {
    if (!sources.length) {
        return target;
    }

    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) {
                    Object.assign(target, { [key]: {} });
                }
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}

/**
 * Parses METAR/SPECI format
 * @param {string} metar Metar report string
 * @returns {Object} Parsed Metar object
 */
module.exports = function parse(metar) {
    let result = {};

    [
        require("./parsers/type"),
        require("./parsers/auto"),
        require("./parsers/station"),
        require("./parsers/time"),
        require("./parsers/wind"),
        require("./parsers/correction"),
        require("./parsers/nosig"),
        require("./parsers/wind_variation"),
        require("./parsers/visibility"),
        require("./parsers/tempdew"),
        require("./parsers/altimeter"),
        require("./parsers/clouds"),
        require("./parsers/runway_visual_range"),
        require("./parsers/weather"),
        require("./parsers/cavok"),
        require("./parsers/windshear"),
        require("./parsers/vertical_visibility"),
        require("./parsers/recent_weather"),
        require("./parsers/remarks")
    ]
        .map(parser => parser.parse(metar.toUpperCase()))
        .forEach(data => {
            result = mergeDeep(result, data);
        });

    return result;
};

},{"./parsers/altimeter":4,"./parsers/auto":5,"./parsers/cavok":6,"./parsers/clouds":7,"./parsers/correction":8,"./parsers/nosig":9,"./parsers/recent_weather":10,"./parsers/remarks":11,"./parsers/runway_visual_range":12,"./parsers/station":13,"./parsers/tempdew":14,"./parsers/time":15,"./parsers/type":16,"./parsers/vertical_visibility":17,"./parsers/visibility":18,"./parsers/weather":19,"./parsers/wind":20,"./parsers/wind_variation":21,"./parsers/windshear":22}],3:[function(require,module,exports){
module.exports = class Parser {
    static parse() {
        throw new Error("Parser must have a parse function");
    }
};

},{}],4:[function(require,module,exports){
const Parser = require("../parser");

module.exports = class AltimeterParser extends Parser {
    static parse(metar) {
        const match = ` ${metar} `.match(/\s(Q|A)([0-9]{4})\s/);

        if (!match) {
            return {
                altimeter: null
            };
        }

        const type = match[1];
        const value = parseInt(match[2], 10);

        let inchesHg;
        let millibars;

        if (type === "A") {
            inchesHg = value / 100;
            millibars = Math.round(value / 100 * 33.8637526);
        } else if (type === "Q") {
            millibars = value;
            inchesHg = Math.round(value * 100 * 0.0295301) / 100;
        }

        return {
            altimeter: {
                inches: inchesHg,
                millibars
            }
        };
    }
};

},{"../parser":3}],5:[function(require,module,exports){
const Parser = require("../parser");

module.exports = class AutoParser extends Parser {
    static parse(metar) {
        const match = ` ${metar} `.match(/\sAUTO\s/);

        return {
            auto: !!match
        };
    }
};

},{"../parser":3}],6:[function(require,module,exports){
const Parser = require("../parser");

module.exports = class CavokParser extends Parser {
    static parse(metar) {
        const match = ` ${metar} `.match(/\sCAVOK\s/);

        return {
            cavok: !!match
        };
    }
};

},{"../parser":3}],7:[function(require,module,exports){
const Parser = require("../parser");
const { SKY_CONDITIONS } = require("../texts");

module.exports = class CloudsParser extends Parser {
    static parse(metar) {
        let part;
        const match = [];
        const regex = /(CLR|SKC|FEW|SCT|BKN|OVC|VV)([0-9/]{3})(CU|CB|TCU|CI|[/]{3})?/g;

        while (part = regex.exec(metar)) {
            match.push(part);
        }

        return {
            clouds: match.map(group => {
                return {
                    code: group[1],
                    meaning: SKY_CONDITIONS[group[1]],
                    altitude: parseInt(group[2], 10) * 100,
                    type: group[3] || null,
                    typeMeaning: group[3] ? SKY_CONDITIONS[group[3]] : null
                };
            })
        };
    }
};

},{"../parser":3,"../texts":23}],8:[function(require,module,exports){
const Parser = require("../parser");

module.exports = class CorrectionParser extends Parser {
    static parse(metar) {
        const match = ` ${metar} `.match(/\sCOR|CC([A-Z])\s/);

        return {
            correction: match ? match[1] : false
        };
    }
};

},{"../parser":3}],9:[function(require,module,exports){
const Parser = require("../parser");

module.exports = class NosigParser extends Parser {
    static parse(metar) {
        const match = ` ${metar} `.match("NOSIG=");

        return {
            nosig: !!match
        };
    }
};

},{"../parser":3}],10:[function(require,module,exports){
const Parser = require("../parser");
const { WEATHER } = require("../texts");

module.exports = class RecentWeatherParser extends Parser {
    static parse(metar) {
        const match = ` ${metar} `.match(/\sRE((?:[A-Z]{2})+)\s/);

        if (!match) {
            return {
                recentWeather: []
            };
        }

        return {
            recentWeather: match[1].match(/.{1,2}/g).map(group => {
                return {
                    code: group,
                    meaning: WEATHER[group] || null
                };
            })
        };
    }
};

},{"../parser":3,"../texts":23}],11:[function(require,module,exports){
const Parser = require("../parser");
const { convertKTtoMPS } = require("../utils");

module.exports = class RemarksParser extends Parser {
    static parse(metar) {
        let match = metar.match(/RMK\s(.+)$/);

        if (!match) {
            return {
                remarks: null
            };
        }

        const remarkStr = match[1];
        const remarks = {};

        // STATION TYPE
        if (remarkStr.includes("AO1")) {
            remarks.stationType = {
                description: "Type of automated station",
                remark: "AO1",
                value: "Station is not equipped with a rain/snow sensor"
            };
        } else if (remarkStr.includes("AO2")) {
            remarks.stationType = {
                description: "Type of automated station",
                remark: "AO2",
                value: "Station is equipped with a rain/snow sensor"
            };
        }

        // PEAK WIND
        if (match = remarkStr.match(/PK\sWND\s([0-9]{3})([0-9]{2})\/([0-9]{2})([0-9]{2})/)) {
            const date = new Date();

            date.setUTCHours(match[3]);
            date.setUTCMinutes(match[4]);

            remarks.peakWind = {
                description: "Peak wind",
                remark: match[0],
                value: {
                    direction: match[1],
                    speedKT: match[2],
                    speedMPS: convertKTtoMPS(match[2]),
                    date: date.toUTCString()
                }
            };
        }

        return {
            remarks
        };
    }
};

},{"../parser":3,"../utils":24}],12:[function(require,module,exports){
const Parser = require("../parser");
const { RWR_TREND } = require("../texts");

module.exports = class RVRParser extends Parser {

    /**
     * Parses Runway Visual Range
     * @param {string} metar Metar string
     * @returns {Object} Parsed object
     */
    static parse(metar) {
        let part;
        const match = [];
        const regex = /R([0-9]{2}[LRC]?)\/([MP])?([0-9]{4})(?:V([MP])?([0-9]{4}))?(FT)?\/?([UND]?)/g;

        while (part = regex.exec(metar)) {
            match.push(part);
        }

        return {
            runwayVisualRange: match.map(group => {
                const min = parseInt(group[3], 10);
                const minRange = RWR_TREND[group[2]] || "exact";

                return {
                    runway: group[1],
                    min,
                    minRange,
                    max: group[5] ? parseInt(group[5], 10) : min,
                    maxRange: group[5] ? RWR_TREND[group[4]] || "exact" : "exact",
                    trend: RWR_TREND[group[7]] || "not possible to determine"
                };
            })
        };
    }
};

},{"../parser":3,"../texts":23}],13:[function(require,module,exports){
const Parser = require("../parser");

module.exports = class StationParser extends Parser {
    static parse(metar) {
        const match = ` ${metar} `.match(/\s([A-Z]{4})\s/);

        return {
            station: match ? match[1] : "unknown"
        };
    }

    static toText(output) {
        return `Report location: ${output.station}`;
    }
};

},{"../parser":3}],14:[function(require,module,exports){
const Parser = require("../parser");

module.exports = class TempDewParser extends Parser {
    static parse(metar) {
        const match = ` ${metar} `.match(/\s(M?[0-9]{2}\/M?[0-9]{2})\s/);

        if (!match) {
            return {
                temperature: null,
                dewpoint: null
            };
        }

        const tempdew = match[1].split("/").map(value => {
            if (value.slice(0, 1) === "M") {
                return value.slice(1, 3) * -1;
            }
            return 1 * value;
        });

        return {
            temperature: {
                celsius: tempdew[0],
                fahrenheit: Math.round((tempdew[0] * 1.8 + 32) * 100) / 100
            },
            dewpoint: {
                celsius: tempdew[1],
                fahrenheit: Math.round((tempdew[1] * 1.8 + 32) * 100) / 100
            }
        };
    }
};

},{"../parser":3}],15:[function(require,module,exports){
const Parser = require("../parser");

module.exports = class TimeParser extends Parser {
    static parse(metar) {
        const match = ` ${metar} `.match(/\s([0-9]{2})([0-9]{2})([0-9]{2})Z\s/);

        if (!match) {
            return {
                time: null
            };
        }

        const day = parseInt(match[1], 10);
        const hour = parseInt(match[2], 10);
        const minute = parseInt(match[3], 10);

        const date = new Date();

        date.setUTCDate(day);
        date.setUTCHours(hour);
        date.setUTCMinutes(minute);

        return {
            time: {
                day,
                hour,
                minute,
                date: date.toUTCString()
            }
        };
    }
};

},{"../parser":3}],16:[function(require,module,exports){
const Parser = require("../parser");

module.exports = class TypeParser extends Parser {
    static parse(metar) {
        const match = ` ${metar} `.match(/\s(METAR|SPECI)\s/);

        return {
            type: match ? match[1] : "METAR"
        };
    }
};

},{"../parser":3}],17:[function(require,module,exports){
const Parser = require("../parser");

module.exports = class VerticalVisibilityParser extends Parser {
    static parse(metar) {
        const match = ` ${metar} `.match(/\sVV([0-9]{3})|(\/\/\/)\s/);

        if (!match) {
            return {
                verticalVisibility: null
            };
        }

        const units = match[1] ? parseInt(match[1], 10) : 0;
        const meters = units * 30;
        const feet = units * 100;

        return {
            verticalVisibility: {
                meters,
                feet
            }
        };
    }
};

},{"../parser":3}],18:[function(require,module,exports){
const Parser = require("../parser");
const { UNITS } = require("../texts");

module.exports = class VisibilityParser extends Parser {
    static parse(metar) {
        const match = ` ${metar} `.match(/\s([0-9]{4})\s|\s((?:[0-9]{1,2}\/)?[0-9]{1,2})(SM|KM)\s/);

        if (!match) {
            return {
                visibility: null
            };
        }

        const unit = UNITS[match[3]] || "meter";
        let distance;

        if (match[2] && match[2].includes("/")) {
            const parts = match[2].split("/").map(part => parseInt(part, 10));

            distance = parts[0] / parts[1];
        } else {
            distance = parseInt(match[1] || match[2], 10);
        }

        let distanceMeters;
        let distanceFeet;

        if (unit === "meter") {
            distanceMeters = distance;
            distanceFeet = Math.round(distance * 3.2808);
        } else if (unit === "kilometer") {
            distanceMeters = distance * 1000;
            distanceFeet = Math.round(distanceMeters * 3.2808);
        } else if (unit === "statute mile") {
            distanceFeet = distance * 5280;
            distanceMeters = Math.round(distanceFeet * 0.3048);
        }

        return {
            visibility: {
                meters: distanceMeters,
                feet: distanceFeet,
                miles: Math.round(distanceFeet / 5280 * 100) / 100,
                kilometers: Math.round(distanceMeters / 10) / 100
            }
        };
    }
};

},{"../parser":3,"../texts":23}],19:[function(require,module,exports){
const Parser = require("../parser");
const { WEATHER } = require("../texts");

module.exports = class WeatherParser extends Parser {
    static parse(metar) {
        const regex = /(-|\+|VC)?(MI|PR|BC|DR|BL|SH|TS|FZ)?(DZ|RA|SN|SG|IC|PE|GR|GS|UP)?(BR|FG|FU|VA|DU|SA|HZ|PY)?(PO|SQ|FC|SS)?/;
        const data = metar.split(" ")
            .filter(str => !!str)
            .map(word => word.match(regex))
            .filter(match => match !== null && match[0] !== "")
            .map(group => {
                return {
                    codes: [group[2], group[3], group[4]].filter(code => !!code),
                    intensity: group[1] ? WEATHER[group[1]] : "moderate",
                    descriptor: WEATHER[group[2]] || null,
                    precipitation: WEATHER[group[3]] || null,
                    obscuration: WEATHER[group[4]] || null
                };
            });

        return {
            weather: data
        };
    }
};

},{"../parser":3,"../texts":23}],20:[function(require,module,exports){
const Parser = require("../parser");
const { convertKTtoMPS, convertMPStoKT } = require("../utils");

module.exports = class WindParser extends Parser {
    static parse(metar) {
        const match = ` ${metar} `.match(/\s([0-9]{3}|VRB)([0-9]{2})(?:G([0-9]{2}))?(KT|MPS)\s/);

        if (!match) {
            return {
                wind: null
            };
        }

        const speed = parseInt(match[2], 10);
        let speedKt;
        let speedMps;

        if (match[4] === "KT") {
            speedKt = speed;
            speedMps = convertKTtoMPS(speed);
        } else {
            speedMps = speed;
            speedKt = convertMPStoKT(speed);
        }

        return {
            wind: {
                direction: match[1] === "VRB" ? "VRB" : parseInt(match[1], 10),
                speedKt,
                speedMps,
                gust: match[3] ? parseInt(match[3], 10) : false,
                variableDirection: match[1] === "VRB"
            }
        };
    }
};

},{"../parser":3,"../utils":24}],21:[function(require,module,exports){
const Parser = require("../parser");

module.exports = class VariationParser extends Parser {
    static parse(metar) {
        const match = ` ${metar} `.match(/\s([0-9]{3})V([0-9]{3})\s/);

        if (!match) {
            return {
                wind: {
                    variation: null
                }
            };
        }

        return {
            wind: {
                variation: {
                    min: parseInt(match[1], 10),
                    max: parseInt(match[2], 10)
                }
            }
        };
    }
};

},{"../parser":3}],22:[function(require,module,exports){
const Parser = require("../parser");

module.exports = class WindshearParser extends Parser {
    static parse(metar) {
        let part;
        const match = [];
        const regex = /WS\s(?:RWY([0-9]{2}[LRC]?))|(ALL RWY)/g;

        while (part = regex.exec(metar)) {
            match.push(part);
        }

        return {
            windshear: match.map(group => group[1] || group[2])
        };
    }
};

},{"../parser":3}],23:[function(require,module,exports){
module.exports.UNITS = {
    FT: "feet",
    SM: "statute mile",
    KM: "kilometer"
};

module.exports.SKY_CONDITIONS = {
    SKC: "sky clear",
    FEW: "few",
    SCT: "scattered",
    BKN: "broken",
    OVC: "overcast",
    CLR: "clear",
    CB: "cumulonimbus",
    TCU: "towering cumulus",
    CU: "cumulus",
    CI: "cirrus",
    "///": "no information"
};

module.exports.RWR_TREND = {
    U: "upward",
    D: "downward",
    N: "no change",
    P: "more than",
    M: "less than"
};

module.exports.WEATHER = {
    "+": "heavy",
    "-": "light",
    VC: "in the vicinity",
    MI: "shallow",
    PR: "partial",
    BC: "patches",
    DR: "low drifting",
    BL: "blowing",
    SH: "shower",
    TS: "thunderstorm",
    FZ: "freezing",
    DZ: "drizzle",
    RA: "rain",
    SN: "snow",
    SG: "snow grains",
    IC: "ice crystals",
    PE: "ice pellets",
    GR: "hail",
    GS: "small hail",
    UP: "unknown",
    BR: "mist",
    FG: "fog",
    FU: "smoke",
    VA: "volcanic ash",
    DU: "dust",
    SA: "sand",
    HZ: "haze",
    PY: "spray",
    PO: "dust whirls",
    SQ: "squalls",
    FC: "funnel cloud/tornado/waterspout",
    SS: "duststorm"
};

},{}],24:[function(require,module,exports){
module.exports.convertKTtoMPS = kt => {
    return Math.round(parseFloat(kt) / 1.94384 * 100) / 100;
};

module.exports.convertMPStoKT = mps => {
    return Math.round(parseFloat(mps) * 1.94384 * 100) / 100;
};

},{}]},{},[1]);
