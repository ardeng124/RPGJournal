import React,{useState, useEffect} from 'react'
import logo from '../Icon.png';
import { useNavigate} from "react-router-dom"
import AxiosService from '../AxiosService';


const SignupPage = () => {
    const navigate = useNavigate()
    const [loggedIn, setLoggedIn] = useState(false)
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [errorMsg, setError] = useState("")

    const initialState = {username: '', password: '',firstName:'',lastName:'',email:'',repeatPassword:"" }
    useEffect( () => {
        AxiosService.validateUser().then(response => {
            if (response == "valid") {
                navigate('/dashboard')
            } 
        })
    },[])
    const [formInfo, setFormInfo] = useState(initialState)

    const updateField = (event) => {
        // which input element is this
        const name = event.target.attributes.name.value
        if (name === "username") {
            setFormInfo({...formInfo, username: event.target.value})
        } else if (name === "password") {
            setFormInfo({...formInfo, password: event.target.value})
        } else if (name === "repeatPassword") {
            setFormInfo({...formInfo, repeatPassword: event.target.value})
        } else if (name === "firstName") {
            setFormInfo({...formInfo, firstName: event.target.value})
        } else if (name === "lastName") {
            setFormInfo({...formInfo, lastName: event.target.value})
        } else if (name === "email") {
            setFormInfo({...formInfo, email: event.target.value})
        }
    }
    const formHandler = (event) => {
        event.preventDefault()
        setButtonDisabled(true)
        setTimeout(() => setButtonDisabled(false),2000)

        console.log(formInfo)
        if (formInfo.password === formInfo.repeatPassword) {
            AxiosService.register(formInfo)

        .then(response => {
            console.log(response)
            if(response.status=200) {
                setButtonDisabled(true)
                navigate("/dashboard")
            }
        })
        } else {
            //todo: Error handling
            //INSERT ERROR HANDLING
        }
    }
  return (
    <section className='LoginPage'>
        <body>
            <div className='container'>
        <form onSubmit={formHandler}>
        <div class="row">
            <div class="six columns">
            <label for="usernameInput">First name</label>
            <input class="u-full-width" type="name" placeholder="John" name="firstName" onChange={updateField} required/>
            </div>
            <div class="six columns">
            <label for="usernameInput">Last name</label>
            <input class="u-full-width" type="name" placeholder="Smith" name="lastName" onChange={updateField} required/>
            </div>
        </div>
        <div className='row'>
            <div class="six columns">
                <label for="usernameInput">Username</label>
                <input class="u-full-width" type="name" placeholder="Johns123" name="username" onChange={updateField} required/>
            </div>
            <div class="six columns">
                <label for="usernameInput">Email</label>
                <input class="u-full-width" type="email" placeholder="john@test.com" name="email" onChange={updateField} required/>
            </div>
        </div>
        <div className='row'>
        <div class="six columns">
                <label for="usernameInput">Password</label>
                <input class="u-full-width" type="password" placeholder="****" name="password" onChange={updateField} required/>
            </div>
            <div class="six columns">
            <label for="usernameInput">Repeat password</label>
            <input class="u-full-width" type="password" placeholder="****" name="repeatPassword" onChange={updateField} required/>
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
export default SignupPage