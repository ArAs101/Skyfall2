window.onload = function () {
    document.getElementById('register_button').addEventListener('click', function (ev) {
        ev.preventDefault()
        const formData = {
            username: document.getElementById('register_username_input').value,
            password: document.getElementById('register_password_input').value
        }
        console.log(JSON.stringify(formData))

        fetch('/register', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(formData)
        }).then(response => {
            console.log('Sent data to the Backend!')
            if (response.ok) {
                alert("You have been registered!")
            }
        }).then(response => {
            window.location.href = '/login.html'
        })

/*        //Get form data
        // Send POST request to server
        console.log('About to fetch')
        fetch('/register', {
            method: 'POST',
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify(formData)
        }).then(response => {
            console.log(response.ok)
            console.log("Response might be ok")
            if (!response.ok) {
                console.log("Response: ", response)
                //throw new Error('Network response was not ok!')
            }
        }).then(data => {
            console.log('Server response: ', data)
            //window.location.href = 'index.html'
        }).catch(error => {
            console.log("Oh no")
            console.error('Problem with fetch operation: ', error)
        })*/
    })
}