# weatherAPI

# Objective
Use OpenWeather API to pull weather forecast for cities to adjust marketing budget etc.


# Summary
I worked on this script to automate Facebook Ads for a client's campaign. I needed to grab city-level weather forecast for top US cities so we can adjust ad copies and budget based on the next 3-day weather.

The Javascript code is for Google App Script, which you can copy and paste to your Google Sheet > Go to Extension.

# About API
For OpenWeather API token, visit https://openweathermap.org/api. 
For Free API version, there's a limit of API calls you can make per minute/day. This script uses delay function to accomodate for this limit. 
It may not work if your list of cities are too long, or it may take more than 10 minutes to run. 

# Notes on the script
The API data gives you 3-hour/5-day weather forecast starting the next available hour (0, 3, 6, 9, 12 am/pm) of the same day. 
The forecast contains max/min temperature (of the 3-hour window) and weather conditions such as clear, light rain, overcast, etc. 
This script takes 4-day forecast per city, aggregate by day, and fills out a google sheet with one row per city. 
You can also use US zip code or non-US city names to get the weather. 

For further questions, reach out to the author on GitHub. 

