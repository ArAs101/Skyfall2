window.onload = function () {
    document.getElementById('register_button').addEventListener('click', function (ev) {
        ev.preventDefault()
        const formData = {
            username: document.getElementById('register_username_input').value,
            password: document.getElementById('register_password_input').value
        }
        console.log(JSON.stringify(formData))
        //Get form data
        //const formData = new formData(this)
        // Send POST request to server
        console.log('About to fetch')
        fetch('/register', {
            method: 'POST',
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify(formData)
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok!')
            }
            window.location.href = '/'
        }).then(data => {
            console.log('Server response: ', data)
        }).catch(error => {
            console.error('Problem with fetch operation: ', error)
        })
    })
}

