import React, { useState, useEffect } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomMessages, setRoomMessages] = useState({});
  const [rooms, setRooms] = useState([]); // State to hold room names

  // Fetch the list of rooms from the server
  const fetchRooms = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/rooms`); // Use environment variable for rooms
      const data = await response.json();
      if (data.success) {
        setRooms(data.rooms); // Set the rooms state with the fetched data
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const fetchMessages = async (room) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/messages/${room}` // Use environment variable for messages
      );
      const data = await response.json();
      if (data.success) {
        setRoomMessages((prev) => ({ ...prev, [room]: data.messages }));
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleDropdownClick = (room) => {
    // Check if the clicked room is already selected
    if (selectedRoom === room) {
      setSelectedRoom(null); // Deselect the room (close the chat)
    } else {
      setSelectedRoom(room);
      if (!roomMessages[room]) {
        fetchMessages(room); // Fetch messages if not already fetched
      }
    }
  };

  const handleRefresh = (room) => {
    fetchMessages(room); // Fetch messages again for the specific room
  };

  // Fetch rooms when the component mounts
  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-red-600 flex justify-between items-center">
        User Messages
        <button
          onClick={fetchRooms} // Add refresh button for rooms
          className="bg-yellow-500 text-white px-4 py-2 rounded-md"
        >
          Refresh Rooms
        </button>
      </h1>
      <div className="mt-4">
        {rooms.map((room, index) => (
          <div key={index} className="mb-2">
            <button
              onClick={() => handleDropdownClick(room)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              {room}
            </button>
            <button
              onClick={() => handleRefresh(room)} // Add refresh button for messages
              className="bg-green-500 text-white px-4 py-2 rounded-md ml-2"
            >
              Refresh
            </button>
            {selectedRoom === room && roomMessages[room] && (
              <div className="mt-2 p-2 border border-gray-300 rounded-md">
                {roomMessages[room].map((msg, idx) => (
                  <div key={idx}>
                    <strong>{msg.username}:</strong> {msg.messageText}{" "}
                    <em className="text-[12px]">
                      ({new Date(msg.timestamp).toLocaleString()})
                    </em>
                    <div className="text-gray-500 text-[12px]">
                      Visitor ID: {msg.visitorId} {/* Display the visitorId */}
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => handleRefresh(room)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
                >
                  Refresh
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
