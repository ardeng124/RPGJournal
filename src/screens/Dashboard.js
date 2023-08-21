import React, { useState, useRef, useEffect } from 'react'


import { useNavigate} from "react-router-dom"
import JournalEntryListItem from '../components/JournalEntryListItem';
import AxiosService from '../AxiosService';
import SideBar from '../components/SideBar';
import createIcon from '../Assets/plus_icon.png';

const Dashboard = () => {

    const navigate = useNavigate()
    const [shrink, setShrink] = useState(false);
    const [journalItems, setJournalItems] = useState([])
    const entryClicked = (id) => {
        navigate(`/journal/${id}`)
    }
    useEffect(() => {
        AxiosService.getJournalEntries().then(response => {
            if(response.status == 401) {
                window.alert("Error: Please log in again")
                navigate('/login')
            }
            response.data.entries.forEach((x,index) => {
                let date  = new Date (x.date)
                response.data.entries[index].date = date.toGMTString().substring(0,date.toGMTString().length-3)
            })
            setJournalItems(response.data.entries)
        })
    }, []);
    
    return (
    <section className='Dashboard'>
        <SideBar shrink={shrink} setShrink={setShrink}></SideBar>
        <section className={shrink ? `shrink` : `Page`} >
        <div className='topbar'>
{/* 
                <div className='row'>
                    <div className='five columns'>
                         */}
                    <p> {AxiosService.getName}</p>
                    {/* </div> */}
                    {/* <div className='five columns'> */}
                        <h1> Journal </h1>
                    </div>
                {/* </div>  */}
        {/* </div> */}
            
        <section className='MainContent'>
            <div className='innerContent'>

            <table className="NotesTable">
                <thead>
                    <tr>
                    <th>Title</th>
                    <th>Tags</th>
                    <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                  {journalItems.map(item => <JournalEntryListItem key={item.id} id = {item.id} name={item.title} clickFunc={() => entryClicked(item.id)} tags={item.tags} date={item.date} />  )}
                  <tr></tr>
                </tbody>
                </table>
        <img src={createIcon} className={shrink ? ` createBtn shrink` : `createBtn`} onClick={() => navigate('/create')}/>

        {/* <button className={shrink ? ` editBtn shrink` : `editBtn`} onClick={() => navigate('/create')} >Create note</button> */}
            </div>
        </section>
        {/* <div className="createBtnSection">

        </div> */}
        
    </section>
        </section>
    )
}
export default Dashboard
