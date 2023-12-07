const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

function getWeight() {
  let allWeights = localStorage.getItem("weightHistory"); // assuming "weightHistory" is the correct key
  allWeights = JSON.parse(allWeights || "[]"); // Parse the data, and handle the case where it's null or undefined
  // Sort the array of weights by date
  allWeights.sort((a, b) => new Date(b.date) - new Date(a.date));
  const latestWeight = allWeights[0];

  // console.log("reaches the query selector");
  document.querySelectorAll("#weightbox").forEach(function (el) {
    // console.log("weight log", latestWeight);
    el.innerHTML = latestWeight ? latestWeight.weight + " Kg" : "---- Kg";
  });
  document.querySelectorAll("#stablebox").forEach(function (el) {
    // console.log("stability index ", latestWeight.Stability);
    el.innerHTML = latestWeight
      ? latestWeight.Stability + " WI"
      : "Wobble: ----";
  });

  let lastTemp = Number(localStorage.getItem("lastTemp"));
  document.querySelectorAll("#tempbox").forEach(function (el) {
    // console.log("temp  ", lastTemp);
    el.innerHTML = lastTemp.toFixed(1)
      ? lastTemp.toFixed(1) + " &deg;C"
      : "----  &deg;C";
  });

  const weightButton = document.getElementById("openModalBtn");
  const closeModalButton = document.getElementById("closeModalButton");
  const modal = document.getElementById("modalBox");

  weightButton.addEventListener("click", () => {
    console.log("click detected");
    modal.style.display = "flex";

    // Clear the previous chart, if any
    const modalContent = document.querySelector(".modal-content");
    modalContent.style.width = "80%"; // Set the desired width here
    modalContent.style.height = "80%";
    modalContent.innerHTML = '<canvas id="graph"></canvas>';

    // Add your chart creation code here based on the thing and store
    const x = allWeights.map((entry) => entry.date);
    const y = allWeights.map((entry) => entry.weight);
    const y2 = allWeights.map((entry) => entry.Stability);
    const ctx = document.getElementById("graph").getContext("2d");
    console.log(x);
    new Chart(ctx, {
      type: "line",
      data: {
        labels: x,
        datasets: [
          {
            label: "Weight History",
            data: y,
            borderColor: "rgba(75, 192, 192, 1)", // Add a border color for the first dataset
            fill: false, // Don't fill the area under the line
            yAxisID: "Weight", // Assign the dataset to the primary y-axis
          },
          {
            label: "Stability",
            data: y2,
            borderColor: "rgba(255, 99, 132, 1)", // Add a different border color for the second dataset
            fill: false,
            yAxisID: "Stability Index", // Assign the dataset to the primary y-axis
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { reverse: true },
        },
        // Add any other chart options you need here
      },
    });
  });

  closeModalButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
}

getWeight();

// Function to calculate the mean of an array
function calculateMean(array) {
  if (array.length === 0) {
    return NaN; // or you can choose to return NaN or any other value
  }
  // Calculate the sum of the array elements
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    array[i] = Number(array[i]);
    sum += array[i];
  }
  let mean = sum / array.length;
  return mean;
}

const socket = new WebSocket("ws://homeassistant.local:8123/api/websocket");

socket.onopen = async (event) => {
  console.log("WebSocket connection opened:", event);

  // Authenticate with Home Assistant
  socket.send(
    JSON.stringify({
      type: "auth",
      access_token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI1NGI2YTM5ZjhiZDU0ZjIxOGFlYzk5ZWNmYTA1OTU0NiIsImlhdCI6MTY5OTU2NjQzMSwiZXhwIjoyMDE0OTI2NDMxfQ.QbRxVeZxj0GxG-_4DvdoZrXlzfcUWBr-Dx0zr3Pt4GI", // Replace with your access token
    })
  );

  // Listen to changes sent by IOT
  socket.send(
    JSON.stringify({
      id: incrimentalId,
      type: "subscribe_events",
    })
  );

  // Call getCurrentSwitchState immediately when the page loads

  getCurrentState();
};

