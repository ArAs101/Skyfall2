window.onload = function () {
    document.getElementById('login_button').addEventListener('click', function (ev) {
        ev.preventDefault()
        const formData = {
            username: document.getElementById('login_username_input').value,
            password: document.getElementById('login_password_input').value
        }
        fetch('/login', {
            method: 'POST',
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify(formData)
        }).then(response => {
            if (response.ok) {
                alert("You have been logged in!")
            } else {
                console.log("Response: ", response)
                throw new Error('Network response was not ok!')
            }

        }).then(data => {
            window.location.href = '/'
            console.log('Server response: ', data)
            addCookie('isLoggedIn', true)
            console.log(formData.username)
            addCookie('myUsername', formData.username); // Sets a cookie named 'myCookie' that expires in 7 days

        }).catch(error => {
            console.error('Problem with fetch operation: ', error)
        })
    })
}
function addCookie(name, value) {
    document.cookie = `${name}=${value}; `
}
