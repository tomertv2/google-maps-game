let isClicked = false;
let secretPlace = {};
let places = [];
let userCoordinates = { lat: 0, lng: 0 };
const checkWinRadius = 40000;

function getRndInteger() {
  return Math.floor(Math.random() * 1240) + 1;
}

// Initialize and add the map
async function initMap() {
  await fetch('http://localhost:8080/data')
    .then((response) => response.json())
    .then((data) => (places = data))
    .catch((e) => console.log(e));
  secretPlace = places[getRndInteger()];
  const x = secretPlace.X;
  const y = secretPlace.Y;
  const randomCoordinates = { lat: y, lng: x };

  document.getElementById('guessId').innerHTML = secretPlace.mglsde_l_4;

  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7.5,
    center: { lat: 31.4, lng: 35 },
    draggable: false,
  });

  const secretMarker = new google.maps.Marker({
    position: randomCoordinates,
    map: map,
  });

  console.log(randomCoordinates);

  google.maps.event.addListener(map, 'click', (event) => {
    addMarker(event.latLng, map);
    console.log(userCoordinates);
    console.log(getDistance(userCoordinates, randomCoordinates));
    const SecretMarkerCircle = new google.maps.Circle({
      strokeColor: 'white',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#e3e3e3',
      fillOpacity: 0.35,
      map,
      center: randomCoordinates,
      radius: checkWinRadius, // The usual radius is 40KM
    });
  });
}

function addMarker(location, map) {
  if (isClicked === false) {
    const userMarker = new google.maps.Marker({
      position: location,
      map: map,
    });
    userCoordinates.lat = userMarker.getPosition().lat();
    userCoordinates.lng = userMarker.getPosition().lng();
    isClicked = true;
  } else {
    return;
  }
}

var rad = function (x) {
  return (x * Math.PI) / 180;
};

var getDistance = function (p1, p2) {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(p2.lat - p1.lat);
  var dLong = rad(p2.lng - p1.lng);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat)) *
      Math.cos(rad(p2.lat)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d; // returns the distance in meter
};
