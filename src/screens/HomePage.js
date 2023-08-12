import React from 'react'
import logo from '../Icon.png';
import LoginButton from '../components/LoginButton.js';

export default function HomePage() {
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
