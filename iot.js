const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

// Function to calculate the mean of an array
function calculateMean(array) {
  // Check if the array is not empty
  if (array.length === 0) {
    return 0; // or you can choose to return NaN or any other value
  }

  // Calculate the sum of the array elements
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    array[i] = Number.array[i];
    sum += array[i];
  }

  // Calculate the mean
  let mean = sum / array.length;

  return mean;
}

const socket = new WebSocket("ws://homeassistant.local:8123/api/websocket");

socket.onopen = (event) => {
  //console.log("WebSocket connection opened:", event);

  // Authenticate with Home Assistant
  socket.send(
    JSON.stringify({
      type: "auth",
      access_token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI1NGI2YTM5ZjhiZDU0ZjIxOGFlYzk5ZWNmYTA1OTU0NiIsImlhdCI6MTY5OTU2NjQzMSwiZXhwIjoyMDE0OTI2NDMxfQ.QbRxVeZxj0GxG-_4DvdoZrXlzfcUWBr-Dx0zr3Pt4GI", // Replace with your access token
    })
  );

  // Listen to changes sent by IOT
  // socket.send(
  //   JSON.stringify({
  //     id: incrimentalId,
  //     type: "subscribe_events",
  //   })
  // );
};
let weightArray = [];
let switchState;
let manualToggle = false; // Flag to track manual switch toggles
//process recieved messages
socket.onmessage = (event) => {
  try {
    const receivedData = JSON.parse(event.data);

    if (
      receivedData.type === "event"
      // && Array.isArray(receivedData.result)
    ) {
      let background = document.getElementById("background");
      const iotThing = document.getElementById("switch");

      // console.log("receivedData.event");

      if (receivedData.event.data.entity_id === "switch.thing2") {
        const switchState = receivedData.event.data.new_state.state === "on";

        if (switchState) {
          //if its on, check the toggleswithc, and add "on" to the body
          iotThing.checked = true;
          background.classList.remove("on", "off");
          background.classList.add("on");
        } else {
          iotThing.checked = false; //if its off, check the toggle switch, and add "off" to the body
          background.classList.remove("on", "off");
          background.classList.add("off");
        }
      }
      if (
        receivedData.event.data.entity_id ===
        "binary_sensor.presence_sensor_fp2_1708_presence_sensor_1"
      ) {
        const fall = true;
        console.log("fall detected");
        const fallbox = document.getElementById("fallbox");
        fallbox.innerHTML = "FALL";
        fallbox.classList.remove("fall");
        fallbox.classList.add("fall");
      }
      if (
        receivedData.event.data.entity_id ===
        "sensor.smart_scale_c1_real_time_weight"
      ) {
        console.log(receivedData);

        const instantWeight = receivedData.event.data.new_state.state;
        console.log(instantWeight);
        if ((instantWeight = !undefined)) {
          weightArray.push(instantWeight);
          console.log(weightArray);
        }
        if ((instantWeight = 0)) {
          weightArray.splice(0, 3);
          weightArray.splice(weightArray.length - 3, 3);
          aveWeight = calculateMean(weightArray);
        }
        const weightbox = document.getElementById("weightbox");
        weightbox.innerHTML = "Weight: " + aveWeight;
      }

      // add listener for the other sensors

      // if (
      //   receivedData.type === "result" &&
      //   Array.isArray(receivedData.result)
      // ) {
      //   const resultArray = receivedData.result;
      //   for (let i = 0; i < resultArray.length; i++) {
      //     let currentEntry = resultArray[i];
      //     if (
      //       currentEntry.entity_id ===
      //       "binary_sensor.presence_sensor_fp2_1708_presence_sensor_1"
      //     ) {
      //       //when we find sensor......
      //       console.log(currentEntry);
      //       break;
      //     }
      //   }
      // } else {
      //   console.warn(
      //     "Received data does not match the expected format:",
      //     receivedData
      //   );
      // }
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }

  // manualToggle = false; // make sure we know the button hasnt been pushed in the last wee bit
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
  const message = JSON.stringify({
    id: incrimentalId,
    type: "get_states",
  });
  incrimentalId++;
  sendMessage(message);
}

// Call getCurrentSwitchState every 2 seconds, unless theres been a manual switch recently
setInterval(() => {
  getCurrentState();
}, 2000);

// Call getCurrentSwitchState immediately when the page loads
getCurrentState();

//tell the switch to toggle
function toggleSwitch() {
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
