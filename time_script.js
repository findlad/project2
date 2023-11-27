// Function to update date and time
function updateDateTime() {
  const dateElement = document.getElementById("date_2");
  const timeElement = document.getElementById("time");
  console.log(dateElement);

  // Get the current date and time
  const currentDate = new Date();
  const optionsDate = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  console.log("2nd");
  const optionsTime = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };
  const formattedDate = currentDate.toLocaleDateString("en-US", optionsDate);
  const formattedTime = currentDate.toLocaleTimeString("en-US", optionsTime);
  console.log("3rd");

  // Update the date and time elements
  dateElement.textContent = formattedDate;
  timeElement.textContent = formattedTime;
  console.log("4th");
}

// Call the function to initially set the date and time
updateDateTime();

// Update the date and time every second (you can adjust the interval)
setInterval(updateDateTime, 1000);
