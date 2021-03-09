const express = require('express');
const cors = require('cors');
const createError = require('http-errors');
const HttpCodes = require('./utils/HttpCodes');
const bodyParser = require('body-parser')
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');

require('./storage/db');
const auth = require('./routes/auth');
const api = require('./routes/api');

const app = express();
const server = require('http').Server(app);
// const io = require('socket.io')(server);

app.use(morgan());
app.use(cors({
    origin: "http://localhost:3000", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // allow session cookie from browser to pass through
}));

app.use(bodyParser.json());
app.use(session({
    secret: 'keyboard cat'
}));


app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});


// Routes for login/logout
app.use("/auth", auth);

// All routes below here need authentication
function isAuthenticated(req, res, next) {
    if (!req.user)
        return next(createError(HttpCodes.UNAUTHENTICATED));
    next();
}
app.use(isAuthenticated);

// API
app.use("/api/v1", api);

// Not Found. Catch all requests that fall through.
app.use((req, res, next) => {
    next(createError(HttpCodes.NOT_FOUND));
})

// Error Handler
app.use((err, req, res, next) => {
    //Remove for production
    console.error(err);
    res.status(err.status || HttpCodes.INTERNAL);
    res.json({ error: err.message });
})


const port = 8080;
server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});