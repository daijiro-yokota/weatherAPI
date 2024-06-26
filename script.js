
const BASE_API_F = 'https://api.openweathermap.org/data/2.5/forecast';
const API_KEY_F = 'API_KEY';//GET YOUR OWN API KEY
const WEATHER_SHEET = 'weatherCity';

const RANGE_FA = 'A2:A'; 
const CITY_FA = 'B2:B'; // For city names
const DESCRIPTION_FA1 = 'C2:C'; // For weather description for Day 1
const DESCRIPTION_FA2 = 'D2:D'; // for Day 2
const DESCRIPTION_FA3 = 'E2:E'; // for Day 3
const DESCRIPTION_FA4 = 'F2:F'; // for Day 4

const MIN_TEMP_OUTPUT_RANGE_FA_D1 = 'G2:G'; // For minimum temperatures for D1
const MAX_TEMP_OUTPUT_RANGE_FA_D1 = 'H2:H'; // For maximum temperatures for D1
const MIN_TEMP_OUTPUT_RANGE_FA_D2 = 'I2:I'; // For min day 2
const MAX_TEMP_OUTPUT_RANGE_FA_D2 = 'J2:J'; // For max day 2
const MIN_TEMP_OUTPUT_RANGE_FA_D3 = 'K2:K'; // For min day 3
const MAX_TEMP_OUTPUT_RANGE_FA_D3 = 'L2:L'; // For max day 3
const MIN_TEMP_OUTPUT_RANGE_FA_D4 = 'M2:M'; // For min day 4
const MAX_TEMP_OUTPUT_RANGE_FA_D4 = 'N2:N'; // For max day 4


