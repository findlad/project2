const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

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
let manualToggle = false; // Flag to track manual switch toggles
//process recieved messages
socket.onmessage = (event) => {
  try {
    // console.log(event);
    const receivedData = JSON.parse(event.data);

    if (
      receivedData.type === "event"
      // && Array.isArray(receivedData.result)
    ) {
      // let background = document.getElementById("background");

      console.log(receivedData.event);

      if (receivedData.event.data.entity_id === "switch.thing2") {
        thing2State = receivedData.event.data.new_state.state === "on";

        let switchPic = document.getElementById("switch");
        let div = document.getElementById("bedroomLamp");

        if (thing2State) {
          //if its on, check the toggleswithc, and add "on" to the body
          div.innerHTML("on");
          document.getElementById("switch").src = "img_ONlamp.png";
          // switchPic.src = "img_ONlamp.png";
        } else {
          div.innerHTML("off");
          document.getElementById("switch").src = "img_OFFlamp.png";
          // switchPic.src = "img_OFFlamp.png";
        }
      }
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
      if (
        receivedData.event.data.entity_id ===
        "sensor.smart_scale_c1_real_time_weight"
      ) {
        //console.log(receivedData);

        const instantWeight = receivedData.event.data.new_state.state;
        console.log(instantWeight);
        if (instantWeight >= 0) {
          console.log("Instant Weight: " + instantWeight);
          weightArray.push(Number(instantWeight));
          console.log("Weight Array: " + weightArray);

          if (instantWeight < 30) {
            weightArray.splice(0, 3);
            weightArray.splice(weightArray.length - 3, 3);
            console.log("trimmed Weight Array: " + weightArray);
            aveWeight = calculateMean(weightArray);
            console.log("average weight = " + aveWeight);
            let stabilityIndex =
              Math.max(...weightArray) - Math.min(...weightArray);
            const weightbox = document.getElementById("weightbox");
            weightbox.innerHTML = aveWeight.toFixed(1) + " Kg";
            const stablebox = document.getElementById("stablebox");
            stablebox.innerHTML = stabilityIndex.toFixed(1);
          }
        }
        // if (
        //   receivedData.event.data.entity_id ===
        //   "binary_sensor.g8t1_sj02_3294_01vr_motion"
        // ) {
        //   const closeModalButton = document.getElementById("closeModalButton");
        //   const modal = document.getElementById("modalBox");
        //   modal.style.display = "flex";

        //   // Clear the previous chart, if any
        //   const modalContent = document.querySelector(".modal-content");
        //   modalContent.innerHTML =
        //     '<canvas>  <iframe src="URL_TO_YOUR_HOME_ASSISTANT_LOVELACE_UI" width="100%"          height="600px" frameborder="0" allowfullscreen></iframe> </canvas>';

        //   closeModalButton.addEventListener("click", () => {
        //     modal.style.display = "none";
        //   });
        // }
      }

      // initial state sensing

      if (
        receivedData.type === "result" &&
        Array.isArray(receivedData.result)
      ) {
        const resultArray = receivedData.result;
        console.log(resultArray);
        for (let i = 0; i < resultArray.length; i++) {
          let currentEntry = resultArray[i];
          if (currentEntry.entity_id === "switch.thing2") {
            switchState = currentEntry.state;
            const iotThing = document.getElementById("thing2");
            if (switchState === "on") {
              iotThing.src = "img_ONlamp.png";
            } else {
              iotThing.src = "img_OFFlamp.png";
            }

            //console.log(switchState);
            switchContainer.classList.remove("on", "off"); //Remove both classes
            switchContainer.classList.add(switchState); // Add the current state as a class
            break;
          }
        }
      } else {
        // console.warn(
        //   "Received data does not match the expected format:",
        //   receivedData
        // );
      }
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

function allOff() {
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

// const closeModalButton = document.getElementById("closeModalButton");
// const modal = document.getElementById("modalBox");
// modal.style.display = "flex";

// // Clear the previous chart, if any
// const modalContent = document.querySelector(".modal-content");
// modalContent.innerHTML = '<canvas id="graph"></canvas>';

// closeModalButton.addEventListener("click", () => {
//   modal.style.display = "none";
// });
