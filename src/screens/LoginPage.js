import React,{useState, useEffect} from 'react'
import logo from '../Icon.png';
import { useNavigate} from "react-router-dom"
import AxiosService from '../AxiosService';


const LoginPage = () => {
    const navigate = useNavigate()
    const [loggedIn, setLoggedIn] = useState(false)
    const initialState = {username: '', password: ''}

    const [formInfo, setFormInfo] = useState(initialState)
    const [errorMsg, setError] = useState("")
    const [buttonDisabled, setButtonDisabled] = useState(false)

    const updateField = (event) => {
        // which input element is this
        const name = event.target.attributes.name.value
        if (name === "username") {
            setFormInfo({...formInfo, username: event.target.value})
        } else if (name === "password") {
            setFormInfo({...formInfo, password: event.target.value})
        }
    }

    const formHandler = (event) => {
        event.preventDefault()
        setButtonDisabled(true)
        setTimeout(() => setButtonDisabled(false),1000)
        AxiosService.login(formInfo)
        .then(response => {
            if(response.status==200) {
                navigate("/dashboard")
             } 
            else if (response.status==401){
                setError("Invalid username or password")

            }
        })
    }
    useEffect( () => {
        AxiosService.validateUser().then(response => {
            if (response == "valid") {
                navigate('/dashboard')
            } 
        })
    },[])
  return (
    <section className='LoginPage'>
        <body>
            <div className='container'>
        <form onSubmit={formHandler}>
        <div class="row">
            <div class="six columns">
            <label for="usernameInput">Your username</label>
            <input class="u-full-width" type="username" placeholder="test123" name="username" onChange={updateField} required/>
            </div>
            <div class="six columns">
            <label for="usernameInput">Your password</label>
            <input class="u-full-width" type="password" placeholder="*****" name="password" onChange={updateField} required/>
            </div>
        </div>
        
        <input class="button-primary" type="submit" disabled={buttonDisabled} value="Submit"/>
        </form>
        <p className="errorText"> {errorMsg}</p> 

        </div>
        </body>
    </section>
  )
}
export default LoginPage