var latitude = -8.7993579;
var longitude = 115.1681177;

var forecast_days = 1;

var api_url = 'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=' + latitude + '&longitude=' + longitude + '&current=us_aqi&hourly=us_aqi&timezone=auto&forecast_days=' + forecast_days;

fetch(api_url)
  .then(response => response.json())
  .then(weatherData => {
    // Access specific data under the "current" key
    const currentTimeString = weatherData.current.time;
    const usAqiValue = weatherData.current.us_aqi;
    const latitude = weatherData.latitude;
    const longitude = weatherData.longitude;

    // Format date and time
    const formattedDateTime = formatDateTime(currentTimeString);

    // Determine and display the air quality category
    const category = determineCategory(usAqiValue);

    // Determine and display caution information
    const caution = determineCaution(category);

    // Display the specific data in the media-body
    document.getElementById('category').innerHTML = category;
    document.getElementById('usAqiValue').innerHTML = '<b>Aqi ' + usAqiValue + '</b>, ' + caution;
    document.getElementById('coordinate').innerHTML = '<b>Latitude </b>' + latitude + ', <b>Longitude</b> ' + longitude + '\n' + formattedDateTime;

    // Set background color based on usAqiValue
    setBackgroundColor(usAqiValue);

    // Populate the forecast table
    populateForecastTable(weatherData.hourly);
  })
  .catch(error => {
    console.error('Error fetching weather data:', error);
  });

function updateData() {
  // Ambil nilai dari input
  var newLatitude = document.getElementById('latitudeInput').value;
  var newLongitude = document.getElementById('longitudeInput').value;
  var newForecastDays = document.getElementById('forecastDaysInput').value;

  // Validasi input (Anda dapat menambahkan validasi sesuai kebutuhan)
  if (!newLatitude || !newLongitude || !newForecastDays) {
    alert('Silakan masukkan semua data.');
    return;
  }

  // Update nilai latitude, longitude, dan forecast_days
  latitude = parseFloat(newLatitude);
  longitude = parseFloat(newLongitude);
  forecast_days = parseInt(newForecastDays);

  // Perbarui URL API sesuai dengan nilai yang baru dimasukkan
  api_url = 'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=' + latitude + '&longitude=' + longitude + '&current=us_aqi&hourly=us_aqi&timezone=auto&forecast_days=' + forecast_days;

  // Ambil data terbaru
  fetch(api_url)
    .then(response => response.json())
    .then(weatherData => {
      // Proses data seperti yang dilakukan sebelumnya
      const currentTimeString = weatherData.current.time;
      const usAqiValue = weatherData.current.us_aqi;
      const latitude = weatherData.latitude;
      const longitude = weatherData.longitude;

      const formattedDateTime = formatDateTime(currentTimeString);
      const category = determineCategory(usAqiValue);
      const caution = determineCaution(category);

      document.getElementById('category').innerHTML = category;
      document.getElementById('usAqiValue').innerHTML = '<b>Aqi ' + usAqiValue + '</b>, ' + caution;
      document.getElementById('coordinate').innerHTML = '<b>Latitude </b>' + latitude + ', <b>Longitude</b> ' + longitude + '\n' + formattedDateTime;

      // Set background color based on usAqiValue
      setBackgroundColor(usAqiValue);

      // Populate the forecast table
      populateForecastTable(weatherData.hourly);
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
    });

  // Tutup modal
  $('#inputModal').modal('hide');

  // Fetch location data
  fetchLocationData();
}

function fetchLocationData() {
  var osm = 'https://nominatim.openstreetmap.org/reverse?lat=' + latitude + '&lon=' + longitude + '&format=json';

  fetch(osm)
    .then(response => response.json())
    .then(locationData => {
      // Extract and display the display_name in the "location" div
      const displayName = locationData.display_name || 'Not found';
      document.getElementById('location').innerHTML = displayName;
    })
    .catch(error => {
      console.error('Error fetching location data:', error);
    });
}

