import React, { useState, useRef, useEffect } from 'react'


import {useNavigate, useParams} from "react-router-dom"
import JournalEntryListItem from '../components/JournalEntryListItem';
import AxiosService from '../AxiosService';
import SideBar from '../components/SideBar';
import createIcon from '../Assets/plus_icon.png';
import editIcon from '../Assets/pencilicon.png';
import tickIcon from '../Assets/tick_icon.png';

const TagIndividualPage = () => {
    const id = useParams().id
    const navigate = useNavigate()
    const [shrink, setShrink] = useState(false);
    const [journalItems, setJournalItems] = useState([])
    const [searchVal, setSearchVal] = useState("")
    const [entry,SetEntry] = useState({})
    const [newName, setNewName] = useState("")
    const [editMode, setEdit] = useState(false)
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [loading, setLoading] = useState(false);

    const filterItems = (items, query) => {
       if (!query) {
         return journalItems 
       }
       return journalItems.filter((items) => {
         const itemName = items.title.toString().toLowerCase()
         

         return itemName.includes(query.toLowerCase()) 
       }) 
     }
    const filteredItems = filterItems(journalItems, searchVal);
    const handleSubmit = (event) => {
        event.preventDefault()
    }
    const entryClicked = (id) => {
        navigate(`/journal/${id}`)
    }
    const editTag = () => {
        if(buttonDisabled) return;
        setEdit(!editMode)
        if(editMode && newName != entry.name) {
            setButtonDisabled(true)
            setTimeout(() => setButtonDisabled(false),2000)
            setLoading(true)
            AxiosService.editTag(id, newName).then(response => {
                let entryNew = entry
                entryNew.name=newName
                SetEntry(entryNew)
                let newarr = journalItems
                newarr.map(x => {
                    x.tags.map(y => {
                        if(y.id == id) {
                            y.name = newName
                        }
                    })
                })
                setJournalItems(newarr)
                setLoading(false)
            })
        }
    }
    useEffect(() => {
        setLoading(true)
        setButtonDisabled(true)
        AxiosService.getTagJournalEntries(id).then(response => {
            if(response.status == 401) {
                window.alert("Error: Please log in again")
                navigate('/login')
            }
            response.data.entries.forEach((x,index) => {
                let date  = new Date (x.date)
                response.data.entries[index].date = date.toGMTString().substring(0,date.toGMTString().length-3)
            })
            setJournalItems(response.data.entries)
            SetEntry(response.data.entry)
            setNewName(response.data.entry.name)
            setButtonDisabled(false)
            setLoading(false)
        })
    }, []);

    return (
        <div>
        {loading && <div className="loader-container">
      	  <div className="spinner"></div>
        </div>}
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
                        <h1> Entries for:  </h1>
                        {!editMode ? <h4>{entry.name ? entry.name : "Loading..."}</h4> : 
                        <input
                            type="text"
                            id="header-search"
                            placeholder="Name"
                            className="subtitleInput"
                            value = {newName} onChange={(e) => {setNewName(e.target.value)}}
                        />
                    }
                    </div>
                {/* </div>  */}
        {/* </div> */}
            
        <section className='MainContent'>
            <div className='innerContent'>
            <form  className = 'searchFormObject' onSubmit={handleSubmit}>
                        <input
                            type="text"
                            id="header-search"
                            placeholder="Search for a note title"
                            className="searchFormInput"
                            value = {searchVal} onChange={(e) => {setSearchVal(e.target.value)}}
                        />
                    </form>
            <table className="NotesTable">
                <thead>
                    <tr>
                    <th>Title</th>
                    <th>Tags</th>
                    <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                  {filteredItems.map(item => <JournalEntryListItem key={item.id} id = {item.id} content = {item.content} name={item.title} clickFunc={() => entryClicked(item.id)} tags={item.tags} date={item.date} />  )}
                  <tr></tr>
                </tbody>
                </table>
        <button className='hide' disabled={buttonDisabled} onClick={() => navigate('/create')}><img src={createIcon} className={shrink ? ` createBtn shrink` : `createBtn`} /></button>


        {editMode ? <button className='hide' disabled={buttonDisabled}  onClick={() => editTag()}> <img src={tickIcon} className={shrink ? ` tagNameChng shrink` : `tagNameChng`}/> </button> : <button className='hide' disabled={buttonDisabled}  onClick={() => editTag()}> <img src={editIcon} className={shrink ? ` tagNameChng shrink` : `tagNameChng`}/> </button>}

            </div>
        </section>
        {/* <div className="createBtnSection">

        </div> */}
        
    </section>
        </section>
   </div> )
}
export default TagIndividualPage