import React from 'react'

const JournalEntryListItem = (props) => {
    const {name,tags, date, clickFunc, content} = props
    const tagArr = []
    tags.forEach((x) => tagArr.push(x.name+" "))
    console.log(tagArr)
    const contentTrimmed = content.substring(0, 100) + "..."
    return (
        <tr className='JournalListItem' onClick={clickFunc}>
            <td className='nameColumn'>{name}             
            <div className='subContent'> {contentTrimmed}</div>
            </td>   
            <td>{tagArr}</td>
            <td>{date}</td>
        </tr>
    )
}

export default JournalEntryListItem