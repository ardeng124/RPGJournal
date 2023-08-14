import React, { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom"
import AxiosService from "../AxiosService";
import SideBar from '../components/SideBar';

const EntryPage = () => {
    const navigate = useNavigate()
    const [editMode, setEditMode] = useState(false)
    const id = useParams().id
    const [initialState, setInitialState] = useState({content:'', title:''})
    const [formInfo, setFormInfo] = useState(initialState)
    const [itemDetails, setItemDetails] = useState({
        content:"",
        tags:[],
        title:"",
        owner:"",
        id:useParams().id,
        date:""
    })
    const updateField = (event) => {
        // which input element is this
        const name = event.target.attributes.name.value
        if (name === "title") {
            setFormInfo({...formInfo, title: event.target.value})
        } else if (name === "content") {
            setFormInfo({...formInfo, content: event.target.value})
        }
    }
    const saveEdits = (event) => {
        AxiosService.modifyEntry(formInfo, id).then(response => {
            if(response.status != 200) {
                window.alert('error updating')
                //TODO: make a proper way of showing errors

            } else {
                setItemDetails(response.data.entryNew)
                setEditMode(false)
            }
        })
    }
    useEffect(() => {
        AxiosService.getJournalEntry(id).then(response => {
            if(response.status == 401) {
                window.alert("Error: Please log in again")
                navigate('/login')
            }
            if(response.status == 404) {
                window.alert("specified entry does not exist")
                navigate('/dashboard')
            }
            const date  = new Date (response.data.date)
            response.data.date = date.toGMTString()
            setItemDetails(response.data)
            setInitialState({title:itemDetails.title, content:itemDetails.content})
            
        })
    },[])
    const [shrink, setShrink] = useState(false);
    return (
        <section className='EntryPage'>
        <SideBar shrink={shrink} setShrink={setShrink}></SideBar>
        <section className={shrink ? `shrink` : `Page`} >
        <div className='topbar'>

                <div className='row '>
                    <div className='three columns'>
                    <p> {AxiosService.getName}</p>
                    </div>
                    <div className='five columns centeredTitle '>
                    {editMode ? <input className="titleInput" name ='title' onChange={updateField} defaultValue={itemDetails.title}></input>:  <h1> {itemDetails.title} </h1>}
                    <h6>{itemDetails.date}</h6>
                    </div>
                </div>
        </div>
            
        <section className='MainContent'>
            {editMode ? <textarea name ='content' onChange={updateField} defaultValue={itemDetails.content}></textarea>: <p>{itemDetails.content} </p>}

        </section>
        <div className="buttonSection">
        {editMode ? <button className="editBtn" onClick={() => saveEdits()} >Save</button> : <button onClick={() => setEditMode(true)} >Edit</button>}
        {editMode && <button className="" onClick={() => setEditMode(false)}>Cancel</button>}
        </div>
        

        </section>
        </section>
    )
}

export default EntryPage
