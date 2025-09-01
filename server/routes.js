const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('./db'); // Adjust path if needed

// Render login page
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// Handle login POST
router.post('/login', (req, res) => {
  const email = req.body.email && req.body.email.toLowerCase().trim();
  const { password } = req.body;

  if (!email || !password) {
    return res.render('login', { error: 'Email and Password are required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Login query error:', err);
      return res.render('login', { error: 'Database error' });
    }

    if (results.length > 0) {
      const user = results[0];
      bcrypt.compare(password, user.password, (err, match) => {
        if (err) {
          console.error('Bcrypt error:', err);
          return res.render('login', { error: 'Server error' });
        }
        if (match) {
          req.session.user = user;
          return res.redirect('/dashboard');
        } else {
          return res.render('login', { error: 'Invalid email or password' });
        }
      });
    } else {
      return res.render('login', { error: 'Invalid email or password' });
    }
  });
});

// Render signup page
router.get('/signup', (req, res) => {
  res.render('signup', { error: null });
});

// Handle signup POST
router.post('/signup', (req, res) => {
  const name = req.body.name && req.body.name.trim();
  const email = req.body.email && req.body.email.toLowerCase().trim();
  const { password } = req.body;

  if (!name || !email || !password) {
    return res.render('signup', { error: 'All fields are required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Signup query error:', err);
      return res.render('signup', { error: 'Database error' });
    }
    if (results.length > 0) {
      return res.render('signup', { error: 'Email already exists' });
    }

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error('Bcrypt hash error:', err);
        return res.render('signup', { error: 'Server error' });
      }
      db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hash],
        (err) => {
          if (err) {
            console.error('Signup insert error:', err);
            return res.render('signup', { error: 'Signup failed' });
          }
          // Signup successful, redirect to login
          res.redirect('/login');
        }
      );
    });
  });
});

// Add Expense route (protected)
router.post('/add-expense', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  const { category, amount, date, description } = req.body;
  if (!category || !amount || !date) {
    return res.render('dashboard', { user: req.session.user, expenses: [], error: 'All fields are required' });
  }
  db.query(
    'INSERT INTO expenses (user_id, category, amount, date, description) VALUES (?, ?, ?, ?, ?)',
    [req.session.user.id, category, amount, date, description],
    (err) => {
      if (err) {
        console.error('Add expense error:', err);
        return res.render('dashboard', { user: req.session.user, expenses: [], error: 'Could not add expense' });
      }
      res.redirect('/dashboard');
    }
  );
});

// Dashboard route (protected)
router.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  db.query(
    'SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC',
    [req.session.user.id],
    (err, expenses) => {
      if (err) {
        console.error('Fetch expenses error:', err);
        return res.render('dashboard', { user: req.session.user, expenses: [], error: 'Could not fetch expenses' });
      }
      res.render('dashboard', { user: req.session.user, expenses, error: null });
    }
  );
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
