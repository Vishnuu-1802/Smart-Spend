const express = require("express");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const MySQLStore = require("express-mysql-session")(session);

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// MySQL session store configuration
const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

// Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session configuration
app.use(session({
    key: 'smartspend_sid',
    secret: process.env.SESSION_SECRET || 'smartspend_secret_key',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,
        secure: false, // Set true if using HTTPS
    }
}));

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

// Routes
const routes = require("./server/routes");
app.use("/", routes);

// 404 handler
app.use((req, res) => {
    res.status(404).send("404 - Page not found");
});

// Start the server
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
