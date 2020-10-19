let isClicked = false;
let places = [];
let userCoordinates = { lat: 0, lng: 0 };
let randomCoordinates = { lat: 0, lng: 0 };
let score = 0;

function getRndInteger() {
  return Math.floor(Math.random() * 1240) + 1;
}

async function initData() {
  await fetch('http://localhost:8080/data')
    .then((response) => response.json())
    .then((data) => (places = data))
    .catch((e) => console.log(e));
  const secretPlace = places[getRndInteger()];
  const x = secretPlace.X;
  const y = secretPlace.Y;
  randomCoordinates = { lat: x, lng: y };

  document.getElementById('guess-id').innerHTML = secretPlace.mglsde_l_4;
}

// Initialize and add the map
function initMap() {
  initData();

  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7.5,
    center: { lat: 31.4, lng: 35 },
    draggable: false,
    // Style not working because I did not paid for google services
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

  google.maps.event.addListener(map, 'click', (event) => {
    if (isClicked) {
      return;
    }

    const userMarker = addMarker(event.latLng, map);
    userCoordinates.lat = userMarker.getPosition().lat();
    userCoordinates.lng = userMarker.getPosition().lng();

    const secretMarker = new google.maps.Marker({
      position: randomCoordinates,
      map: map,
    });

    const distanceRandomGuess = getDistance(userCoordinates, randomCoordinates);

    const secretMarkerCircle = new google.maps.Circle({
      strokeColor: 'white',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#e3e3e3',
      fillOpacity: 0.35,
      map,
      center: randomCoordinates,
      radius: distanceRandomGuess,
    });

    score += Math.floor(Math.abs(distanceRandomGuess - 400000.0) / 10000.0);

    document.getElementById('score-id').innerHTML = score;

    if (distanceRandomGuess < 40000) {
      console.log('Pretty close!');
      document.getElementById('phrase').innerHTML = 'Pretty close!';
    } else {
      console.log('So far away!');
      document.getElementById('phrase').innerHTML = 'So far away...';
    }

    document.getElementById('distance').innerHTML = `You were ${Math.floor(
      distanceRandomGuess / 1000
    )} KM from the location.`;

    // show the answer for two seconds
    setTimeout(() => {
      secretMarker.setMap(null);
      secretMarkerCircle.setMap(null);
      userMarker.setMap(null);
    }, 2000);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('replay-btn').addEventListener('click', function () {
    document.getElementById('phrase').innerHTML = '';
    document.getElementById('distance').innerHTML = '';
    isClicked = false;
    initMap();
  });
});

function addMarker(location, map) {
  isClicked = true;
  return new google.maps.Marker({
    position: location,
    map: map,
  });
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
