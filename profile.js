window.onload = function () {
    const cookies = document.cookie
    let textField = document.getElementById('Username')
    for (let cookie in cookies) {
        const [name, value] = cookies.split(',');
        if (name === 'Username') {
            textField.textContent = value
        }
    }

    const newText = textField;
    // Make an HTTP request to the server to update the data
    fetch('/username', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newText }),
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