import React,{useState, useEffect} from 'react'
import logo from '../Icon2.png';
import { useNavigate} from "react-router-dom"
import AxiosService from '../AxiosService';


const HomePage = () => {
    const navigate = useNavigate()
    const [loggedIn, setLoggedIn] = useState(false)
    useEffect( () => {
        AxiosService.validateUser().then(response => {
            if (response == "valid") {
                navigate('/dashboard')
            } 
        })
    },[])
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
                    
                    <div className='three columns'> 
                        <button class="button-primary" onClick={() => navigate("/login")}>Login</button>
                    </div>
                    <div className='three columns'> 
                        <button class="button-primary" onClick={() => navigate("/signup")}>Sign up</button>
                    </div>
                </div>
                    

            </div>
        </body>
    </section>
  )
}
export default HomePage