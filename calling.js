// Select the "Emergency Call" div by its id
const emergencyCallDiv = document.getElementById("emergency-call");

// Add a click event listener to the div
emergencyCallDiv.addEventListener("click", function () {
  console.log("hey it worked");
  // Your Twilio credentials
// Your Twilio credentials
const accountSid = "AC64a6c99ef0352b5944d417f4dafb3513";
const authToken = "auth-token-here";

// URL and data for the Twilio API request
const apiUrl = "https://api.twilio.com/2010-04-01/Accounts/AC64a6c99ef0352b5944d417f4dafb3513/Calls.json";
const requestData = {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "Authorization": `Basic ${btoa(`${accountSid}:${authToken}`)}` // Base64 encoded credentials
  },
  body: new URLSearchParams({
    "Url": "http://demo.twilio.com/docs/voice.xml",
    "To": "+1xxxxxxxxxx",
    "From": "+19496823519"
  }).toString()
};

// Make the Twilio API request using fetch
fetch(apiUrl, requestData)
  .then(response => response.json())
  .then(data => {
    console.log("Twilio API response:", data);
  })
  .catch(error => {
    console.error("Error making Twilio API request:", error);
  });

});
