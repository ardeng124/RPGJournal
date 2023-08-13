import axios from 'axios'
import { createAuth0Client } from '@auth0/auth0-spa-js';
import { useAuth0 } from "@auth0/auth0-react";

const serverUrl = "/"

var token = "" 
var username = ""
const { getAccessTokenSilently } = useAuth0();

const auth0 = await createAuth0Client({
    domain: 'dev-ahyf2hi5h6vaqo21.au.auth0.com',
    clientId: '4itJLproEx75Uv48FH7WLCwzNaeQbCUa'
  });

const validateUser = async () => {
    const user = await auth0.getUser();
    return user
}

const getJournalEntries = async () => {
    const accessToken = await auth0.getTokenSilently();
    console.log(getAccessTokenSilently)
    const result = await fetch('http://localhost:8102/api/journal', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  });

}

export default {
    getJournalEntries,
    validateUser
}