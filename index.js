function loadData(data) {
    const myResults = document.getElementById("results")

    myResults.replaceChildren()

    let myFirstline = document.createElement("h3").textContent = "Current weather in " + data.cityName + ":"
    myResults.append(myFirstline)
    let myLabel = document.createElement("h4")
    myLabel.textContent = data.temperature.toFixed(0) + " ° F / " + (data.temperature - 273.15).toFixed(0) + " ° C"
    myResults.append(myLabel)
    //account-exclusive information below...
    /*myLabel = document.createElement("h4").textContent = data.weatherState[0].description
    myResults.append(myLabel)*/

    myLabel = document.createElement("h3").textContent = "Please consider logging in or registering for more information..."
    myResults.append(myLabel)
}



window.onload = function () {
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