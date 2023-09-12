window.onload = function () {
    const cookies = document.cookie.split('; ')

    let oldUsername = ""
    let textField = document.getElementById('Username')

    for (let index in cookies) {
        if (cookies[index].trim().startsWith('myUsername')) {
            let returnCookie = cookies[index].trim().split("=")
            document.cookie = returnCookie[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
            break
        }
    }


    document.getElementById("submitButton").addEventListener("click", function (event) {
        // Make an HTTP request to the server to update the data
        fetch('/username', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"oldUsername": oldUsername, "username": textField.value})
        })
            .then(response => {
                if (response.ok) {
                    console.log('Data updated successfully on the server.');

                    addCookie('myUsername', textField.value)
                    window.location.href = '/index.html'
                } else {
                    console.error('Failed to update data on the server.');
                }
            })
            .catch(error => {
                console.error('An error occurred:', error);
            });
    })

    document.getElementById("deleteAccountButton").addEventListener("click", function (event) {
        fetch('/userdelete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"username": textField.value})
        }).then(response => {
            if (response.ok) {
                console.log('Account deleted successfully on the server.');
                //window.location.href = '/index.html'
            } else {
                console.error('Failed to update data on the server.');
            }
        }).catch(error => {
                console.error('An error occurred:', error);
            });
    })
}