const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

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
};

let switchState;
let manualToggle = false; // Flag to track manual switch toggles

socket.onmessage = (event) => {
  try {
    const receivedData = JSON.parse(event.data);
    if (receivedData.type === "result" && Array.isArray(receivedData.result)) {
      const resultArray = receivedData.result;
      let background = document.getElementById("background");
      for (let i = 0; i < resultArray.length; i++) {
        let currentEntry = resultArray[i];
        if (currentEntry.entity_id === "switch.thing2") {
          switchState = currentEntry.state;
          const iotThing = document.getElementById("switch");
          if (switchState === "on") {
            iotThing.checked = true;
            background.classList.remove("on", "off");
            background.classList.add("on");
          } else {
            iotThing.checked = false;
            background.classList.remove("on", "off");
            background.classList.add("off");
          }
          break;
        }
      }
    } else {
      console.warn(
        "Received data does not match the expected format:",
        receivedData
      );
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
  manualToggle = false;
};

socket.onclose = (event) => {
  console.log("WebSocket connection closed:", event);
};

function sendMessage(message) {
  console.log("Sending message:", message);
  socket.send(message);
}

let incrimentalId = 1;

//Add this function to get the current state of the switch
function getCurrentSwitchState() {
  const message = JSON.stringify({
    id: incrimentalId,
    type: "get_states",
  });
  incrimentalId++;
  sendMessage(message);
}

// Call getCurrentSwitchState every second
setInterval(() => {
  if (!manualToggle) {
    getCurrentSwitchState();
  }
}, 2000);

// Call getCurrentSwitchState immediately when the page loads
getCurrentSwitchState();

function toggleSwitch() {
  manualToggle = true;
  const message = JSON.stringify({
    id: incrimentalId,
    type: "call_service",
    domain: "switch",
    service: "Toggle",
    service_data: {
      entity_id: "switch.thing2", // Replace with your switch entity ID
    },
  });
  sendMessage(message);
  incrimentalId++;
}
