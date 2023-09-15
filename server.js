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
const favouriteCities = require('./usersList.json');
const {readUserData, writeUserData} = require('./usersList.json')
const {users, addUser} = require("./usersList");
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

/*//username and password
const myusername = 'user1'
const mypassword = 'mypassword'*/

// a variable to save a session
//var session;
app.use(bodyParser.json())

/*app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(__dirname));
app.use(cookieParser());
app.use(
    session({
        secret: "thisisasecretthatnooneshouldknow",
        resave: false,
        saveUninitialized: true,
        cookie: {maxAge: oneDay}
    })
);*/




const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: false,
    cookie: { maxAge: oneDay },
    resave: false,
    store
}));

app.get('/logout',(req, res) => {
    req.session.destroy();
    //req.clearCookie()
    res.json('User successfully logged out!').status(200)
    //res.redirect('test.html');
});



app.post('/register', (req, res) => {
    //console.log('Registering...')

    const {username, password} = req.body
    const userExists = users.some(user => user.username === username)
    if (userExists) {
        console.log('User already exists!')
        res.json({success: false, message: 'This user already exists!'})
    } else {
        let newUser = {username: username, password: password}
        addUser(newUser)
        console.log('User successfully registered!')
        res.json({success: true, message: 'User successfully registered!'})
    }

    /*const userData = readUserData()
    // Check if the username or email is already in use
    const isDuplicate = userData.some(user => user.username === username || user.password === password);

    /!*if (isDuplicate) {
        res.status(400).json({ message: 'Username or email is already in use' });
    } else {*!/
        // Add the new user to the user data
        userData.push({ username, password });

        // Write the updated user data back to the file
        writeUserData(userData);

        res.status(201).json({ message: 'User registered successfully' });*/
    //}
    //const newEntry = fs.readFileSync('/usersList.json', 'utf8')

})


app.post('/login', (req, res) => {
    const {username, password} = req.body
    const userId = users.find((user) => user.username === username)
    if (userId && userId.password === password) {
        req.session.user = userId
        res.json({success: true})
    } else {
        console.log('User successfully logged in!')
        res.json({success: false, message: 'User successfully logged in!'})
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
        console.log(infoTobeSentback)
        /*if (!favouriteCities.includes(cityName, 0)) {
            favouriteCities.push(cityName)
            console.log(cityName + ", Favourites: " + favouriteCities.toString())
        } else console.log("NO!")*/
        res.json(infoTobeSentback)
    } else {
        res.status(404).send('City not found');
    }
})

/*
app.get("/getcity", async function (req, res) {
    const city = req.query.city; // use a query parameter to get the city
    const geo_api_response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`);

    if (geo_api_response.data[0]) {
        const lat = geo_api_response.data[0].lat
        const lon = geo_api_response.data[0].lon

        //const owm_response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const cityName = geo_api_response.data[0].name
        const infoTobeSentback = {
            "cityName": cityName
        }
        console.log(infoTobeSentback)
        //cities.push(cityName)
        res.json(infoTobeSentback)
    } else {
        res.status(404).send('City not found');
    }
})
*/





