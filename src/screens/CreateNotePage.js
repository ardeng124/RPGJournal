import React, { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom"
import AxiosService from "../AxiosService";
import SideBar from '../components/SideBar';
import FollowUpFormEntry from "../components/FollowUpFormEntry";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const CreateNotePage = () => {
    const animatedComponents = makeAnimated();

    const navigate = useNavigate()
    const [initialState, setInitialState] = useState({content:'', title:'', followupCheck:false, followupDate:'null', followupLvl:"null"})
    const [formInfo, setFormInfo] = useState(initialState)
    const [errorMsg, setError] = useState("")
    const [followupSet, setFollowUp] = useState(false)
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [selected, setSelected] = useState(null);
    const [tagsArr, setTagList] = useState([])
    const itemDetails = {
        content:"",
        tags:[],
        title:"",
        owner:"",
        id:useParams().id,
        date:"",
        followup:{followup:false, date:"", lvl:""}
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
    const handleChange = (selectedOption) => {
        setSelected(selectedOption);
        setFormInfo({...formInfo, tags:selected})
    }
    
        useEffect(() => {
            AxiosService.getTags().then(response => {
                if(response.status == 401) {
                    window.alert("Error: Please log in again")
                    navigate('/login')
                }
                setTagList(response.data.entries)
            })
        }, []);

    const saveEdits = (event) => {
        if(formInfo.followupCheck == true) {
            if(formInfo.followupDate == "null" && (formInfo.followupLvl == "null" || formInfo.followupLvl=="")){
                
                setError("Please choose a level or date when setting follow up")
                return
            }
        }
        setButtonDisabled(true)
        setTimeout(() => setButtonDisabled(false),2000)
        setError(""); 
        let tagArray = []
        if(selected != null) {
        selected.forEach(x =>tagArray.push({id: x.value, name:x.label}))
        setFormInfo({...formInfo, tags:tagArray})
        }

        AxiosService.createEntry({...formInfo, tags:tagArray}).then(response => {
            if(response.status != 201) {
                if (response.data.status == "mising content") setError("Please include content for the note");
                if (response.data.status == "mising title") setError("Please include a title for the note");
                

                else {
                    setError(response.data.error)
                }
                //TODO: make a proper way of showing errors
            } else {

                let id = response.data.id
                navigate(`/journal/${id}`)
                
            }
        })
    }

    const [shrink, setShrink] = useState(false);
    return (
        <section className='EntryPage'>
        <SideBar shrink={shrink} setShrink={setShrink}></SideBar>
        <section className={shrink ? `shrink` : `Page`} >
        <div className='topbar'>

                    <div className=' centeredTitle '>
                    <input className="titleInput" name ='title' onChange={updateField} placeholder="Title"></input>

                    </div>
                </div>
            
        <section className='MainContent'>
        <Select className="SelectTags" value={selected} components={animatedComponents} closeMenuOnSelect={false} placeholder="Tags"
            options={getTagNames()} onChange={handleChange} autoFocus={true} isMulti name="tags" />

        <textarea name ='content' onChange={updateField} placeholder="enter note information here"></textarea>
        {errorMsg != "" && <p className="errorText"> {errorMsg}</p>}
        <label> Enable follow up?</label>
        <input type="checkbox" onChange={updateField} defaultChecked={itemDetails.followup.followup} name="followupCheck"/>
        {followupSet && <FollowUpFormEntry updateFn = {updateField} editMode={true} itemDetails={itemDetails.followup}/>}
        </section>
        <div className="createBtnSection">
        <button disabled={buttonDisabled} className="" onClick={() => navigate('/dashboard')}>Cancel</button>
        <button disabled={buttonDisabled} className="editBtn" onClick={() => saveEdits()} >Save</button>
        </div>
        

        </section>
        </section>
    )
}

export default CreateNotePage
