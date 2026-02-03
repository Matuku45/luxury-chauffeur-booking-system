const express = require("express");
const session = require("express-session");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const DATA_FILE = path.join(__dirname, "users.json");

// ===================== SESSION SETUP (use in your main app.js) =====================
// const app = express();
// app.use(express.json());
// app.use(session({
//   secret: "supersecretkey",
//   resave: false,
//   saveUninitialized: false,
//   cookie: { maxAge: 1000 * 60 * 60 * 2 } // 2 hours
// }));

// ===================== HELPER FUNCTIONS =====================
const readUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (err) {
    return [];
  }
};

const writeUsers = (users) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
};

// Seed default users if file is empty
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

// ===================== ROUTES =====================

// CREATE (Signup) — role is always user
router.post("/signup", (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const users = readUsers();
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    phone,
    password,
    role: "user", // force role as user
  };

  users.push(newUser);
  writeUsers(users);

  const { password: pwd, ...userData } = newUser;
  res.status(201).json({ message: "User signed up", user: userData });
});

// LOGIN — role is returned
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  const users = readUsers();
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(404).json({ message: "User does not exist" });
  if (user.password !== password) return res.status(401).json({ message: "Incorrect password" });

  // Save session
  req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };
  req.session.save();

  const { password: pwd, ...userData } = user;
  res.json({ message: "Login successful", user: userData });
});

// GET all users
router.get("/", (req, res) => {
  const users = readUsers().map(({ password, ...rest }) => rest);
  res.json(users);
});

// GET single user
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const user = readUsers().find((u) => u.id == id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const { password, ...userData } = user;
  res.json(userData);
});

// UPDATE user
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const users = readUsers();
  const idx = users.findIndex(u => u.id == id);
  if (idx === -1) return res.status(404).json({ message: "User not found" });

  const updatedUser = { ...users[idx], ...req.body };
  users[idx] = updatedUser;
  writeUsers(users);

  const { password, ...userData } = updatedUser;
  res.json({ message: "User updated", user: userData });
});

// DELETE user
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  let users = readUsers();
  if (!users.find(u => u.id == id)) return res.status(404).json({ message: "User not found" });

  users = users.filter(u => u.id != id);
  writeUsers(users);

  res.json({ message: `User ${id} deleted` });
});

module.exports = router;
