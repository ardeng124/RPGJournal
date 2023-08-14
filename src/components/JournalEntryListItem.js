import React from 'react'

const JournalEntryListItem = (props) => {
    const {name,tags, date, clickFunc} = props

    return (
        <tr className='JournalListItem' onClick={clickFunc}>
            <td>{name}</td>
            <td>{tags}</td>
            <td>{date}</td>
        </tr>
    )
}

export default JournalEntryListItem