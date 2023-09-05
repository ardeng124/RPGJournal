import React, { useState, useRef, useEffect } from 'react'
import { useNavigate} from "react-router-dom"
import AxiosService from '../AxiosService';
import SideBar from '../components/SideBar';
import ArdenImg from '../Assets/Arden.png';
import StanleyImg from '../Assets/Stanley.png';

const AboutPage = () => {
    
    const [shrink, setShrink] = useState(false);
    return (
        <section className='AboutPage'>
            <SideBar shrink={shrink} setShrink={setShrink}></SideBar>
            <section className={shrink ? `shrink` : `Page`} >
            <div className='topbar'>

                        <h1> About Page </h1>
                    </div>

                <section className='maincontent' >

                <div className='row'>
                    <div className='six columns img'>
                        <img className='img' src={ArdenImg}/>
                                <p className='text' >
                                    This is Arden, he did every single line of the code. As you can tell, he is a nerd.
                                </p>
                    </div>
                    <div className='six columns img'>
                        <img className='img' src={StanleyImg}/>

                                <p  className='text'> 
                                    This is Stanley, he came up with the idea and did the art. He also *tried* to do the 'About' page.
                                </p>
                                

                    </div>
                </div>

                </section>
            </section>
        </section>
    )
}
export default AboutPage