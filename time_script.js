// Function to update date and time with a specified locale
function updateDateTime(localeStart = "en") {
  var locale;
  if (localeStart === "en") {
    locale = "en-US";
  } else {
    locale = "fr-FR";
  }
  const dateElement = document.getElementById("date");
  const timeElement = document.getElementById("time");

  // Get the current date and time
  const currentDate = new Date();
  const optionsDate = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const optionsTime = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: locale === "en-US", // Use 12-hour format for en-US, 24-hour for fr-FR
  };

  const formattedDate = currentDate.toLocaleDateString(locale, optionsDate);
  const formattedTime = currentDate.toLocaleTimeString(locale, optionsTime);

  // Update the date and time elements
  dateElement.textContent = formattedDate;
  timeElement.textContent = formattedTime;
}

// Call the function with desired locale
updateDateTime("en"); // for English (US)
// updateDateTime("fr-FR"); // for French (France)

// Update the date and time every second (you can adjust the interval)
setInterval(() => updateDateTime(localStorage.getItem('language')), 1000); // Change the locale as needed
