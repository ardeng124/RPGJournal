import React, { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom"
import AxiosService from "../AxiosService";
import SideBar from '../components/SideBar';

const EntryPage = () => {
    const navigate = useNavigate()
    const id = useParams().id
    const [itemDetails, setItemDetails] = useState({
        content:"",
        tags:[],
        title:"",
        owner:"",
        id:useParams().id,
        date:""
    })

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
                        <h1> {itemDetails.title} </h1>
                        <h6>{itemDetails.date}</h6>
                    </div>
                </div>
        </div>
            
        <section className='MainContent'>
           <p>{itemDetails.content}</p>

        </section>

    </section>
        </section>
    )
}

export default EntryPage
