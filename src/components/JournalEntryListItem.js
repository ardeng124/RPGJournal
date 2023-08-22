import React from 'react'

const JournalEntryListItem = (props) => {
    const {name,tags, date, clickFunc, content} = props
    const contentTrimmed = content.substring(0, 100) + "..."
    return (
        <tr className='JournalListItem' onClick={clickFunc}>
            <td className='nameColumn'>{name}             
            <div className='subContent'> {contentTrimmed}</div>
            </td>   
            <td>{tags}</td>
            <td>{date}</td>
        </tr>
    )
}

export default JournalEntryListItem