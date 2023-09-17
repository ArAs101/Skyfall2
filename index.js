window.onload = function () {
    const cookies = document.cookie
    let citiesList = document.getElementById("sidebar")
    let banner = document.createElement("h3")
    banner.textContent = 'Manage your favourite cities!'
    citiesList.append(banner)

    if (cookies.includes('myUsername')) {
        let topRightField = document.getElementById('login_register_field_top_right')
        topRightField.textContent = ''
        topRightField.textContent = 'You are currently logged in as ' + cookies.replace('isLoggedIn=true; myUsername=', '').toString() + ' '
        let logOutBtn = document.createElement("button")
        logOutBtn.type = 'submit'
        logOutBtn.textContent = 'Log Out'
        logOutBtn.addEventListener("click", async () => {
            fetch('/logout')
                .then(response => {
                    if (response.ok) {
                        document.cookie = `expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
                        alert("You are logged out!")
                        window.location.href = '/register.html'
                    } else {
                        console.error(response.status)
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
            xhr.send(JSON.stringify(city));
        })
    }

    document.getElementById('myButton').addEventListener('click', function (event) {
        event.preventDefault();
        const city = document.getElementById("myInput").value
        fetch(`http://localhost:3000/getweather?city=${city}`)
            .then(response => response.json())
            .then(response => {
                loadData(response)
                manageFavourites(response)
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

    const cookies = document.cookie
    if (cookies.includes('myUsername=')) {
        myLabel = document.createElement("h3").textContent = data.weatherState[0].description
        myResults.append(myLabel)
    } else {
        myLabel = document.createElement("h3").textContent = "Please consider logging in and registering for more information..."
        myResults.append(myLabel)
    }
}

function manageFavourites(data) {
    document.getElementById("results").style.display = 'block'
    let citiesList = document.getElementById("sidebar")
    const cookies = document.cookie
    if (cookies.includes('myUsername=')) {
        let city = data.cityName
        let newCity = document.createElement("input")
        newCity.value = city
        citiesList.append(newCity)
        let cityButton = document.createElement("button")
        cityButton.textContent = 'Search for weather data of ' + city
        citiesList.append(cityButton)
        cityButton.addEventListener("click", function (ev) {
            ev.preventDefault();
            fetch(`http://localhost:3000/getweather?city=${newCity.value}`)
                .then(response => response.json())
                .then(response => {
                    loadData(response)
                })
                .catch(error => console.error(error));
        })

        let renameButton = document.createElement("button")
        renameButton.textContent = 'Rename'// + city
        citiesList.append(renameButton)
        renameButton.addEventListener("click", function (e) {
            if (newCity.value !== null && newCity.value.trim() !== "") {
                fetch(`/rename_city?city=${newCity.value}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({city, newCity})
                })
                    .then(data => {
                        cityButton.textContent = 'Search for weather data of ' + newCity.value
                        deleteButton.textContent = 'Delete ' + newCity.value + ' from Favourites'
                    })
                    .catch((error) => {
                        console.error('Error: ', error)
                    })
            }
        })

        let deleteButton = document.createElement("button")
        deleteButton.textContent = 'Delete ' + city + ' from Favourites'
        citiesList.append(deleteButton)
        deleteButton.addEventListener("click", function (ev) {
            fetch(`http://localhost:3000/delete/:${city}`, {
                method: 'DELETE'
            })
                .then(response => {
                    console.log('Response: ' + response)
                    deleteButton.remove()
                    newCity.remove()
                    renameButton.remove()
                    cityButton.remove()
                })
                .catch(error => {
                    console.error('Error: ' + error)
                })
        })
    } else {
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