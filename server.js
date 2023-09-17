const express = require('express')
const path = require("path");
const app = express()
const axios = require('axios')
const cookieParser = require("cookie-parser");
const session = require('express-session');
const store = new session.MemoryStore()
const bcrypt = require('bcrypt')
const fs = require('fs');
const bodyParser = require('body-parser')
const {readUserData, writeUserData} = require('./usersList.json')
const {users, addUser} = require("./usersList");
const {hash} = require("bcrypt");
const API_KEY = 'c3f5d777155024ea1c2c209f90f0f34e';


app.use(express.static(path.join(__dirname)));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


app.use((req, res, next) => {
    console.log(store)
    console.log(`${req.method}, ${req.url}`)
    next()
})


app.use(bodyParser.json())

const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: false,
    cookie: { maxAge: oneDay },
    resave: false,
    store
}));


let favouriteCities = []

//GET for logging out
app.get('/logout',(req, res) => {
    req.session.destroy();
    res.json('User successfully logged out!').status(200)
});

//POST for registering
app.post('/register', (req, res) => {
    const {username, password} = req.body
    const userExists = users.some(user => user.username === username)
    if (userExists) {
        console.log('User already exists!')
        res.json({success: false, message: 'This user already exists!'})
    } else {
        let newUser = {
            username: username,
            password: bcrypt.hash(password, 10, (error, hash) => {
                if (error) {
                    console.error('Error while hashing: ', error)
                }
            })
        }
        addUser(newUser)
        console.log('User successfully registered!' + newUser.username + ", " + newUser.password)
        res.json({success: true, message: 'User successfully registered!'})
    }
})

//POST for logging in
app.post('/login', (req, res) => {
    const {username, password} = req.body
    const userId = users.find((user) => user.username === username)
    if (userId && userId.password === password) {
        req.session.user = userId
        res.json({success: true})
    } else {
        res.json({success: false, message: 'User successfully logged in!'})
    }
})

//GET for main search field
app.get("/getweather", async function (req, res) {
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
        favouriteCities.push(cityName)
        res.status(200).json(infoTobeSentback)
    } else {
        res.status(404).send('City not found');
    }
})

//POST for retrieving weather data for a Favourite
app.post("/get_favourite_weather", async function (req, res) {
    const city = req.query.city; // use a query parameter to get the city
    const geo_api_response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`);

    if (geo_api_response.data[0]) {
        const cityName = geo_api_response.data[0].name
        const infoTobeSentback = {
            "cityName": cityName
        }
        console.log("Backend reached; " + infoTobeSentback)
        favouriteCities.push(cityName)
        console.log(favouriteCities)
        res.status(200).json("favouriteCities: " + favouriteCities + "; " + infoTobeSentback)
    } else {
        res.status(404).json('City not found');
    }
})

//PUT for changing Favourite's name
app.put('/rename_city', (req, res) => {
    const oldCityName = req.body.city;
    const newCityName = req.body.newCity;
    const cityToUpdateIndex = favouriteCities.findIndex(city => city === oldCityName);

    if (cityToUpdateIndex !== -1) {
        favouriteCities[cityToUpdateIndex] = newCityName;
        res.status(200).json({ message: 'City name updated successfully'})
    } else {
        res.status(404).json({ message: 'City not found!' });
    }
});

//DELETE a Favourite city
app.delete('/delete/:city', (req, res) => {
    const cityToDelete = req.params.city;
    const index = favouriteCities.findIndex(cityToDelete => !cityToDelete)

    favouriteCities.splice(index, 1)

    res.status(200).json({message: 'City deleted successfully', favouriteCities})
});

app.listen("3000")
console.log("Server listening on http://localhost:3000")