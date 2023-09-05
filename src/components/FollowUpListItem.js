import React from 'react'

const FollowUpListItem = (props) => {
    const {name,followup, date,tags, clickFunc, content,id} = props
    const contentTrimmed = content.substring(0, 50) + "..."
    const tagArr = []
    tags.forEach((x) => tagArr.push(x.name))
    return (
        <tr key={id} className='FollowUpListItem' onClick={clickFunc}>
            <td className='nameColumn'>{name}             
            <div className='subContent'> {contentTrimmed}</div>
            </td>   
            <td>{followup}</td>
            <td> {tagArr}</td>
            <td>{date}</td>
        </tr>
    )
}

export default FollowUpListItem