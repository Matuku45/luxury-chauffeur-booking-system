// ------------------------------
// IMPORT MODULES (ES MODULE)
// ------------------------------
import fs from "fs";

// ------------------------------
// DATABASE URL
// ------------------------------
const DATABASE_URL = "https://roomap-aa517-default-rtdb.firebaseio.com";

// ------------------------------
// IMAGE PATH
// ------------------------------
const IMAGE_PATH =
  "C:/Users/Thabiso/luxury-chauffeur-booking-system/src/assets/pic3.webp";

// ------------------------------
// CONVERT IMAGE TO BASE64
// ------------------------------
function convertImageToBase64(path) {
  try {
    const imageBuffer = fs.readFileSync(path);
    const base64Image = imageBuffer.toString("base64");

    return `data:image/webp;base64,${base64Image}`;
  } catch (error) {
    console.error("Image conversion error:", error);
  }
}

// ------------------------------
// GET ROOMS
// ------------------------------
async function getRooms() {
  try {
    const response = await fetch(`${DATABASE_URL}/rooms.json`);
    const data = await response.json();

    console.log("Rooms:");
    console.log(data);

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

// ------------------------------
// ADD ROOM
// ------------------------------
async function addRoom(room) {
  try {
    const response = await fetch(`${DATABASE_URL}/rooms.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(room),
    });

    const data = await response.json();

    console.log("Room added:");
    console.log(data);
  } catch (error) {
    console.error("Add error:", error);
  }
}

// ------------------------------
// UPDATE ROOM
// ------------------------------
async function updateRoom(roomId, updatedData) {
  try {
    await fetch(`${DATABASE_URL}/rooms/${roomId}.json`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    console.log("Room updated");
  } catch (error) {
    console.error("Update error:", error);
  }
}

// ------------------------------
// DELETE ROOM
// ------------------------------
async function deleteRoom(roomId) {
  try {
    await fetch(`${DATABASE_URL}/rooms/${roomId}.json`, {
      method: "DELETE",
    });

    console.log("Room deleted");
  } catch (error) {
    console.error("Delete error:", error);
  }
}

// ------------------------------
// CREATE ROOM WITH IMAGE
// ------------------------------
async function createRoomWithImage() {
  const base64Image = convertImageToBase64(IMAGE_PATH);

  const room = {
    title: "Student Room",
    location: "Pretoria",
    price: 2500,
    available: true,
    image: base64Image,
  };

  await addRoom(room);
}

// ------------------------------
// TEST EXECUTION
// ------------------------------
(async () => {
  console.log("Uploading room...");

  await createRoomWithImage();

  console.log("Fetching rooms...");

  await getRooms();
})();