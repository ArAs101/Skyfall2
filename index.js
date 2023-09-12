window.onload = function () {
    // Check if the 'isLoggedIn' cookie exists and is set to true
    const cookies = document.cookie.split('; ')
    let isLoggedIn = false;

    for (let index in cookies) {
        if (cookies[index].trim().startsWith('isLoggedIn')) {
            isLoggedIn = true;
            break
        }
    }



    if (isLoggedIn) {
        console.log("Logged in!")
        let topRightField = document.getElementById('login_register_field_top_right')

        let logOutBtn = document.createElement("button")
        logOutBtn.type = 'submit'
        logOutBtn.textContent = 'Log Out'
        logOutBtn.addEventListener("click", function () {
            isLoggedIn = false
            window.location.href = 'index.html'
        })

        let settingsBtn = document.createElement("button")
        settingsBtn.type = 'submit'
        settingsBtn.textContent = 'Edit Profile'
        settingsBtn.addEventListener("click", function () {
            window.location.href = 'profile.html'
        })
        topRightField.append(settingsBtn)
        topRightField.append(logOutBtn)
    } else {
        console.log("Not logged in!")
    }
    document.getElementById('myButton').addEventListener('click', function(event) {
        event.preventDefault();
        const city = document.getElementById("myInput").value

        fetch(`http://localhost:3000/getweather?city=${city}`)
            .then(response => response.json())
            .then(response => {
                console.log(response);
                loadData(response)
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


    // Check if the 'isLoggedIn' cookie exists and is set to true
    const cookies = document.cookie
    let isLoggedIn = false;


    const [name, value] = cookies.split('=');
    if (name === 'isLoggedIn' && value === 'true') {
        isLoggedIn = true;
    }

    //account-exclusive information below...
    if (isLoggedIn) {
        myLabel = document.createElement("h4").textContent = data.weatherState[0].description
        myResults.append(myLabel)
        myLabel = document.createElement("h3").textContent = "Please consider logging in or registering for more information..."
        myResults.append(myLabel)
    }
}
    /*

    myLabel = document.createElement("h3").textContent = "Please consider logging in or registering for more information..."
    myResults.append(myLabel)
}*/



