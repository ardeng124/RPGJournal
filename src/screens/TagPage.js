import React, { useState, useRef, useEffect } from 'react'


import { useNavigate} from "react-router-dom"
import AxiosService from '../AxiosService';
import SideBar from '../components/SideBar';
import createIcon from '../Assets/plus_icon.png';
const TagPage = () => {
  
    const navigate = useNavigate()
    const [shrink, setShrink] = useState(false);
    const [tagList, setTagList] = useState([])
    const [searchVal, setSearchVal] = useState("")
   
           
    const filterItems = (items, query) => {
       if (!query) {
         return tagList 
       }
       return tagList.filter((items) => {
         const itemName = items.name.toString().toLowerCase()

         return itemName.includes(query.toLowerCase()) 
       }) 
     }
    const filteredItems = filterItems(tagList, searchVal);
    const handleSubmit = (event) => {
        event.preventDefault()
    }   
    const entryClicked = (id) => {
        navigate(`/tags/${id}`)
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

    return (
    <section className='Dashboard'>
        <SideBar shrink={shrink} setShrink={setShrink}></SideBar>
        <section className={shrink ? `shrink` : `Page`} >
        <div className='topbar'>
                        <h1> Tags </h1>
                    </div>
        <section className='MainContent'>
            <div className='innerContent'>
            <form  className = 'searchFormObject' onSubmit={handleSubmit}>
                        <input
                            type="text"
                            id="header-search"
                            placeholder="Search for a tag"
                            className="searchFormInput"
                            value = {searchVal} onChange={(e) => {setSearchVal(e.target.value)}}
                        />
                    </form>
                    <ul className='tagItemList'>
                        {/* use onMouseEnter and onMouseLeave to have events for edit modes */}
                  {filteredItems.map(item => <li key = {item.id} className='tagLi' onClick={() => entryClicked(item.id)}> <p>{item.name}</p> <p>Notes:{item.entries.length}</p></li>  )}
                    </ul>
        {/* <img src={createIcon} className={shrink ? ` createBtn shrink` : `createBtn`} onClick={() => navigate('/create')}/> */}

        {/* <button className={shrink ? ` editBtn shrink` : `editBtn`} onClick={() => navigate('/create')} >Create note</button> */}
            </div>
        </section>
        {/* <div className="createBtnSection">

        </div> */}
        
    </section>
        </section>
    )
}

export default TagPage

