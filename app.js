const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware with environment variable secret and secure defaults
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret_key', // Use env secret
    resave: false,
    saveUninitialized: false, // Recommended false for login sessions
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));

// View engine setup for EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
const routes = require('./server/routes');
app.use('/', routes);

// 404 handler (optional)
app.use((req, res) => {
    res.status(404).send('404 - Page not found');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
