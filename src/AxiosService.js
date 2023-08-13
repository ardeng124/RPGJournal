import axios from 'axios'


const serverUrl = "http://localhost:8102/"

var token = document.cookie.substring(6)

var username = ""


const validateUser = async () => {
    token = document.cookie.substring(6)
    const response = await axios.get(serverUrl + "api/auth/", { headers: { "Authorization": `Bearer ${token}` } })
    if (response.data.status === "unregistered") {
        return "invalid"
    } else {
        token = response.data.token
        return "valid"
    }
}

const login = async (newUser) => {
    //do some stuff with cookies
    console.log(newUser)
    const response2 = await axios.post(serverUrl + "auth/login/", newUser)
    if (response2.data.status == 401){
        return response2
    }

    token = response2.data.token
    const expiration_date = new Date()
    let expires = new Date(Date.now() + 86400 * 1000).toUTCString()
    document.cookie = `token=${token}; SameSite=None` + expires + ";path=/;"
    localStorage.setItem('name',response2.data.name)

    return response2
}


const getJournalEntries = async () => {
    try {
        console.log(token)
        const response = await axios.get("http://localhost:8102/api/journal", { headers: { "Authorization": `Bearer ${token}` } })
    } catch (e){
        console.log(e)

    }
}

const register = async (newUser) => {
    //do some stuff with cookies
    const response2 = await axios.post(serverUrl + "auth/register/", newUser)
    if (response2.data.status == 409){
        return response2
    }
    token = response2.data.token
    // localStorage.setItem('token',token)
    const expiration_date = new Date()
    let expires = new Date(Date.now() + 86400 * 1000).toUTCString()
    document.cookie = `token=${token}; SameSite=None` + expires + ";path=/;"
    localStorage.setItem('username',username)
    return response2
}

export default {
    getJournalEntries,
    login,
    register,
    validateUser
}