// Function to format date and time
function formatDateTime(dateTimeString) {
  const dateTime = new Date(dateTimeString);
  const formattedDate = `${dateTime.getFullYear()}-${padZero(dateTime.getMonth() + 1)}-${padZero(dateTime.getDate())}`;
  const formattedTime = `${padZero(dateTime.getHours())}:${padZero(dateTime.getMinutes())}`;
  return `${formattedDate}, ${formattedTime}`;
}

// Function to pad single-digit numbers with a leading zero
function padZero(number) {
  return number < 10 ? `0${number}` : number;
}

// Function to determine the air quality category
function determineCategory(aqiValue) {
  if (aqiValue >= 0 && aqiValue <= 50) {
    return 'Good';
  } else if (aqiValue >= 51 && aqiValue <= 100) {
    return 'Moderate';
  } else if (aqiValue >= 101 && aqiValue <= 150) {
    return 'Unhealthy for Sensitive Groups';
  } else if (aqiValue >= 151 && aqiValue <= 200) {
    return 'Unhealthy';
  } else if (aqiValue >= 201 && aqiValue <= 300) {
    return 'Very Unhealthy';
  } else if (aqiValue >= 301 && aqiValue <= 500) {
    return 'Hazardous';
  } else {
    return 'Unknown';
  }
}

// Function to determine caution information based on air quality category
function determineCaution(category) {
  switch (category) {
    case 'Good':
      return 'Air quality is considered satisfactory, and air pollution poses little or no risk.';
    case 'Moderate':
      return 'Air quality is acceptable; however, some pollutants may be a concern for a very small number of people who are unusually sensitive to air pollution.';
    case 'Unhealthy for Sensitive Groups':
      return 'Members of sensitive groups (e.g., individuals with respiratory or heart conditions, children, and older adults) may experience health effects.';
    case 'Unhealthy':
      return 'Everyone may begin to experience health effects, and members of sensitive groups may experience more serious health effects.';
    case 'Very Unhealthy':
      return 'Health alert: everyone may experience more serious health effects.';
    case 'Hazardous':
      return 'Health warnings of emergency conditions. The entire population is likely to be affected.';
    default:
      return 'Unknown';
  }
}

// Function to set background color based on usAqiValue
function setBackgroundColor(aqiValue) {
  // Set default color
  let backgroundColor = '#0B9444'; // Green

  // Determine color based on air quality category
  if (aqiValue >= 0 && aqiValue <= 50) {
    backgroundColor = '#0B9444'; // Green for Good
  } else if (aqiValue >= 51 && aqiValue <= 100) {
    backgroundColor = '#FFDE16'; // Yellow for Moderate
  } else if (aqiValue >= 101 && aqiValue <= 150) {
    backgroundColor = '#F7941E'; // Orange for Unhealthy for Sensitive Groups
  } else if (aqiValue >= 151 && aqiValue <= 200) {
    backgroundColor = '#ED1C24'; // Red for Unhealthy
  } else if (aqiValue >= 201 && aqiValue <= 300) {
    backgroundColor = '#773CBE'; // Purple for Very Unhealthy
  } else if (aqiValue >= 301 && aqiValue <= 500) {
    backgroundColor = '#BF1E2E'; // Maroon for Hazardous
  }

  // Apply the background color to the div element
  document.getElementById('backgroundDiv').style.backgroundColor = backgroundColor;
}

// Function to populate the forecast table
function populateForecastTable(hourlyData) {
  const tableBody = document.getElementById('forecastTableBody');

  for (let i = 0; i < hourlyData.time.length; i++) {
    const row = tableBody.insertRow();
    const timeCell = row.insertCell(0);
    const aqiCell = row.insertCell(1);
    const categoryCell = row.insertCell(2);
    const cautionCell = row.insertCell(3);

    timeCell.textContent = formatDateTime(hourlyData.time[i]);
    aqiCell.textContent = hourlyData.us_aqi[i];

    // Determine and display the air quality category for forecast
    const forecastCategory = determineCategory(hourlyData.us_aqi[i]);
    categoryCell.textContent = forecastCategory;

    // Determine and display caution information
    const forecastCaution = determineCaution(forecastCategory);
    cautionCell.textContent = forecastCaution.length > 50 ? forecastCaution.substring(0, 50) + '...' : forecastCaution;
  }
}

// Initial fetch for location data
fetchLocationData();