function fetchForecast() {
  var mainSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(WEATHER_SHEET);
  var zipsToFetch = mainSheet.getRange(RANGE_FA).getValues();

  var weatherDescriptions1 = [];
  var weatherDescriptions2 = [];
  var weatherDescriptions3 = [];
  var weatherDescriptions4 = [];
  var cityNames = []; // Array to store city names

  var minTemps_D1 = []; // Array to store minimum temperatures
  var maxTemps_D1 = []; // Array to store maximum temperatures
  var minTemps_D2 = []; // Array to store min
  var maxTemps_D2 = []; // Array to store max
  var minTemps_D3 = []; // Array to store min
  var maxTemps_D3 = []; // Array to store max
  var minTemps_D4 = []; // Array to store min
  var maxTemps_D4 = []; // Array to store max

  for (let i = 0; i < zipsToFetch.length; i++) {
    try { 
     const options = {
      muteHttpExceptions: true
    };
      var response = UrlFetchApp.fetch(BASE_API_F + '?q=' + zipsToFetch[i][0] + ",us&appid=" + API_KEY + "&cnt=32&units=imperial", options);
    // you have the parsedResponse object with the 3-hour forecast data
    if (response.getResponseCode() === 200) {
      var parsedResponse = JSON.parse(response.getContentText());
      var city = parsedResponse.city.name; // city name is in the 'name' property of 'city'
      cityNames.push([city]); // Add the city name to the cityNames array

const dailyAggregatedData = {};
parsedResponse.list.forEach(function(forecast) {
  const date = new Date(forecast.dt * 1000).toISOString().split('T')[0]; // Extract date part

  if (!dailyAggregatedData[date]) {
    dailyAggregatedData[date] = {
      high_temp_max: Number.NEGATIVE_INFINITY, // Initialize with lowest 
      low_temp_min: Number.POSITIVE_INFINITY, // Initialize with highest 
      weatherDescriptions: [], //empty list
    };
  }
  dailyAggregatedData[date].high_temp_max = Math.max(dailyAggregatedData[date].high_temp_max, forecast.main.temp_max);
  dailyAggregatedData[date].low_temp_min = Math.min(dailyAggregatedData[date].low_temp_min, forecast.main.temp_min);
  dailyAggregatedData[date].weatherDescriptions.push(forecast.weather[0].description)
});

// After the loop, process the aggregated data
Object.keys(dailyAggregatedData).forEach((date, index) => {

  const dataForDate = dailyAggregatedData[date];
  const maxTemp = dataForDate.high_temp_max.toFixed(2);
  const minTemp = dataForDate.low_temp_min.toFixed(2);
  const descriptions = dataForDate.weatherDescriptions;
  const mostCommonDescription = descriptions.sort((a,b) =>
    descriptions.filter(v => v===a).length
    - descriptions.filter(v => v===b).length
  ).pop(); // Get the most common description


// Add the data to the arrays
  if (index === 0){
    minTemps_D1.push([minTemp]); // Assuming D1 corresponds to date
   maxTemps_D1.push([maxTemp]);
   weatherDescriptions1.push([mostCommonDescription]);
  }
  else if (index === 1) { // Day 2
    minTemps_D2.push([minTemp]);
    maxTemps_D2.push([maxTemp]);
    weatherDescriptions2.push([mostCommonDescription]);
  } else if (index === 2) { // Day 3
    minTemps_D3.push([minTemp]);
    maxTemps_D3.push([maxTemp]);
    weatherDescriptions3.push([mostCommonDescription]);
  } else if (index === 3) { // Day 4
    minTemps_D4.push([minTemp]);
    maxTemps_D4.push([maxTemp]);
    weatherDescriptions4.push([mostCommonDescription]);
  }
});
}

else { throw new Error('API request failed with code: ' + response.getResponseCode());
 }
    } catch (e) {
      // console.log("Error fetching weather for zip code " + zipsToFetch[i][0]);
      console.error("Error fetching weather for zip code " + zipsToFetch[i][0] + ": " + e.message);
      // Push empty strings if there's an error, to keep rows aligned
      weatherDescriptions1.push([""]);
      weatherDescriptions2.push([""]);
      weatherDescriptions3.push([""]);
      weatherDescriptions4.push([""]);
      
      cityNames.push([""]); 

      minTemps_D1.push([""]); // Push empty string for temperature for Day 1
      maxTemps_D1.push([""]); // Push empty string for temperature for Day 1
      minTemps_D2.push([""]); // Push empty string for temperature for Day 2
      maxTemps_D2.push([""]); // Push empty string for temperature for Day 2
      minTemps_D3.push([""]); // Push empty string for temperature for Day 3
      maxTemps_D3.push([""]); // Push empty string for temperature for Day 3
      minTemps_D4.push([""]); // Push empty string for temperature for Day 4
      maxTemps_D4.push([""]); // Push empty string for temperature for Day 4
    }

    // Add delay to avoid hitting API rate limits
    var delay = 20;
    Utilities.sleep(delay);
    console.log("Waited " + delay/1000 + " second(s) before next execution");
  }

  // Output the weather descriptions, city names, and temperatures to the specified ranges
  if (weatherDescriptions1.length === zipsToFetch.length) {
    var description1Range = mainSheet.getRange(DESCRIPTION_FA1);
    description1Range.setValues(weatherDescriptions1);
    var description2Range = mainSheet.getRange(DESCRIPTION_FA2);
    description2Range.setValues(weatherDescriptions2);
    var description3Range = mainSheet.getRange(DESCRIPTION_FA3);
    description3Range.setValues(weatherDescriptions3);
    var description4Range = mainSheet.getRange(DESCRIPTION_FA4);
    description4Range.setValues(weatherDescriptions4);
  
    var cityRange = mainSheet.getRange(CITY_FA);
    cityRange.setValues(cityNames);
   
    var minTempRange_D1 = mainSheet.getRange(MIN_TEMP_OUTPUT_RANGE_FA_D1);
    minTempRange_D1.setValues(minTemps_D1);
    var maxTempRange_D1 = mainSheet.getRange(MAX_TEMP_OUTPUT_RANGE_FA_D1);
    maxTempRange_D1.setValues(maxTemps_D1);

    var minTempRange_D2 = mainSheet.getRange(MIN_TEMP_OUTPUT_RANGE_FA_D2);
    minTempRange_D2.setValues(minTemps_D2);
    var maxTempRange_D2 = mainSheet.getRange(MAX_TEMP_OUTPUT_RANGE_FA_D2);
    maxTempRange_D2.setValues(maxTemps_D2);

    var minTempRange_D3 = mainSheet.getRange(MIN_TEMP_OUTPUT_RANGE_FA_D3);
    minTempRange_D3.setValues(minTemps_D3);
    var maxTempRange_D3 = mainSheet.getRange(MAX_TEMP_OUTPUT_RANGE_FA_D3);
    maxTempRange_D3.setValues(maxTemps_D3);

    var minTempRange_D4 = mainSheet.getRange(MIN_TEMP_OUTPUT_RANGE_FA_D4);
    minTempRange_D4.setValues(minTemps_D4);
    var maxTempRange_D4 = mainSheet.getRange(MAX_TEMP_OUTPUT_RANGE_FA_D4);
    maxTempRange_D4.setValues(maxTemps_D4);
  }
  }