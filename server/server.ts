import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = 5173;

app.use(cors());
app.use(express.json());

// POST /add-card endpoint
app.post("/add-card", (req: Request, res: Response) => {
  const { front, back, hint, tags } = req.body;

  if (!front || !back) {
    res.status(400).json({ status: "error", message: "Front and Back are required." });
    return;
  }

  console.log("Received new card:", {
    front,
    back,
    hint,
    tags,
  });

  res.json({ status: "ok" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});