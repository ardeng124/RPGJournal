import React, { useState, useRef, useEffect } from 'react'
import icon from '../Assets/hamburgericon.png';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate} from "react-router-dom"
import LogoutButton from '../components/LogoutButton';
import JournalEntryListItem from '../components/JournalEntryListItem';


const Dashboard = () => {
    const items = [
        {
          id: 1,
          name: 'AAA',
          tags: "",
          date: "12/04/23"
        },
        {
            id: 2,
            name: 'BBB',
            tags: "Follow Up",
            date: "15/03/23"
        },
        {
            id: 3,
            name: 'C1234123413243121241234312312123123412341234124124123CC',
            tags: "",
            date: "1/07/24"
        },
      ]
    const sidebarElement = useRef();
    const navigate = useNavigate()
    const [shrink, setShrink] = useState(false);
    const { user, isAuthenticated, isLoading } = useAuth0();
    const [journalItems, setJournalItems] = useState([])
    const openNav = () => {
        sidebarElement.current.style.width = "200px";
        setShrink(true);
    }
    
    const closeNav = () => {
        sidebarElement.current.style.width = "0";
        setShrink(false)
    }
    useEffect(() => {   
        setJournalItems(items)


    },[])
    if (isLoading) {
        return <h1>Loading ...</h1>;
    }

    if(!isLoading && !isAuthenticated) {
        navigate("/")
    }

    return (
    <section className='Dashboard'>
        <div className='sidebar' ref={sidebarElement}>

            <a><img className="usrImg" src={user.picture}></img></a>
            <a href="javascript:void(0)" class="closebtn" onClick={() => closeNav()}>&times;</a>


            <a>Journal</a>
            <a>Follow up</a>
            <div className='profileSection'>
                <a className='logoutbtnA'> <LogoutButton/> </a>
            </div>
        </div>
        <section className={shrink ? `shrink` : `Page`} >
            
        <div className='topbar'>

                <div className='row'>
                    <div className='five columns'>
                    <img className='hamburger' src={icon} onClick = { () => openNav() }/>
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
