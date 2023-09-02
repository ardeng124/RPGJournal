import axios from 'axios'
import FollowUpFormEntry from './components/FollowUpFormEntry'


const serverUrl = "http://localhost:8102/"

var token = document.cookie.substring(6)

var username = ""
const refreshToken = () => {
    token = document.cookie.substring(6)
}
//TODO: finish this function
const refreshLocalName = async () => {
//     let localStr = localStorage.get('firstName')
//     if(!localStr || localStr=='undefined') {
//         refreshToken()
//         if (token != 'undefined') {
//             const response = await 
//         }
//     }
}
const validateUser = async () => {
    token = document.cookie.substring(6)
    refreshToken()
    if (!token) return "invalid"
    const response = await axios.get(serverUrl + "api/auth/", { headers: { "Authorization": `Bearer ${token}` } })
    if (response.data.status === "unregistered") {
        return "invalid"
    } else {
        token = response.data.token
        return "valid"
    }
}
const logout = async () => {
    localStorage.clear()
    token = ""
    //make cookie instantly expire thus get deleted
    document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    return "token deleted"
}
const login = async (newUser) => {
    //do some stuff with cookies

    try {
        const response2 = await axios.post(serverUrl + "auth/login/", newUser)
        token = response2.data.token
        const expiration_date = new Date()
        let expires = new Date(Date.now() + 86400 * 1000).toUTCString()
        document.cookie = `token=${token}; SameSite=None` + expires + ";path=/;"
        localStorage.setItem('firstName',response2.data.name)
    
        return response2
    } catch (e){

        return e.response
    }
    
}


const getJournalEntries = async () => {
    refreshToken()
    try {
        const response = await axios.get(serverUrl+"api/journal", { headers: { "Authorization": `Bearer ${token}` } })
        return response 
    } catch (e){
        return e.response
    }
}

const getTagJournalEntries = async (id) => {
    refreshToken()
    try {
        const response = await axios.get(serverUrl+`api/tags/${id}`, { headers: { "Authorization": `Bearer ${token}` } })
        return response 
    } catch (e){
        return e.response
    }
}

const getFollowupJournalEntries = async () => {
    refreshToken()
    try {
        const response = await axios.get(serverUrl+"api/followup", { headers: { "Authorization": `Bearer ${token}` } })
        return response 
    } catch (e){
        return e.response
    }
}

const getJournalEntry = async (id) => {
    refreshToken()
    try {
        const response = await axios.get(serverUrl+`api/journal/${id}`, { headers: { "Authorization": `Bearer ${token}` } })
        return response 
    } catch (e){
        return e.response
    }
}

const register = async (newUser) => {
    try {
        const response2 = await axios.post(serverUrl + "auth/register/", newUser)
        token = response2.data.token
        // localStorage.setItem('token',token)
        const expiration_date = new Date()
        let expires = new Date(Date.now() + 86400 * 1000).toUTCString()
        document.cookie = `token=${token}; SameSite=None` + expires + ";path=/;"
        localStorage.setItem('username',username)
        return response2

    } catch (e) {
        return e.response
    }
}

const modifyEntry = async (updatedEntry,id) => {

    refreshToken()
    let followupItem = {
        followup:updatedEntry.followupCheck,
        date:updatedEntry.followupDate,
        lvl:updatedEntry.followupLvl
    }
    if(followupItem.followup != 'null') updatedEntry.followup = followupItem
    try {
        const response2 = await axios.put(serverUrl +`api/journal/${id}`, updatedEntry , { headers: { "Authorization": `Bearer ${token}` } })
        if (response2.data.status == 409){
            return response2
        }

        return response2
    } catch (e) {
        return e.response
    }
}
const deleteEntry = async (id) => {
    refreshToken()
    try {
        const response2 = await axios.delete(serverUrl +`api/journal/${id}`, { headers: { "Authorization": `Bearer ${token}` } })
        if (response2.data.status == 409){
            return response2
        }
        return response2
    } catch (e) {
        return e.response
    }
}
const createEntry = async (newEntry) => {

    refreshToken()
    let followupItem = {
        followup:newEntry.followupCheck,
        date:newEntry.followupDate,
        lvl:newEntry.followupLvl
    }
    newEntry.followup = followupItem
    try {
        const response2 = await axios.post(serverUrl +`api/journal/`, newEntry , { headers: { "Authorization": `Bearer ${token}` } })
        if (response2.data.status == 409){
            return response2
        }

        return response2
    } catch (e) {
        return e.response
    }
}


const createTag = async (newTag) => {
    refreshToken()
    const tag = {"name":newTag}
    try {
        const response2 = await axios.post(serverUrl +`api/tags/`, tag , { headers: { "Authorization": `Bearer ${token}` } })
        if (response2.data.status == 409){
            return response2
        }
        return response2
    } catch (e) {
        return e.response
    }
}

const getTags = async () => {
    refreshToken()
    try {
        const response = await axios.get(serverUrl+"api/tags/", { headers: { "Authorization": `Bearer ${token}` } })
        return response 
    } catch (e){
        return e.response
    }
}
const editTag = async (id, data) => {
    refreshToken()
    let updatedEntry = {name:data}
    try {
        const response2 = await axios.put(serverUrl +`api/tags/${id}`, updatedEntry , { headers: { "Authorization": `Bearer ${token}` } })
        if (response2.data.status == 409){
            return response2
        }

        return response2
    } catch (e) {
        return e.response
    }

}

const deleteTag = async (id) => {
    refreshToken()
    try {
        const response2 = await axios.delete(serverUrl +`api/tags/${id}`, { headers: { "Authorization": `Bearer ${token}` } })
        if (response2.data.status == 409){
            return response2
        }
        return response2
    } catch (e) {
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
    deleteEntry,
    getFollowupJournalEntries,
    createTag,
    editTag,
    getTags,
    deleteTag,
    getTagJournalEntries
}