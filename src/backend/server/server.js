import cors from "cors";
import express from "express";
import { WebSocketServer } from "ws";

const app = express();
const PORT = 4000;

// Create WebSocket server
const wss = new WebSocketServer({ noServer: true });

wss.on("connection", (ws) => {
  console.log("Client connected via WebSocket");
  ws.send(JSON.stringify({ message: "Connected to WebSocket server" }));
});

app.use(cors());
app.use(express.json());

// POST endpoint to add a card
app.post("/add-card", (req, res) => {
  const { front, back, hint, tags } = req.body;

  if (!front || !back) {
    return res
      .status(400)
      .json({ status: "error", message: "Front and Back are required." });
  }

  // Notify all connected WebSocket clients about the new card
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({ type: "new-card", card: { front, back, hint, tags } })
      );
    }
  });

  return res.json({ status: "ok" });
});

// Create HTTP server and handle WebSocket upgrade
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Handle WebSocket upgrade requests
server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});
