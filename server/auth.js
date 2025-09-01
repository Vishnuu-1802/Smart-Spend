/**
 * Middleware to check if the user is authenticated via session.
 * If authenticated, proceed to next middleware/route handler.
 * Otherwise, redirect to the homepage or login page.
 */
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        // Optionally, you can add a flash message or logging here
        return res.redirect('/');
    }
}

module.exports = { isAuthenticated };
