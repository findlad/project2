function sendSMS(message) {
  // Your Twilio credentials
  const authToken = "3d8c301961c45018ad823e1d3601a05d";
  const accountSid = "AC64a6c99ef0352b5944d417f4dafb3513";

  // URL for Twilio SMS API
  const apiUrl =
    "https://api.twilio.com/2010-04-01/Accounts/AC64a6c99ef0352b5944d417f4dafb3513/Messages.json";

  // SMS data
  const smsData = {
    To: "+14038629883", //Duncan
    //To: "+14036148363", // John
    Body: message,
  };

  // Create a form-urlencoded string from the SMS data
  const formData = new URLSearchParams(smsData).toString();

  // Make the Twilio API request using fetch
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`, // Base64 encoded credentials
    },
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Twilio SMS sent successfully:", data);
    })
    .catch((error) => {
      console.error("Error sending Twilio SMS:", error);
    });
}