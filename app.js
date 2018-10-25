const express = require('express')
const path = require('path')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const session = require('express-session')
const expressValidator = require('express-validator')

const config = require('./config/database')
//connnect to db
mongoose.connect(config.database);
const db= mongoose.connection;
db.on('error', 
    console.error.bind(console, 'connection error:')    
)
db.once('open', () => {
    console.log('Connected to MongoDB')
})

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// set public folder
app.use(express.static(path.join(__dirname, 'public')))

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//session
app.use(session({
    secret: 'some secret',
    // resave: false,
    saveUninitialized: true
    // cookie: {secure: true}
}))

//express validator
// In this example, the formParam value is going to get morphed into form body format useful for printing.
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

//express messages
app.use(require('connect-flash')())
app.use((req, res, next) => {
    res.locals.messages = require('express-messages')(req, res);
    next()
})

//set routes
const pagesRouter = require('./routes/pages')
const adminPagesRouter = require('./routes/admin_pages')

//use routes
app.use('/', pagesRouter)
app.use('/admin/pages', adminPagesRouter)


// start server
const port = 3000

app.listen(port, ()=>{
    console.log(`server on port ${port}`)
})