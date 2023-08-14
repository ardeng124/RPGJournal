import React, { useState, useRef, useEffect } from 'react'
import AxiosService from '../AxiosService'
import { useNavigate } from 'react-router'
import icon from '../Assets/hamburgericon.png';
import followupImg from '../Assets/To-Do_Icon.png';
import journalImg from '../Assets/Icon2.png';

const SideBar = (props) => {
    const {shrink,setShrink} = props
    const sidebarElement = useRef();
    const navigate = useNavigate()
    const logOutFunc = () => {
        AxiosService.logout()
        navigate('/')
    }
    const sidebarActivate = () => {
        console.log(shrink)
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
        <a className='logoutbtnA'> <button className='logout-button' onClick={() => logOutFunc()}> Log out</button> </a>

    </div>
    </div>
  )
}

export default SideBar  