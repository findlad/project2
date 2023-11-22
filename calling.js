// Select the "Emergency Call" div by its id
const emergencyCallDiv = document.getElementById("emergency-call");

// Add a click event listener to the div
emergencyCallDiv.addEventListener("click", function () {

  console.log("Emergency call initiated");

  // Create the "calling" popup container
  const callingPopupContainer = document.createElement("div");
  callingPopupContainer.style.position = "fixed";
  callingPopupContainer.style.top = "50%";
  callingPopupContainer.style.left = "50%";
  callingPopupContainer.style.transform = "translate(-50%, -50%)";
  callingPopupContainer.style.backgroundColor = "#666"; // Gray background
  callingPopupContainer.style.border = "2px solid yellow"; // Yellow border
  callingPopupContainer.style.borderRadius = "10px"; // Rounded edges
  callingPopupContainer.style.zIndex = "9999"; // Ensure it's above other elements

  // Create the "Calling..." text element
  const callingText = document.createElement("div");
  callingText.textContent = "Calling...";
  callingText.style.color = "#fff"; // White text color
  callingText.style.fontSize = "24px"; // Larger font size
  callingText.style.fontWeight = "bold"; // Bold text
  callingText.style.padding = "15px"; // Padding within the container

  // Append the "Calling..." text to the container
  callingPopupContainer.appendChild(callingText);

  // Append the container to the body
  document.body.appendChild(callingPopupContainer);

// Your Twilio credentials
const accountSid = "AC64a6c99ef0352b5944d417f4dafb3513";
const authToken = "71a4e7bdd50c303c7fa70d49fc6d1852";

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
    "To": "+18259949649",
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

  // Use setTimeout to remove the popup after 5 seconds
  setTimeout(function () {
    // Remove the "calling" popup
    document.body.removeChild(callingPopupContainer);
  }, 5000);

});
