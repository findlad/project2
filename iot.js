const socket = new WebSocket("ws://homeassistant.local:8123/api/websocket");

socket.onopen = (event) => {
  console.log("WebSocket connection opened:", event);

  // Authenticate with Home Assistant
  socket.send(
    JSON.stringify({
      type: "auth",
      access_token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI1NGI2YTM5ZjhiZDU0ZjIxOGFlYzk5ZWNmYTA1OTU0NiIsImlhdCI6MTY5OTU2NjQzMSwiZXhwIjoyMDE0OTI2NDMxfQ.QbRxVeZxj0GxG-_4DvdoZrXlzfcUWBr-Dx0zr3Pt4GI", // Replace with your access token
    })
  );

  // Subscribe to events (optional)
  socket.send(
    JSON.stringify({
      type: "subscribe_events",
    })
  );
};

let switchState;

socket.onmessage = (event) => {
  try {
    const receivedData = JSON.parse(event.data);

    // Check if the received data is an object with a 'result' property
    if (receivedData.type === "result" && Array.isArray(receivedData.result)) {
      const resultArray = receivedData.result;
      for (let i = 0; i < resultArray.length; i++) {
        let currentEntry = resultArray[i];
        if (currentEntry.entity_id === "switch.thing2") {
          switchState = currentEntry.state;
          //console.log(switchState);
          switchContainer.classList.remove("on", "off"); //Remove both classes
          switchContainer.classList.add(switchState); // Add the current state as a class
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
setInterval(getCurrentSwitchState, 500);

// Call getCurrentSwitchState immediately when the page loads
getCurrentSwitchState();

function toggleSwitch() {
  // Example: Send a command to turn on Switch
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
