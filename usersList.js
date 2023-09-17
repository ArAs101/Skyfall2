const fs = require('fs')
let users = []
function saveUser() {
    fs.writeFile('./usersList.json', JSON.stringify(users), function (err)  {
        if (err) {
            console.log("Error: User couldn't be saved!")
        }
    })
}

function loadUser() {
    try {
        const data = fs.readFileSync('./usersList.json', 'utf8')
    } catch (err) {
        console.error('Error while loading users from file! ', err)
    }
}

function addUser(user) {
    users.push(user)
    saveUser()
}

loadUser()

module.exports = {users, addUser}