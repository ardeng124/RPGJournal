import React from 'react'

const TagListComponent = (props) => {
    const {tagList, tagClicked} = props

    if(tagList != "") {
        return (
        <div className="tagDiv"><span> Tags </span><ul className="tagsCollection"> {tagList.map(item => <li key = {item.id} id={item.id} className='tagList' onClick={() => tagClicked(item.id)}>{item.name} </li> )} </ul></div>
        )
    } else {
        return (<span></span>)
    }
    }

export default TagListComponent