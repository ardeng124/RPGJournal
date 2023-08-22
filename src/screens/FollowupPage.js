import React, { useState, useRef, useEffect } from 'react'


import { useNavigate} from "react-router-dom"
import FollowUpListItem from '../components/FollowUpListItem';
import AxiosService from '../AxiosService';
import SideBar from '../components/SideBar';
import createIcon from '../Assets/plus_icon.png';

const FollowupPage = () => {
    const navigate = useNavigate()
    const [shrink, setShrink] = useState(false);
    const [journalItems, setJournalItems] = useState([])
    const [lvlItems, setlvlItems] = useState([])
    const [dateItems, setDateItems] = useState([])
    const [searchValDate, setSearchValDate] = useState("")
    const [searchValLvl, setSearchValLvl] = useState("")

    const filterItemsLvl = (items, query) => {
       if (!query) return items 
        console.log(query)
       
        return items.filter((items) => {
            const itemLvl = items.followup.lvl.toString().toLowerCase()
            const itemName = items.title.toString().toLowerCase()
            return itemName.includes(query.toLowerCase()) || itemLvl.includes(query.toLowerCase())
       }) 
     }
     const filterItemsDate = (items, query) => {
        if (!query) return items 
         console.log(query)
        
         return items.filter((items) => {
             const itemName = items.title.toString().toLowerCase()
             return itemName.includes(query.toLowerCase()) 
        }) 
      }
    const filteredItemsDate = filterItemsDate(dateItems, searchValDate);
    const filteredItemsLvl = filterItemsLvl(lvlItems, searchValLvl);

    const handleSubmit = (event) => {
        event.preventDefault()
    }
    const entryClicked = (id) => {
        navigate(`/journal/${id}`)
    }
    useEffect(() => {
        AxiosService.getFollowupJournalEntries().then(response => {
            if(response.status == 401) {
                window.alert("Error: Please log in again")
                navigate('/login')
            }
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
{/* 
                <div className='row'>
                    <div className='five columns'>
                         */}
                    <p> {AxiosService.getName}</p>
                    {/* </div> */}
                    {/* <div className='five columns'> */}
                        <h1> Come back when... </h1>
                    </div>
                {/* </div>  */}
        {/* </div> */}
            
        <section className='MainContent'>
            <div className='innerContent'>
            <div className='row'>
                <div className=' six columns' >
                    <h3>LEVEL</h3>
                <form  className = 'searchFormObject' onSubmit={handleSubmit}>
                        <input
                            type="text"
                            id="header-search"
                            placeholder="Search for a note title or specific level"
                            className="searchFormInput"
                            value = {searchValLvl} onChange={(e) => {setSearchValLvl(e.target.value)}}
                        />
                         
                    </form>
                    <table className="followupTable">
                        {/* <caption>LEVEL</caption> */}
                        <thead>
                            <tr>
                            <th className='titleTh'>Title</th>
                            <th className='lvlTh'>Level:</th>
                            <th  className='tagTh'> Tags </th>
                            <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                        {filteredItemsLvl.map(item => <FollowUpListItem key={item.id} content={item.content} id = {item.id} name={item.title} tags={item.tags} clickFunc={() => entryClicked(item.id)} followup={item.followup.lvl} date={item.date} />  )}
                        <tr></tr>
                        </tbody>
                    </table>
                </div>
                <div className=' six columns' >
                <h3>DATE</h3>
                <form  className = 'searchFormObject' onSubmit={handleSubmit}>
                        <input
                            type="text"
                            id="header-search"
                            placeholder="Search for a note title"
                            className="searchFormInput"
                            value = {searchValDate} onChange={(e) => {setSearchValDate(e.target.value)}}
                        />
                         
                    </form>
                    <table className="followupTable">

                        <thead>
                            <tr>
                            <th className='titleTh'>Title</th>
                            <th className='lvlTh'>On Date:</th>
                            <th className='tagTh'> Tags </th>
                            <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                        {filteredItemsDate.map(item => <FollowUpListItem key={item.id} content={item.content}  id = {item.id} name={item.title} tags={item.tags} followup={item.followup.date} clickFunc={() => entryClicked(item.id)} date={item.date} />  )}
                        <tr></tr>
                        </tbody>
                    </table>
                </div>
            </div>


            <img src={createIcon} className={shrink ? ` createBtn shrink` : `createBtn`} onClick={() => navigate('/create')}/>
        </div>
        </section>
        {/* <div className="createBtnSection">

        </div> */}
        
    </section>
        </section>
    )
}

export default FollowupPage