const cookies = document.cookie//.split('; ')
window.onload = function () {

    let citiesList = document.getElementById("sidebar")
    let banner = document.createElement("h3")
    banner.textContent = 'Manage your favourite cities!'
    citiesList.append(banner)

    console.log(cookies)
    if (cookies.includes('myUsername=')) {
        console.log('Logged in')
        let topRightField = document.getElementById('login_register_field_top_right')
        topRightField.textContent = ''
        topRightField.textContent = 'You are currently logged in as ' + cookies.replace('isLoggedIn=true; myUsername=', '').toString() + ' '
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
                        document.cookie = `expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
                        alert("You are logged out!")
                        window.location.href = '/register.html'
                    } else {
                        console.log(response.status)
                    }
                }).catch((e) => {
                console.log('Error: ' + e)
            })
        })
        topRightField.append(logOutBtn)

        let addButton = document.createElement("button")
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
    } else {
        console.log('Not logged in. NAH no results in the sidebar for you!')
        /*let loginButton = document.createElement("button")
        let registerButton = document.createElement("button")

        citiesList.replaceChildren(banner)
        loginButton.textContent = 'Login'
        loginButton.addEventListener("click", function () {
            window.location.href = 'login.html'
        })

        registerButton.textContent = 'Register'
        registerButton.addEventListener("click", function () {
            window.location.href = 'register.html'
        })

        banner.textContent = 'Please register and log in to see your favourite cities!'

        document.getElementById('sidebar').append(loginButton)
        document.getElementById('sidebar').append(registerButton)
        banner.textContent = 'Manage your favourite cities when logged in!'
        citiesList.append(banner)*/
    }


/*
    } else {
        console.log('Or not...')


    }*/

    //}
    /*if (cookies.includes('isLoggedIn=')) {
        console.log("Logged in!")

    } else {

        console.log("Not logged in!")
        console.log(cookies)
    }*/
    //}

    document.getElementById('myButton').addEventListener('click', function (event) {
        event.preventDefault();
        const city = document.getElementById("myInput").value

        fetch(`http://localhost:3000/getweather?city=${city}`)
            .then(response => response.json())
            .then(response => {
                console.log('The response: ', response);
                loadData(response)
                console.log('Data: ' + response)
                console.log('After load function')
                //if (cookies.includes('myUsername')) {
                    manageFavourites(response)
                //}

            })
            .catch(error => console.error(error));
    })
}

function loadData(data) {
    const myResults = document.getElementById("results")
    myResults.replaceChildren()

    let myFirstline = document.createElement("h3").textContent = "Current weather in " + data.cityName + ":"
    myResults.append(myFirstline)
    let myLabel = document.createElement("h4")
    myLabel.textContent = data.temperature.toFixed(0) + " ° F / " + (data.temperature - 273.15).toFixed(0) + " ° C"
    myResults.append(myLabel)


    //const cookies = document.cookie
    if (cookies.includes('myUsername=')) {
        console.log('You are logged in!')
        myLabel = document.createElement("h3").textContent = data.weatherState[0].description
        myResults.append(myLabel)
    } else {
        myLabel = document.createElement("h3").textContent = "Please consider logging in and registering for more information..."
        myResults.append(myLabel)
        console.log('NAH no more info for you')
    }
}


function manageFavourites(data) {
    document.getElementById("results").style.display = 'block'

    //const cookies = document.cookie.split('; ')
    //const cookies = document.cookie
    let citiesList = document.getElementById("sidebar")
    //const cookies = document.cookie
    if (cookies.includes('myUsername=')) {

        let city = data.cityName
        let newCity = document.createElement("input")
        newCity.value = data.cityName
        citiesList.append(newCity)
        let cityButton = document.createElement("button")
        cityButton.textContent = 'Search for weather data of ' + data.cityName
        citiesList.append(cityButton)
        cityButton.addEventListener("click", function (ev) {
            ev.preventDefault();
            fetch(`http://localhost:3000/getweather?city=${newCity}`)
                .then(response => response.json())
                .then(response => {
                    console.log("Trying to obtain weather data for Favourite " + newCity + "!");
                    loadData(response)
                })
                .catch(error => console.error(error));
        })

        let renameButton = document.createElement("button")
        renameButton.textContent = 'Rename ' + city
        citiesList.append(renameButton)
        renameButton.addEventListener("click", function (e) {
            console.log('Need to implement renaming!')
            if (newCity.value !== null && newCity.value.trim() !== "") {
                fetch(`/cities?city=${newCity.value}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({city: newCity.value})
                })
                    .then(data => {
                        console.log('Response within PUT: ', data)
                    })
                    .catch(error => {
                        console.error('Error: ', error)
                    })
            }
        })

        let deleteButton = document.createElement("button")

        deleteButton.textContent = 'Delete ' + city + ' from Favourites'
        citiesList.append(deleteButton)
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
    } else {
        console.log('NAH no results in the sidebar for you!')
        let loginButton = document.createElement("button")
        let registerButton = document.createElement("button")
        let banner = document.createElement("h3")
        banner.textContent = 'Manage your favourite cities!'
        citiesList.replaceChildren(banner)
        loginButton.textContent = 'Login'
        loginButton.addEventListener("click", function () {
            window.location.href = 'login.html'
        })

        registerButton.textContent = 'Register'
        registerButton.addEventListener("click", function () {
            window.location.href = 'register.html'
        })

        banner.textContent = 'Please register and log in to see your favourite cities!'

        document.getElementById('sidebar').append(loginButton)
        document.getElementById('sidebar').append(registerButton)
    }
}