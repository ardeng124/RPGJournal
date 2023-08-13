import React from 'react'

const JournalEntryListItem = (props) => {
    const {name,tags, date} = props
    console.log(props)
    console.log(name)
    return (
        <tr className='JournalListItem'>
            <td>{name}</td>
            <td>{tags}</td>
            <td>{date}</td>
        </tr>
    )
}

export default JournalEntryListItem