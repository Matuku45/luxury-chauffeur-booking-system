const express = require("express");
const session = require("express-session");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const DATA_FILE = path.join(__dirname, "users.json");

// --- SESSION SETUP (use in your main app.js) ---
// const app = express();
// app.use(express.json());
// app.use(session({
//   secret: "supersecretkey",
//   resave: false,
//   saveUninitialized: false,
//   cookie: { maxAge: 1000 * 60 * 60 * 2 } // 2 hours
// }));

// --- Helper Functions ---
const readUsers = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const writeUsers = (users) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
};

// --- Seed Default Users ---
const seedDefaultUsers = () => {
  const users = readUsers();
  if (users.length === 0) {
    const defaultUsers = [
      {
        id: 1,
        name: "Admin User",
        email: "admin@example.com",
        phone: "0000000000",
        password: "admin123",
        role: "admin",
      },
      {
        id: 2,
        name: "Regular User",
        email: "user@example.com",
        phone: "1111111111",
        password: "user123",
        role: "user",
      },
    ];
    writeUsers(defaultUsers);
    console.log("Default users seeded!");
  }
};
seedDefaultUsers();

// ===================== CRUD ROUTES =====================

// CREATE (Signup)
router.post("/signup", (req, res) => {
  const { name, email, phone, password, role } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const users = readUsers();
  const exists = users.find((u) => u.email === email);
  if (exists) return res.status(400).json({ message: "Email already exists" });

  const newUser = {
    id: users.length + 1,
    name,
    email,
    phone,
    password,
    role: role || "user", // optional role
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

  // Create session (in-memory)
  req.session.user = { id: user.id, name: user.name, role: user.role };
  req.session.save();

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
