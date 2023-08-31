const express = require('express')
const path = require("path");
const app = express()
const axios = require('axios')
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const API_KEY = 'c3f5d777155024ea1c2c209f90f0f34e';


app.use(express.static(path.join(__dirname)));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

//username and password
const myusername = 'user1'
const mypassword = 'mypassword'

// a variable to save a session
var session;


const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

app.get('/',(req,res) => {
    session=req.session;
    if(session.userid){
        res.send("Welcome User <a href=\'/logout'>click to logout</a>");
    }else
        res.sendFile('views/index.html',{root:__dirname})
});

app.post('/user',(req,res) => {
    if(req.body.username == myusername && req.body.password == mypassword) {
        session = req.session;
        session.userid = req.body.username;
        console.log(req.session)
        res.send(`Hey there, welcome <a href=\'/logout'>click to logout</a>`);
    }
    else{
        res.send('Invalid username or password');
    }
})

app.get("/getweather", async function (req, res) {
    // Access the city ID from the request query parameters

    const city = req.query.city; // use a query parameter to get the city
    const geo_api_response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`);

    if (geo_api_response.data[0]) {
        const lat = geo_api_response.data[0].lat
        const lon = geo_api_response.data[0].lon

        const owm_response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const cityName = geo_api_response.data[0].name
        const temperature = owm_response.data.main.temp;
        const state = owm_response.data.weather;
        const infoTobeSentback = {
            "cityName": cityName,
            "temperature": temperature,
            "weatherState": state
        }
        res.json(infoTobeSentback)
    } else {
        res.status(404).send('City not found');
    }
})

/*PUT
app.put("/username", (req, res) => {

})*/


/*DELETE
app.delete("/userdelete", (req, res) => {

})*/

app.listen("3000")
console.log("Server listening on http://localhost:3000")