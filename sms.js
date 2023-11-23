function sendFallDetectionSMS() {
  // Your Twilio credentials
  const accountSid = "AC64a6c99ef0352b5944d417f4dafb3513";
  const authToken = "";

  // URL for Twilio SMS API
  const apiUrl =
    "https://api.twilio.com/2010-04-01/Accounts/AC64a6c99ef0352b5944d417f4dafb3513/Messages.json";

  // SMS data
  const smsData = {
    To: "+14038629883",
    From: "+19496823519",
    Body: "CRITICAL ALERT: Your loved one just had a fall, we are dialing 911",
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