app.post("/addcity", async function (req, res) {
    const city = req.query.city; // use a query parameter to get the city
    const geo_api_response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`);

    if (geo_api_response.data[0]) {
        /*const lat = geo_api_response.data[0].lat
        const lon = geo_api_response.data[0].lon

        //const owm_response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
*/        const cityName = geo_api_response.data[0].name
        const infoTobeSentback = {
            "cityName": cityName
        }
        console.log("Backend reached; " + infoTobeSentback)
        //pushCity(cityName)
        //favouriteCities.(cityName)
        //favouriteCities
        res.status(200).json(infoTobeSentback)
    } else {
        res.status(404).send('City not found');
    }
})

/*

function validateAuthToken (req, res, next) {
    console.log('Inside Validate Auth Token function')
    const {authorization} = req.headers
    if (authorization && authorization === '123') {
        next()
    } else {
        res.status(403).send({msg: 'Forbidden, Incorrect Credentials!'})
    }
}

app.post('/posts', validateAuthToken, (req, res) => {
    const post = req.body
    posts.push(post)
    res.status(201).send(post)
})

function validateCookie (req, res, next) {
    const {cookies} = req
    if ('session_Id' in cookies) {
        console.log('Session ID exists!')
        if (cookies.session_Id === '1234567') {
            next()
        } else {
            res.status(403).send({msg: 'Not Authenticated!'})
        }
    }
}

app.get('/signin', (req, res) => {
    res.cookie('session_Id', '123456')
    res.status(200).json({msg: 'Logged in.'})
})

app.get('/protected', validateCookie, (req, res) => {
    res.status(200).json({msg: 'You are authorized!'})
})

app.post('/login', (req, res) => {
    console.log(req.sessionID)
    const {username, password} = req.body
    console.log(req.body, "Login body")
    if (username && password) {
        console.log("Username & Password exist!")
        if (req.session.authenticated) {
            res.json(req.session)
            console.log("Test")
        } else {
            console.log("Not authenticated yet!")
            fs.readFile("usersList.json", (err, data) => {
                data = JSON.parse(data)
                console.log(data)
                if (data[username] !== undefined) {
                    console.log("Username not undefined!")
                    if (data[username] === password) {
                        req.session.authenticated = true
                        req.session.user = {
                            username, password
                        }
                        //res.cookie('isLoggedIn', true)
                        console.log("Sucessful read!")

                        res.json(req.session)
                    } else {
                        res.status(403).json({msg: 'Bad Credentials!'})
                    }
                }
            })
        }
    } else {
        res.status(403).json({msg: 'Bad Credentials!'})
    }
})

app.post('/register', async (req, res) => {
    const user = req.body
    console.log(req.body, "BODY")
    //console.log(user.password)
    const hashedPassword = await bcrypt.hashSync(user.password.toString(), 10).toString();
    //const var = {key: value, key:value}
    const filePath = 'usersList.json';

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading file")
            return;
        }
        const jsonData = JSON.parse(data);
        jsonData[user.username] = hashedPassword

        fs.writeFile(filePath, JSON.stringify(jsonData), (err) => {
            if (err) {
                console.log('Error writing to file!')
            }
        })
    })
    // Specify the file path const filePath = 'example.txt';  // Use the fs.writeFile method to write to the file fs.writeFile(filePath, data, (err) => {   if (err) {     console.error('Error writing to file:', err);   } else {     console.log('File has been written successfully.');   } });
    res.status(200)
})

//PUT
app.put("/username", (req, res) => {
    const user = req.body
    console.log(user)
    const filePath = 'usersList.json';
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading file")
            return;
        }
        const jsonData = JSON.parse(data);
        const pw = jsonData[user.oldUsername]
        delete jsonData[user.oldUsername];
        jsonData[user.username] = pw
        console.log(jsonData)
        fs.writeFile(filePath, JSON.stringify(jsonData), (err) => {
            if (err) {
                console.log('Error writing to file!')
            }
            res.sendStatus(200)
        })
    })
})
*/

app.put('/cities', (req, res) => {
    //let citiesList = req.body

    
})


//DELETE
/*app.delete(`/delete/:city`, (req, res) => {
    console.log("Backend trying to delete city")

    res.status(200)
    /!*const cityList = document.getElementById("sidebar")
    const badCity = parseInt(req.params.id)
    const bcIndex = citydelete.findIndex(city => city.id === cityId)

    if (bcIndex === -1) {
        res.status(404).json("Index not found!")
    } else {
        citydelete.splice(bcIndex, 1)
        res.status(204).send()
    }*!/
})*/

app.listen("3000")
console.log("Server listening on http://localhost:3000")