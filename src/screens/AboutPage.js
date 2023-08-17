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
                    <div className='row'>
                        <div className='five columns'>
                            <p>{AxiosService.getName}</p>
                        </div>
                        <div className='five columns'>
                            <h1>About</h1>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='five columns'>
                        <img className='img' src={ArdenImg}/>
                        <body className='text'>
                                <p>
                                    This is Arden, he did every single line of the code. As you can tell, he is a nerd.
                                </p>
                        </body>
                    </div>
                    <div className='five columns'>
                        <img className='img' src={StanleyImg}/>
                        <body className='text'>
                                <p>
                                    This is Stanley, he came up with the idea and did the art. He also *tried* to do the 'About' page.
                                </p>
                                
                        </body>
                    </div>
                </div>
            </section>
        </section>
    )
}
export default AboutPage