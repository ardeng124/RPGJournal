import React, { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom"
import AxiosService from "../AxiosService";
import SideBar from '../components/SideBar';
import FollowUpFormEntry from "../components/FollowUpFormEntry";

const EntryPage = () => {
    const navigate = useNavigate()
    const [editMode, setEditMode] = useState(false)
    const [itemDetails, setItemDetails] = useState({
        content:"",
        tags:[],
        title:"",
        owner:"",
        id:useParams().id,
        date:"",
        followup: {followup:false, date:"null",lvl:"null"}
    })
    const id = useParams().id
    const [initialState, setInitialState] = useState({content:'', title:'', followupCheck:itemDetails.followup.followup, followupDate:itemDetails.followup.date, followupLvl:itemDetails.followup.lvl})
    const [formInfo, setFormInfo] = useState(initialState)
    const [errorMsg, setError] = useState("")
    const [followupSet, setFollowUp] = useState(itemDetails.followup.followup)
    const updateField = (event) => {
        // which input element is this
        const name = event.target.attributes.name.value
        if (name === "title") {
            setFormInfo({...formInfo, title: event.target.value})
        } else if (name === "content") {
            setFormInfo({...formInfo, content: event.target.value})
        }
        else if (name == "followUpLvl") {
            setFormInfo({...formInfo, followupLvl:event.target.value})
        }
        else if (name == "followUpDate") {
            setFormInfo({...formInfo, followupDate:event.target.value})
        }
        else if (name == "followupCheck") {
            setError("")
            if(event.target.checked) setFollowUp(true);
            if(!event.target.checked) setFollowUp(false);

            setFormInfo({...formInfo, followupCheck:!followupSet})

        }
    }
    const cancelEdits = (event) => {
        setEditMode(false); 
        setError(""); 
        setFollowUp(itemDetails.followup.followup)
    }
    const saveEdits = (event) => {
        if(formInfo.followupCheck == true) {
            if(formInfo.followupDate == "null" && (formInfo.followupLvl == "null" || formInfo.followupLvl=="")){

                setError("Please choose a level or date when setting follow up")
                return
            }
        }
        AxiosService.modifyEntry(formInfo, id).then(response => {
            if(response.status != 201) {
                window.alert('error updating')
                //TODO: make a proper way of showing errors

            } else {
                setItemDetails(response.data.entryNew)
                setEditMode(false)
                console.log(response.data)
                setFollowUp(response.data.entryNew.followup.followup)
            }
        })
    }
    const deleteEntry = (event) => {
        AxiosService.deleteEntry(id).then(response => {
            if(response.status != 200) {
                window.alert('error deleting')
                //TODO: make a proper way of showing errors

            } else {
                navigate('/dashboard')
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
            setFollowUp(response.data.followup.followup)
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
            {editMode && < div> <label> Enable follow up?</label>
                <input type="checkbox" onChange={updateField} defaultChecked={itemDetails.followup.followup} name="followupCheck"/>
            </div>}
        {followupSet && <FollowUpFormEntry updateFn = {updateField} editMode={editMode} itemDetails={itemDetails.followup}/>}
        <p className="errorText"> {errorMsg}</p> 
        </section>
        <div className="row buttonSection" >
        <div className="editGroup">
        {editMode && <button className="" onClick={() => cancelEdits()}>Cancel</button>}
        {editMode ? <button className="editBtn" onClick={() => saveEdits()} >Save</button> : <button onClick={() => setEditMode(true)} >Edit</button>}
        </div>
        {editMode && <button className="deleteButton" onClick={() => deleteEntry()}> Delete</button>}
        </div>
        

        </section>
        </section>
    )
}

export default EntryPage
