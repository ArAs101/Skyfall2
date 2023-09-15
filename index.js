window.onload = function () {
    // Check if the 'isLoggedIn' cookie exists and is set to true
    const cookies = document.cookie.split('; ')
    let isLoggedIn;

    for (let index in cookies) {
        if (cookies[index].trim().startsWith('isLoggedIn') === true) {
            console.log("Logged in!")
            let topRightField = document.getElementById('login_register_field_top_right')
            topRightField.textContent = ''
            const cookies = document.cookie.split('; ')
            let isLoggedIn = false;

            for (let index in cookies) {
                console.log("Looking for username")
                if (cookies[index].trim().startsWith('myUsername')) {


                    console.log("Found the username: " + cookies[index].trim().valueOf())
                    topRightField.textContent = 'You are currently logged in as ' + cookies[index].replace('myUsername=', '').toString() + ' '
                }
            }
            let logOutBtn = document.createElement("button")
            logOutBtn.type = 'submit'
            logOutBtn.textContent = 'Log Out'
            logOutBtn.addEventListener("click", async () => {
                //isLoggedIn = false
                /*try {
                    const response = */
                fetch('/logout')
                    .then(response => {
                        if (response.ok) {
                            console.log('OK')
                            alert("You are logged out!")
                        } else {
                            console.log(response.status)
                        }
                    }).catch((e) => {
                    console.log('Error: ' + e)
                })

            })

            let settingsBtn = document.createElement("button")
            settingsBtn.type = 'submit'
            settingsBtn.textContent = 'Edit Profile'
            settingsBtn.addEventListener("click", function () {
                window.location.href = 'profile.html'
            })
            topRightField.append(settingsBtn)
            topRightField.append(logOutBtn)
            /*console.log("Found the cookie: " + cookies[index].trim().valueOf())
            isLoggedIn = true;*/

            break
        } else {

            console.log("Not logged in!")
        }
    }

    //let citesList = document.getElementById("sidebar")

    let addButton = document.getElementById('add_city_button')
    addButton.addEventListener("click", async function (evt) {
        evt.preventDefault();
        const city = document.getElementById("city_adder").value

        const xhr = new XMLHttpRequest();
        const url = new URL("/addcity", location.href);

        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/json");

        console.log("Still on Frontend; " + JSON.stringify(city));
        xhr.send(JSON.stringify(city));

        /*fetch(`http://localhost:3000/addcity?city=${city}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify(city),
        })
            .then(response => {
                console.log("Got so far...")
                if (response.ok) {

                    //return response.json()
                } else {
                    console.log('Not ok')
                    throw new Error('POST failed!')
                }
            })
            .then(data => {
                console.log("In the middle of adding a Favourite via POST! " + data);
                manageFavourites(data)
            })
            .catch(error => console.error(error));*/
    })


    document.getElementById('myButton').addEventListener('click', function (event) {
        event.preventDefault();
        const city = document.getElementById("myInput").value

        fetch(`http://localhost:3000/getweather?city=${city}`)
            .then(response => response.json())
            .then(response => {
                console.log(response);
                loadData(response)
                manageFavourites(response)
            })
            .catch(error => console.error(error));
    })
    /*    let addButton = document.getElementById('add_city_button')
        let citesList = document.getElementById('sidebar')
        citesList.append(addButton)*/
}

function loadData(data) {
    const myResults = document.getElementById("results")
    myResults.replaceChildren()

    let myFirstline = document.createElement("h3").textContent = "Current weather in " + data.cityName + ":"
    myResults.append(myFirstline)
    let myLabel = document.createElement("h4")
    myLabel.textContent = data.temperature.toFixed(0) + " ° F / " + (data.temperature - 273.15).toFixed(0) + " ° C"
    myResults.append(myLabel)


    // Check if the 'isLoggedIn' cookie exists and is set to true
    const cookies = document.cookie
    let isLoggedIn = false;


    const [name, value] = cookies.split('=');
    if (name === 'isLoggedIn') {
        isLoggedIn = true;
    }

    //account-exclusive information below...
    if (isLoggedIn === true) {
        myLabel = document.createElement("h3").textContent = data.weatherState[0].description
        myResults.append(myLabel)
    } else {
        myLabel = document.createElement("h3").textContent = "Please consider logging in and registering for more information..."
        myResults.append(myLabel)
    }

    //document.querySelector('ul')

    /*deleteButton.addEventListener("click", function () {
        const xhr = new XMLHttpRequest()
        xhr.open("DELETE", '/citydelete:' + city)
        xhr.setRequestHeader("Content-Type", "application/json")

        xhr.onload = function () {
            if (xhr.status === 200) {
                const badCity = document.querySelector(city)
                badCity.remove()
                deleteButton.remove()
                console.log(data.cityName + " deleted!")
            }
        }

        xhr.send()
    })*/
}

/*

myLabel = document.createElement("h3").textContent = "Please consider logging in or registering for more information..."
myResults.append(myLabel)
}*/

function manageFavourites(data) {
    document.getElementById("results").style.display = 'block'
    let city = data.cityName

    let citesList = document.getElementById("sidebar")
    let newCity = document.createElement("li")
    newCity.textContent = data.cityName
    citesList.append(newCity)
    let cityButton = document.createElement("button")
    cityButton.textContent = 'Search for weather data of ' + data.cityName
    citesList.append(cityButton)
    cityButton.addEventListener("click", function (ev) {
        ev.preventDefault();


        fetch(`http://localhost:3000/getweather?city=${city}`)
            .then(response => response.json())
            .then(response => {
                console.log("Trying to obtain weather data for Favourite!");
                loadData(response)
            })
            .catch(error => console.error(error));
    })

    let renameButton = document.createElement("button")
    renameButton.textContent = 'Rename ' + city
    citesList.append(renameButton)
    renameButton.addEventListener("click", function (e) {
        console.log('Need to implement renaming!')


    })

    let deleteButton = document.createElement("button")

    deleteButton.textContent = 'Delete ' + city + ' from Favourites'
    citesList.append(deleteButton)
    console.log("Trying to delete " + city)
    deleteButton.addEventListener("click", function (ev) {
        fetch(`http://localhost:3000/delete/${city}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                console.log("Getting response " + data);
                if (data.success()) {
                    deleteButton.remove()
                }
            })
            .catch(error => console.error(error));
    })
}