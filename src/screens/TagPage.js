import React, { useState, useRef, useEffect } from 'react'


import { useNavigate} from "react-router-dom"
import AxiosService from '../AxiosService';
import SideBar from '../components/SideBar';
import TagItemComponent from '../components/TagItemComponent';

const TagPage = () => {
  
    const navigate = useNavigate()
    const [shrink, setShrink] = useState(false);
    const [tagList, setTagList] = useState([])
    const [searchVal, setSearchVal] = useState("")
    const [editMode, setEditMode] = useState(false)
    const [errorMsg, setError] = useState("")
    const [tagValue, setTagValue] = useState("")
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [loading, setLoading] = useState(false);

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
        setLoading(true)
        AxiosService.getTags().then(response => {
            if(response.status == 401) {
                window.alert("Error: Please log in again")
                navigate('/login')
            }
            setTagList(response.data.entries)
            setLoading(false)
        })
    }, []);

    const cancelEdits = (event) => {
        setEditMode(false); 
        setError(""); 
    }
    const addTag = (event) => {
        setButtonDisabled(true)
        setTimeout(() => setButtonDisabled(false),2000)
        //TODO: MAKE BUTTONS DISABLE FOR 2 SECONDS WHEN SENDING REQUESTS TO BACKEND
        AxiosService.createTag(tagValue).then(response => {
            const newTag = {
                name:response.data.name,
                owner:response.data.owner,
                id:response.data.id
            }
            let newArr = [...tagList, newTag]
            setTagList(newArr)
            setTagValue("")
            setEditMode(false)
        })
    }
    const deleteTag = (id) => {
        setButtonDisabled(true)
        setTimeout(() => setButtonDisabled(false),2000)
        AxiosService.deleteTag(id).then(response => {
            setTagList(response.data.tags)
        })
    }

    const editTag = (id, data) => {
        setButtonDisabled(true)
        setTimeout(() => setButtonDisabled(false),2000)
        AxiosService.editTag(id, data).then(response => {
     //dont pull update from backend, just update when you get a 200 response.
     // TODO: add error checking and error handling
            let tagListtoReplace = tagList
            tagListtoReplace.map((x) => {if(x.id == id){
                x.name = data
                console.log(x)
            }})
            setTagList(tagListtoReplace)
        })
    }

    return (
        <div>
        {loading && <div className="loader-container">
      	  <div className="spinner"></div>
        </div>}
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

                  {filteredItems.map(item => <TagItemComponent id = {item.id} editFunc={editTag} key = {item.id} buttonDisabled={buttonDisabled} deleteFunc={deleteTag} entryClickedFunc = {entryClicked} name={item.name} />)}
                    </ul>
        <div className="row buttonSection" >
            <div className="editGroup">
            {editMode && <button disabled={buttonDisabled} className="" onClick={() => cancelEdits()}>Cancel</button>}
            {editMode ? <button disabled={buttonDisabled}  className="editBtn" onClick={() => addTag()} >Save</button> : <button onClick={() => setEditMode(true)} >New tag</button>}
            {editMode && <form  className = 'tagAddForm' onSubmit={handleSubmit}>
                        <input
                            type="text"
                            id="header-search"
                            placeholder="Enter tag name"
                            className="addTagInput"
                            value = {tagValue} onChange={(e) => {setTagValue(e.target.value)}}
                        />
                    </form>}
            </div>
        </div>
        {/* <img src={createIcon} className={shrink ? ` createBtn shrink` : `createBtn`} onClick={() => navigate('/create')}/> */}

        {/* <button className={shrink ? ` editBtn shrink` : `editBtn`} onClick={() => navigate('/create')} >Create note</button> */}
            </div>
        </section>
        {/* <div className="createBtnSection">

        </div> */}
        
    </section>
        </section>
   </div> )
}

export default TagPage

