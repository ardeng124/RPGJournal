import React, { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom"
import AxiosService from "../AxiosService";
import SideBar from '../components/SideBar';
import FollowUpFormEntry from "../components/FollowUpFormEntry";
import FollowUpComponent from "../components/FollowUpComponent";

import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import TagListComponent from "../components/TagListComponent";

const EntryPage = () => {
    const animatedComponents = makeAnimated();
    const navigate = useNavigate()
    const [editMode, setEditMode] = useState(false)
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [loading, setLoading] = useState(false);

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
    const [initialState, setInitialState] = useState({content:'', title:'', followupCheck:"null", followupDate:"null", followupLvl:"null", tags:null})
    const [formInfo, setFormInfo] = useState(initialState)
    const [errorMsg, setError] = useState("")
    const [followupSet, setFollowUp] = useState(itemDetails.followup.followup)
    const [tagsArr,setTags] = useState([])
    const [selected, setSelected] = useState(null);
    
    const [shrink, setShrink] = useState(false);
    
    const handleChange = (selectedOption) => {
        setSelected(selectedOption);
        setFormInfo({...formInfo, tags:selected})
    }
    
    const getTagNames = () => {
        let arr = []
        tagsArr.forEach(x =>arr.push({value: x.id, label:x.name}))
        return arr
    }
    
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
        if(buttonDisabled) return;
        setButtonDisabled(true)
        setTimeout(() => setButtonDisabled(false),2000)
        if(formInfo.followupCheck == true) {
            if(formInfo.followupDate == "null" && (formInfo.followupLvl == "null" || formInfo.followupLvl=="")){

                setError("Please choose a level or date when setting follow up")
                return
            }
        }
        setError(""); 
        let tagArray = []
        selected.forEach(x =>tagArray.push({id: x.value, name:x.label}))
        setFormInfo({...formInfo, tags:tagArray})
        AxiosService.modifyEntry({...formInfo, tags:tagArray}, id).then(response => {
            if(response.status== 404 && response.error == "could not add tag") {
                setError("Could not modify tags")
                return
            }
            if(response.status != 201) {
                window.alert('error updating')
                setError("Error updating")
            } else {
                setItemDetails(response.data.entryNew)
                setEditMode(false)
                setFollowUp(response.data.entryNew.followup.followup)
            }
        })
    }
    const deleteEntry = (event) => {
        if(buttonDisabled) return;
        setButtonDisabled(true)
        setTimeout(() => setButtonDisabled(false),2000)
        AxiosService.deleteEntry(id).then(response => {
            if(response.status != 200) {
                setError("Error deleting")
                // window.alert('error deleting')
                //TODO: make a proper way of showing errors

            } else {
                navigate('/dashboard')
            }
        })
    }
   const tagClicked = (id) => {
    navigate(`/tags/${id}`)

   }
    useEffect(() => {
        setLoading(true)
        setButtonDisabled(true)
        AxiosService.getJournalEntry(id).then(response => {
            if(response.status == 401) {
                window.alert("Error: Please log in again")
                navigate('/login')
            }
            if(response.status == 404) {
                window.alert("specified entry does not exist")
                navigate('/dashboard')
            }                
            const date  = new Date (response.data.entry.date)
            response.data.entry.date = date.toGMTString()
            setItemDetails(response.data.entry)
            setTags(response.data.tags)
            setInitialState({title:itemDetails.title, content:itemDetails.content, followupCheck:response.data.entry.followup.followup, followupDate:response.data.entry.followup.date, followupLvl:response.data.entry.followup.lvl})
            setFollowUp(response.data.entry.followup.followup)
            let arr = []
            response.data.entry.tags.forEach(x =>arr.push({value: x.id, label:x.name}))
            setSelected(arr)
            setButtonDisabled(false)
            setLoading(false)
            
        })
    },[])
    return (
        <div>
        {loading && <div className="loader-container">
      	  <div className="spinner"></div>
        </div>}
        <section className='EntryPage'>
        <SideBar shrink={shrink} setShrink={setShrink}></SideBar>
        <section className={shrink ? `shrink` : `Page`} >
        <div className='topbar'>
                {/* <div className='row '>
                    <div className='three columns'>
                    <p> {AxiosService.getName}</p>
                    </div>
                    <div className='five columns centeredTitle '> */}
                    <div className="centeredTitle">

                    {editMode ? <input className="titleInput" name ='title' onChange={updateField} defaultValue={itemDetails.title}></input>:  <h1> {itemDetails.title} </h1>}
                    <h6>{itemDetails.date}</h6>
                    </div>
                    </div>
                {/* </div>
        </div> */}
            
        <section className='MainContent'>
        {editMode ? <Select className="SelectTags" value={selected} components={animatedComponents} closeMenuOnSelect={false} placeholder="Tags"
            options={getTagNames()} onChange={handleChange} autoFocus={true} isMulti name="tags" /> :<TagListComponent tagList={itemDetails.tags} tagClicked = {tagClicked}/>}
            {followupSet & !editMode ? <FollowUpComponent itemDetails={itemDetails.followup}/> : <span></span>}

            {editMode ? <textarea name ='content' className="entryContent" onChange={updateField} defaultValue={itemDetails.content}></textarea>: <p className="textContent">{itemDetails.content} </p>}
            {errorMsg != "" && <p className="errorText"> {errorMsg}</p>}

            {editMode && < div> <label> Enable follow up?</label>
                <input type="checkbox" onChange={updateField} defaultChecked={itemDetails.followup.followup} name="followupCheck"/>
            </div>}
        {followupSet & editMode ? <FollowUpFormEntry updateFn = {updateField} editMode={editMode} itemDetails={itemDetails.followup}/> : <span></span>}

        </section>
        {!loading ? 
        <div className="row buttonSection" >
        <div className="editGroup">
        {editMode && <button className="" onClick={() => cancelEdits()}>Cancel</button>}
        {/* {editMode && <img src={cancelIcon} className="cancelBtn" onClick={() => cancelEdits()}/>} */}

        {editMode ? <button disabled={buttonDisabled} className="editBtn" onClick={() => saveEdits()} >Save</button> : <button onClick={() => setEditMode(true)} >Edit</button>}
        {/* {editMode ? <img src={tickIcon} className="acceptBtn" onClick={() => saveEdits()} /> : <img className='editBtn' src={editIcon} onClick={() => setEditMode(true)} />} */}

        </div>
        {editMode && <button disabled={buttonDisabled} className="deleteButton" onClick={() => deleteEntry()}> Delete</button>}
        {/* {editMode && <img src={delIcon} className="deleteBtn" onClick={() => deleteEntry()}/> } */}

        </div> : <span></span>}
        

        </section>
        </section>
    </div>)
}

export default EntryPage
