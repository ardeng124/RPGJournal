import React, { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom"
import AxiosService from "../AxiosService";
import SideBar from '../components/SideBar';

const CreateNotePage = () => {
    const navigate = useNavigate()
    const initialState = {content:'', title:''}
    const [formInfo, setFormInfo] = useState(initialState)

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
        AxiosService.createEntry(formInfo).then(response => {
            if(response.status != 201) {
                window.alert('error creating')
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

                <div className='row '>
                    <div className='three columns'>
                    <p> {AxiosService.getName}</p>
                    </div>
                    <div className='five columns centeredTitle '>
                    <input className="titleInput" name ='title' onChange={updateField} placeholder="Title"></input>

                    </div>
                </div>
        </div>
            
        <section className='MainContent'>
            <textarea name ='content' onChange={updateField} placeholder="enter note information here"></textarea>

        </section>
        <div className="createBtnSection">
        <button className="" onClick={() => navigate('/dashboard')}>Cancel</button>
        <button className="editBtn" onClick={() => saveEdits()} >Save</button>
        </div>
        

        </section>
        </section>
    )
}

export default CreateNotePage
