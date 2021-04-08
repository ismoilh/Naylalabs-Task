if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const log4js = require("./utils/logger");
const log = log4js.getLogger();

const userRoutes = require('./routes/user');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/task';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", log.error.bind(log, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
    log.info('Database connected succesfully')
});

const app = express();

app.use(express.json());
app.use(fileUpload({}));
app.use(express.urlencoded({ extended: true }));

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';


const sessionConfig = {
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))



app.use('/v1', userRoutes);



app.get('*', (req, res) => {
    res.status(404).send('Page Not Found');
    log.error(`Page ${req.originalUrl} doesnt exist`)
})
app.post('*', (req, res) => {
    res.status(404).send('Page Not Found');
    log.error(`Page ${req.originalUrl} doesnt exist`)
})

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
    log.info(`Serving on port ${port}`)
})


