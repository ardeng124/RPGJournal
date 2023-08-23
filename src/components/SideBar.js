import React, { useState, useRef, useEffect } from 'react'
import AxiosService from '../AxiosService'
import { useNavigate } from 'react-router'
import icon from '../Assets/hamburgericon.png';
// import followupImg from '../Assets/To-Do_Icon.png';
// import followupImg from '../Assets/followupicon.png';
// import journalImg from '../Assets/Icon2.png';
// import aboutImg from '../Assets/About Icon.png';
// import tagsImg from '../Assets/Public_icon.png';
import followupImg from '../Assets/followupicon2.png';
import journalImg from '../Assets/journalicon.png';
import aboutImg from '../Assets/abouticon.png';
import tagsImg from '../Assets/tagsicon.png';

const SideBar = (props) => {
    const {shrink,setShrink} = props
    const sidebarElement = useRef();
    const navigate = useNavigate()
    const logOutFunc = () => {
        AxiosService.logout()
        navigate('/')
    }
    const sidebarActivate = () => {
        if(shrink) {
            sidebarElement.current.style.width = "50px";
            setShrink(false)

        } else {
            sidebarElement.current.style.width = "200px";
            setShrink(true)
        }
    }
  return (
    <div>
        <img className='hamburger' src={icon} onClick = { () => sidebarActivate() }/>
    <div className='sidebar' ref={sidebarElement}>
        <a onClick = { () => navigate("/dashboard")}> <img className='sidebarIcon' src={journalImg} />Journal</a>
        <a onClick={ () => navigate("/followup")}> <img className='sidebarIcon' src={followupImg} />Follow Up</a>
        <a onClick={ () => navigate("/tags")}> <img className='sidebarIcon' src={tagsImg} />Tags</a>
        <a onClick={ () => navigate("/about")}> <img className='sidebarIcon' src={aboutImg} />About</a>
        <a className='logoutbtnA'> <button className='logout-button' onClick={() => logOutFunc()}> Log out</button> </a>

    </div>
    </div>
  )
}

export default SideBar  