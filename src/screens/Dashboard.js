import React, { useState, useRef, useEffect } from 'react'
import icon from '../Assets/hamburgericon.png';
import followupImg from '../Assets/To-Do_Icon.png';
import journalImg from '../Assets/Icon2.png';

import { useNavigate} from "react-router-dom"
import JournalEntryListItem from '../components/JournalEntryListItem';
import axios from 'axios';
import AxiosService from '../AxiosService';
// import AxiosService from '../AxiosService';


const Dashboard = () => {

    const sidebarElement = useRef();
    const navigate = useNavigate()
    const [shrink, setShrink] = useState(false);
    const [journalItems, setJournalItems] = useState([])

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
 
    useEffect(() => {

    }, []);
    
    return (
    <section className='Dashboard'>
                    <img className='hamburger' src={icon} onClick = { () => sidebarActivate() }/>
        <div className='sidebar' ref={sidebarElement}>

            {/* <a><img className="usrImg" src={user.picture}></img></a> */}
            {/* <a class="closebtn" onClick={() => closeNav()}>&times;</a> */}


            <a><img className='sidebarIcon' src={journalImg} onClick = { () => navigate("/dashboard") }/>Journal</a>
            <a><img className='sidebarIcon' src={followupImg} onClick = { () => navigate("/followup") }/>Follow up</a>

                <a className='logoutbtnA'> <button className='logout-button'> Log out</button> </a>

        </div>
        <section className={shrink ? `shrink` : `Page`} >
        <div className='topbar'>

                <div className='row'>
                    <div className='five columns'>
                        
                    <p> {AxiosService.getName}</p>
                    </div>
                    <div className='five columns'>
                        <h1> Journal </h1>
                    </div>
                </div>
        </div>
            
        <section className='MainContent'>
            <table class="NotesTable">
                <thead>
                    <tr>
                    <th>Title</th>
                    <th>Tags</th>
                    <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                  {journalItems.map(item => <JournalEntryListItem name={item.name} tags={item.tags} date={item.date} />  )}
                  <tr></tr>
                </tbody>
                </table>

        </section>

    </section>
        </section>
    )
}
export default Dashboard
