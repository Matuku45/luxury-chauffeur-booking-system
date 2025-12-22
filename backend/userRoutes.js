const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const DATA_FILE = path.join(__dirname, "users.json");

// Helper: Read users from file
const readUsers = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// Helper: Write users to file
const writeUsers = (users) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
};

// CREATE (Signup)
router.post("/signup", (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const users = readUsers();

  // Check if email already exists
  const exists = users.find((u) => u.email === email);
  if (exists) return res.status(400).json({ message: "Email already exists" });

  const newUser = {
    id: users.length + 1,
    name,
    email,
    phone,
    password, // For now plain text; hash later with bcrypt
  };

  users.push(newUser);
  writeUsers(users);

  res.status(201).json({ message: "User signed up", user: newUser });
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  res.json({ message: "User logged in", user });
});

// READ ALL USERS
router.get("/", (req, res) => {
  const users = readUsers();
  res.json(users);
});

// READ ONE USER
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const users = readUsers();
  const user = users.find((u) => u.id == id);

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
});

// UPDATE USER
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const users = readUsers();
  const userIndex = users.findIndex((u) => u.id == id);

  if (userIndex === -1) return res.status(404).json({ message: "User not found" });

  const updatedUser = { ...users[userIndex], ...req.body };
  users[userIndex] = updatedUser;
  writeUsers(users);

  res.json({ message: "User updated", user: updatedUser });
});

// DELETE USER
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  let users = readUsers();
  const user = users.find((u) => u.id == id);

  if (!user) return res.status(404).json({ message: "User not found" });

  users = users.filter((u) => u.id != id);
  writeUsers(users);

  res.json({ message: `User ${id} deleted` });
});

module.exports = router;
