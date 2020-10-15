let isClicked = false;
let secretPlace = {};
let places = [];
let userCoordinates = { lat: 0, lng: 0 };
const checkWinRadius = 40000;

function getRndInteger() {
  return Math.floor(Math.random() * 1240) + 1;
}

async function initData() {
  await fetch('http://localhost:8080/data')
    .then((response) => response.json())
    .then((data) => (places = data))
    .catch((e) => console.log(e));
  secretPlace = places[getRndInteger()];
  const x = secretPlace.X;
  const y = secretPlace.Y;
  const randomCoordinates = { lat: y, lng: x };

  document.getElementById('guessId').innerHTML = secretPlace.mglsde_l_4;
}

// Initialize and add the map
async function initMap() {
  initData();

  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7.5,
    center: { lat: 31.4, lng: 35 },
    draggable: false,
    styles: [
      {
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        featureType: 'administrative.neighborhood',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        featureType: 'road',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
    ],
  });

  google.maps.event.addListener(map, 'click', async (event) => {
    const userMarker = addMarker(event.latLng, map);
    userCoordinates.lat = userMarker.getPosition().lat();
    userCoordinates.lng = userMarker.getPosition().lng();

    const secretMarker = new google.maps.Marker({
      position: randomCoordinates,
      map: map,
    });

    const secretMarkerCircle = new google.maps.Circle({
      strokeColor: 'white',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#e3e3e3',
      fillOpacity: 0.35,
      map,
      center: randomCoordinates,
      radius: checkWinRadius, // The usual radius is 40KM
    });

    const distanceRandomGuess = getDistance(userCoordinates, randomCoordinates);
    if (distanceRandomGuess > checkWinRadius) {
      alert('Looser!');
    } else {
      alert('Winner!');
    }

    setTimeout(() => {
      secretMarker.setMap(null);
      secretMarkerCircle.setMap(null);
      userMarker.setMap(null);
    }, 2000);
  });
}

function addMarker(location, map) {
  if (isClicked === false) {
    const newMarker = new google.maps.Marker({
      position: location,
      map: map,
    });
    isClicked = true;
    return newMarker;
  } else {
    return;
  }
}

const rad = function (x) {
  return (x * Math.PI) / 180;
};

const getDistance = function (p1, p2) {
  const R = 6378137; // Earth’s mean radius in meter
  const dLat = rad(p2.lat - p1.lat);
  const dLong = rad(p2.lng - p1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat)) *
      Math.cos(rad(p2.lat)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d; // returns the distance in meter
};
