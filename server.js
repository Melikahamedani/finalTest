const final = require('./final');
const express = require('express');
const app = express()
const port = process.env.PORT || 8080;


//use
app.use((req, res) => {
    res.send('not found')
})


//Home route (GET, “/”)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,"/finalViews/home.html"));
});

//GET, “/register”
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname,"/finalViews/register.html"));
});


//POST, “/register”
app.post('/register', (req, res) => {
    final.register(req.body)
    .then(data => {
        if (data.email != undefined) {
            res.send(`${data.email} registered successfully. <br> <a href="/">Go home </a>`)
        } else {
            res.send(`Error:${data}`)
        }
    }).catch(err => {
        res.send(`Error:${err}`)
    })
})

//GET, “/signIn”
app.get('/signIn', (req, res) => {
    res.sendFile(path.join(__dirname,"/finalViews/signIn.html"));
});

//POST, “/signIn”
app.post('/signin', (req, res) => {
    final.signIn(req.body)
    .then(data => {
        res.setHeader('content-type', 'text/html')
        if (data.email) {
            res.send(`${data.email} signed in successfully.<br><a href="/">Go home </a>`)
        } else {
            res.send(`Error:${data}`)
        }
    }).catch(err => res.send(`Error: ${err}`))
})

//404 Error
app.get("*", (req, res)=>{
    res.status(404).send("Error 404: page not found.");
});

//Start the server
final.startDB().then(() => {
    app.listen(HTTP_PORT, onHttpStart);
    console.log("app is listening port 8080")
}).catch(() => {
    console.log("Unable to load data");
});