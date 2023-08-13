import React,{useState, useEffect} from 'react'
import logo from '../Icon.png';
import { useNavigate} from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from '../components/LoginButton.js';

const HomePage = () => {
    const navigate = useNavigate()

    const [loggedIn, setLoggedIn] = useState(false)
    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return <h1>Loading ...</h1>;
    }
    if (isAuthenticated){
        navigate("/Dashboard")
    }

  return (
    <section className='HomePage'>
        <body>
            <div className='container'>
                <div className='row'>
                    <img src={logo}/>

                </div>
                <div className='row'>

                    <h1>RPG Journal</h1>
                </div>
                <div className='row'>

                    <LoginButton></LoginButton>
{/*                     
                    <div className='three columns'> 
                        <button class="button-primary">Login</button>
                    </div>
                    <div className='three columns'> 
                        <button class="button-primary">Sign up</button>
                    </div> */}
                </div>
                    

            </div>
        </body>
    </section>
  )
}
export default HomePage