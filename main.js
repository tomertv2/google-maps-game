let isClicked = false;
let secretPlace = {};
let places = [];

function getRndInteger() {
  return Math.floor(Math.random() * 1240) + 1;
}

// Initialize and add the map
async function initMap() {
  await fetch('http://localhost:8080/data')
  .then(response => response.json())
  .then(data => places = data);
  secretPlace = places[getRndInteger()];
  const x = secretPlace.X;
  const y = secretPlace.Y;
  const randomCoordinates = { lat: Number(y), lng: Number(x) };

  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7.5,
    center: { lat: 31.5, lng: 35 },
    draggable: false
  });

  google.maps.event.addListener(map, 'click', (event) => {
    addMarker(event.latLng, map);
  });

  const secterMarker = new google.maps.Marker({
    position: randomCoordinates,
    map: map,
  });
}

function addMarker(location, map) {
  if (isClicked === false) {
    new google.maps.Marker({
      position: location,
      map: map,
    });
    isClicked = true;
  } else {
    return;
  }
}
