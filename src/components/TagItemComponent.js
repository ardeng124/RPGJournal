import React, { useState } from 'react'
import editIcon from '../Assets/pencilangled.png';
import tickIcon from '../Assets/tick_icon.png';

const TagItemComponent = (props) => {
    const [editMode, setEdit] = useState(false)
    const {name, deleteFunc, editFunc, id, buttonDisabled, entryClickedFunc} = props
    const [newName, setNewName] = useState(name)


    const handleEditMode = (id) => {
      setEdit(!editMode)
      if(editMode && newName != name) {
        editFunc(id, newName)
      }
    }

  return (
    <div className='tagLiDiv' onMouseLeave={() => {setEdit(false)}}>  
        {editMode ? <img disabled = {buttonDisabled} src={tickIcon} className='tagEditImg' onClick={() => handleEditMode(id)}/> : <img disabled = {buttonDisabled} src={editIcon} className='tagEditImg' onClick={() => handleEditMode(id)}/>}

        {!editMode ? <li key = {id} className='tagLi' onClick={() => entryClickedFunc(id)}> 
            <p>{name}</p> 
        </li> : <form  className = 'tagEditInputForm' onSubmit={handleEditMode}>
                        <input
                            type="text"
                            id="header-search"
                            placeholder="Name"
                            // defaultValue={name}
                            className="tagEditInput"
                            value = {newName} onChange={(e) => {setNewName(e.target.value)}}
                        />
                    </form>
}
        <button disabled={buttonDisabled} id = {id} onClick={() => deleteFunc(id)} className='xBtn'>x</button>  

        {/* <button disabled={buttonDisabled} id = {id} onClick={() => deleteFunc(id)} className='xBtn'>x</button> */}
        </div>  
         )
}

export default TagItemComponent