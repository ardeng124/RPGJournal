import React from 'react'

const TagListComponent = (props) => {
    const {tagList, tagClicked} = props
    console.log(tagList)
    if(tagList != "") {
        return (
        <div className="tagDiv"><span> Tags </span><ul className="tagsCollection"> {tagList.map(item => <li key = {item.id} className='tagList' onClick={() => tagClicked(item.id)}>{item.name} </li> )} </ul></div>
        )
    } else {
        return (<span></span>)
    }
    }

export default TagListComponent