let weightArray = [];
let switchState;

// process incoming events json
socket.onmessage = (event) => {
  try {
    // console.log(event);
    const receivedData = JSON.parse(event.data);
    console.log("receivedData", receivedData);

    if (receivedData.type === "event") {
      //bedroom lamp
      if (receivedData.event.data.entity_id === "switch.thing2") {
        thing2State = receivedData.event.data.new_state.state === "on";
        var newImageSrc = thing2State ? "img_ONlamp.png" : "img_OFFlamp.png";
        document
          .querySelectorAll(".slide2 .tranding-slide-img img")
          .forEach(function (el) {
            console.log("el", el);
            el.src = newImageSrc;
          });
      }

      // kitchen lamp
      if (receivedData.event.data.entity_id === "switch.thing1") {
        thing1State = receivedData.event.data.new_state.state === "on";
        var newImageSrc = thing1State
          ? "img_ONKitchenLight.png"
          : "img_OFFKitchenLight.png";

        document
          .querySelectorAll(".slide3 .tranding-slide-img img")
          .forEach(function (el) {
            el.src = newImageSrc;
          });
      }

      //fall sensor
      if (
        receivedData.event.data.entity_id ===
        "binary_sensor.presence_sensor_fp2_1708_presence_sensor_1"
      ) {
        sendSMS(
          "CRITICAL ALERT: Your loved one just had a fall, we are dialing 911"
        );
        const fall = true; //using the presence sensor as fall detection for now
        console.log("fall detected");
        const fallbox = document.getElementById("fallbox");
        fallbox.innerHTML = "FALL";
        fallbox.classList.remove("fall");
        fallbox.classList.add("fall");
      }
      // temperature
      if (receivedData.event.data.entity_id === "sensor.temperature_sensor") {
        const instantTemp = Number(
          receivedData.event.data.new_state.state
        ).toFixed(1);

        localStorage.setItem("lastTemp", instantTemp);

        document.querySelectorAll("#tempbox").forEach(function (el) {
          console.log("temp  ", instantTemp);
          el.innerHTML = instantTemp ? instantTemp + " &deg;C" : "----  &deg;C";
        });
        if (instantTemp > 28 || instantTemp < 15) {
          sendSMS(
            "Elizabeth`s Loft temperature is outside the comfortable range"
          );
        }
      }

      // weight
      if (
        receivedData.event.data.entity_id ===
        "sensor.smart_scale_c1_real_time_weight"
      ) {
        console.log(receivedData);

        const instantWeight = receivedData.event.data.new_state.state;
        console.log(instantWeight);
        if (instantWeight >= 0) {
          console.log("Instant Weight: " + instantWeight);
          weightArray.push(Number(instantWeight));
          console.log("Weight Array: " + weightArray);

          if (instantWeight < 30) {
            // Assuming weightArray is defined and populated elsewhere in your code

            // Trim the array
            weightArray.splice(0, 3);
            weightArray.splice(weightArray.length - 3, 3);

            // Filter out NaN and Infinity values from weightArray
            weightArray = weightArray.filter(
              (weight) => !isNaN(weight) && isFinite(weight)
            );

            // Check if there are valid values in weightArray
            if (weightArray.length > 0) {
              // Calculate the average weight
              const aveWeight = calculateMean(weightArray);

              // Calculate stability index
              const stabilityIndex =
                Math.max(...weightArray) - Math.min(...weightArray);

              // Create an object for today's weight
              const todaysWeight = {
                weight: aveWeight.toFixed(1),
                Stability: stabilityIndex.toFixed(1),
                date: new Date(),
              };

              // Display the results on the page
              const weightbox = document.getElementById("weightbox");
              weightbox.innerHTML = todaysWeight.weight + " Kg";

              const stablebox = document.getElementById("stablebox");
              stablebox.innerHTML = todaysWeight.Stability;

              // Retrieve existing data from localStorage
              let existingData = localStorage.getItem("weightHistory");

              // Parse the existing data or initialize with an empty array if it doesn't exist yet
              let allWeights = existingData ? JSON.parse(existingData) : [];

              // Log the existing data
              console.log("Existing Weight History:", allWeights);

              // Add today's weight to the array
              allWeights.push(todaysWeight);

              // Stringify the array and store it back in localStorage
              localStorage.setItem("weightHistory", JSON.stringify(allWeights));

              // Log the updated data
              console.log("Updated Weight History:", allWeights);

              if (
                todaysWeight.weight - Number(existingData.weight) > 5 ||
                todaysWeight.weight - Number(existingData.weight) < -5
              ) {
                console.log("weight change");
                sendSMS("Elizabeth`s weight is fluctuating a lot");
              }
              if (todaysWeight.Stability > 5) {
                console.log("wobbly");
                sendSMS("Elizabeth`s weight is unsteady on her feet");
              }

              getWeight();
            } else {
              console.log("No valid weights to calculate. Skipping update.");
            }
          }
        }
      } else {
        console.warn(
          "Received data does not match the expected format:",
          receivedData
        );
      }
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
};

//closing the websocket
socket.onclose = (event) => {
  console.log("WebSocket connection closed:", event);
};
//sending message to the pi
function sendMessage(message) {
  //console.log("Sending message:", message);
  socket.send(message);
}
// start a counter so theres a different id every time
let incrimentalId = 1;

//get the current state of the switch
function getCurrentState() {
  // delay(5000);
  const message = JSON.stringify({
    id: incrimentalId,
    type: "get_states",
  });
  incrimentalId++;
  console.log(message);
  sendMessage(message);
}
getCurrentState();

//tell the switch to toggle
function toggleSwitch() {
  console.log("switch toggled");
  // manualToggle = true;
  const message = JSON.stringify({
    id: incrimentalId,
    type: "call_service",
    domain: "switch",
    service: "Toggle",
    service_data: {
      entity_id: "switch.thing2", // Replace with whatever the entity ID is when copying
    },
  });
  sendMessage(message);

  incrimentalId++;
}
//tell the switch to toggle
function toggleSwitchKitchen() {
  console.log("switch toggled");
  // manualToggle = true;
  const message = JSON.stringify({
    id: incrimentalId,
    type: "call_service",
    domain: "switch",
    service: "Toggle",
    service_data: {
      entity_id: "switch.thing1", // Replace with whatever the entity ID is when copying
    },
  });
  sendMessage(message);

  incrimentalId++;
}
function allOff() {
  console.log("lightsOff");
  // manualToggle = true;
  const message = JSON.stringify({
    id: incrimentalId,
    type: "call_service",
    domain: "switch",
    service: "turn_off",
    service_data: {
      entity_id: "switch.thing2", // Replace with whatever the entity ID is when copying
    },
  });
  sendMessage(message);
  incrimentalId++;
  const message1 = JSON.stringify({
    id: incrimentalId,
    type: "call_service",
    domain: "switch",
    service: "turn_off",
    service_data: {
      entity_id: "switch.thing1", // Replace with whatever the entity ID is when copying
    },
  });
  sendMessage(message1);
  incrimentalId++;
}

function allOn() {
  console.log("lightsOn");
  // manualToggle = true;
  const message = JSON.stringify({
    id: incrimentalId,
    type: "call_service",
    domain: "switch",
    service: "turn_on",
    service_data: {
      entity_id: "switch.thing2", // Replace with whatever the entity ID is when copying
    },
  });
  sendMessage(message);
  incrimentalId++;
  const message1 = JSON.stringify({
    id: incrimentalId,
    type: "call_service",
    domain: "switch",
    service: "turn_on",
    service_data: {
      entity_id: "switch.thing1", // Replace with whatever the entity ID is when copying
    },
  });
  sendMessage(message1);
  incrimentalId++;
}
