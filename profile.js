window.onload = function () {
    const cookies = document.cookie.split('; ')

    const data = {

    }
    let textField = document.getElementById('Username')
    for (let index in cookies) {
        if (cookies[index].trim().startsWith('myUsername')) {
            let returnCookie = cookies[index].trim().split("=")
            textField.value = returnCookie[1]
            data[oldUsername] = returnCookie[1]
            break
        }
    }
// Make an HTTP request to the server to update the data
    fetch('/username', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({oldUsername, textField.value})
    })
        .then(response => {
            if (response.ok) {
                console.log('Data updated successfully on the server.');
                window.location.href = '/index.html'
            } else {
                console.error('Failed to update data on the server.');
            }
        })
        .catch(error => {
            console.error('An error occurred:', error);
        });
}