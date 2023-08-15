import axios from 'axios'


const serverUrl = "http://localhost:8102/"

var token = document.cookie.substring(6)

var username = ""
const refreshToken = () => {
    token = document.cookie.substring(6)
}

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
const logout = () => {
    localStorage.clear()
    token = ""
    //make cookie instantly expire thus get deleted
    document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    console.log("Logging Out...")
    return "done"
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
    refreshToken()
    try {
        const response = await axios.get(serverUrl+"api/journal", { headers: { "Authorization": `Bearer ${token}` } })
        return response 
    } catch (e){
        console.log(e.response)
        return e.response
    }
}

const getJournalEntry = async (id) => {
    refreshToken()
    try {
        const response = await axios.get(serverUrl+`api/journal/${id}`, { headers: { "Authorization": `Bearer ${token}` } })
        return response 
    } catch (e){
        console.log(e.response)
        return e.response
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

const modifyEntry = async (updatedEntry,id) => {
    try {
        const response2 = await axios.put(serverUrl +`api/journal/${id}`, updatedEntry , { headers: { "Authorization": `Bearer ${token}` } })
        if (response2.data.status == 409){
            return response2
        }

        return response2
    } catch (e) {
        console.log(e)
        return e.response
    }
}
const deleteEntry = async (id) => {
    try {
        const response2 = await axios.delete(serverUrl +`api/journal/${id}`, { headers: { "Authorization": `Bearer ${token}` } })
        if (response2.data.status == 409){
            return response2
        }
        return response2
    } catch (e) {
        console.log(e)
        return e.response
    }
}
const createEntry = async (newEntry) => {
    try {
        const response2 = await axios.post(serverUrl +`api/journal/`, newEntry , { headers: { "Authorization": `Bearer ${token}` } })
        if (response2.data.status == 409){
            return response2
        }

        return response2
    } catch (e) {
        console.log(e)
        return e.response
    }
}

export default {
    getJournalEntries,
    getJournalEntry,
    login,
    register,
    validateUser,
    logout,
    modifyEntry,
    createEntry,
    deleteEntry
}