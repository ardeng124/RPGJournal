import React, { useState, useRef, useEffect } from 'react'


import { useNavigate} from "react-router-dom"
import FollowUpListItem from '../components/FollowUpListItem';
import AxiosService from '../AxiosService';
import SideBar from '../components/SideBar';

const FollowupPage = () => {
    const navigate = useNavigate()
    const [shrink, setShrink] = useState(false);
    const [journalItems, setJournalItems] = useState([])
    const [lvlItems, setlvlItems] = useState([])
    const [dateItems, setDateItems] = useState([])
    const entryClicked = (id) => {
        navigate(`/journal/${id}`)
    }
    useEffect(() => {
        AxiosService.getFollowupJournalEntries().then(response => {
            if(response.status == 401) {
                window.alert("Error: Please log in again")
                navigate('/login')
            }
            console.log(response.data.entries2)
            response.data.entries2.forEach((x,index) => {
                let date  = new Date (x.date)
                response.data.entries2[index].date = date.toGMTString().substring(0,date.toGMTString().length-3)
            })
            setJournalItems(response.data.entries2)

            setlvlItems(response.data.entries2.filter(x => x.followup.lvl && x.followup.lvl != "null"))
            setDateItems(response.data.entries2.filter(x => x.followup.date && x.followup.date != "null"))

        })
    }, []);
    
    return (
    <section className='FollowUpPage'>
        <SideBar shrink={shrink} setShrink={setShrink}></SideBar>
        <section className={shrink ? `shrink` : `Page`} >
        <div className='topbar'>

                <div className='row'>
                    <div className='five columns'>
                        
                    <p> {AxiosService.getName}</p>
                    </div>
                    <div className='five columns main'>
                        <h1> Come back when....</h1>
                    </div>
                </div>
        </div>
            
        <section className='MainContent'>
            <div className='row'>
                <div className=' six columns' >
                    <table class="followupTable">
                        <caption>LEVEL</caption>
                        <thead>
                            <tr>
                            <th className='titleTh'>Title</th>
                            <th className='lvlTh'>Level:</th>
                            <th  className='tagTh'> Tags </th>
                            <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                        {lvlItems.map(item => <FollowUpListItem id = {item.id} name={item.title} tags={item.tags} clickFunc={() => entryClicked(item.id)} followup={item.followup.lvl} date={item.date} />  )}
                        <tr></tr>
                        </tbody>
                    </table>
                </div>
                <div className=' six columns' >
                    <table class="followupTable">
                        <caption>DATE</caption>
                        <thead>
                            <tr>
                            <th className='titleTh'>Title</th>
                            <th className='lvlTh'>On Date:</th>
                            <th className='tagTh'> Tags </th>
                            <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                        {dateItems.map(item => <FollowUpListItem id = {item.id} name={item.title} tags={item.tags} followup={item.followup.date} clickFunc={() => entryClicked(item.id)} date={item.date} />  )}
                        <tr></tr>
                        </tbody>
                    </table>
                </div>
            </div>


        </section>
        <div className="createBtnSection">
        <button className="editBtn" onClick={() => navigate('/create')} >Create note</button>

        </div>
        
    </section>
        </section>
    )
}

export default FollowupPage