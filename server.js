const express = require('express')
const path = require("path");
const app = express()
const axios = require('axios')
const cookieParser = require("cookie-parser");
const session = require('express-session');
const store = new session.MemoryStore()
const bcrypt = require('bcrypt')
const fs = require('fs');
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


const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: false,
    cookie: { maxAge: oneDay },
    resave: false,
    store
}));

const users = [
    {name: 'Armin', age: 21},
    {name: 'Patrick', age: 21},
    {name: 'Lukas', age: 27},
    {name: 'Simon', age: 25},
    {name: 'Tristan', age: 21},
    {name: 'Michi', age: 19}
]

const posts = [
    {title: 'My favorite foods'},
    {title: 'My favorite games'}
]
app.get('/', (req, res) => {
    res.send({
        msg: 'Hello!',
        user: {}
    })
})

app.get('/users', (req, res) => {
    res.status(200).send(users)
})

app.post('/users', (req, res) => {
    const user = req.body
    users.push(user)
    res.status(201).send('Created User!')
})

app.get('/users/:name', (req, res) => {
    const {name} = req.params
    const user = users.find((user) => user.name === name)
    if (user) {
        res.status(200).send(user)
    } else {
        res.status(404).send('User Not Found!')
    }
})

app.get('/posts', (req, res) => {
    console.log(req.query)
    const {title} = req.query
    if (title) {
        const post = posts.find((post) => post.title === title)
        if (post) res.status(200).send(post)
    } else {
        res.status(404).send('Post Not Found!')
    }
    res.status(200).send(posts)
})

/*app.get('/',(req,res) => {
    session=req.session;
    if(session.userid){
        res.send("Welcome User <a href=\'/logout'>click to logout</a>");
    }else
        res.sendFile('views/index.html',{root:__dirname})
});*/

/*app.post('/user',(req,res) => {
    if(req.body.username == myusername && req.body.password == mypassword) {
        session = req.session;
        session.userid = req.body.username;
        console.log(req.session)
        res.send(`Hey there, welcome <a href=\'/logout'>click to logout</a>`);
    }
    else{
        res.send('Invalid username or password');
    }
})*/

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
        res.json(infoTobeSentback)
    } else {
        res.status(404).send('City not found');
    }
})

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
        jsonData[user.username] = user.password

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
    let username = req.username
    console.log(username)

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading file")
            return;
        }
        const jsonData = JSON.parse(data);
        jsonData[user.username] = user.password
        const pw = jsonData[user.OldUsername]
        delete jsonData[user.OldUsername];
        jsonData[user.username] = pw

        fs.writeFile(filePath, JSON.stringify(jsonData), (err) => {
            if (err) {
                console.log('Error writing to file!')
            }
        })
    })


})


//DELETE
/*app.delete("/userdelete", (req, res) => {

})*/

app.listen("3000")
console.log("Server listening on http://localhost:3000")