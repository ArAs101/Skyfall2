window.onload = function () {
    document.getElementById('register_button').addEventListener('click', function (ev) {
        ev.preventDefault()
        const formData = {
            username: document.getElementById('register_username_input').value,
            password: document.getElementById('register_password_input').value
        }
        fetch('/register', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(formData)
        }).then(response => {
            if (response.ok) {
                alert("You have been registered!")
            }
        }).then(response => {
            window.location.href = '/login.html'
        })
    })
}