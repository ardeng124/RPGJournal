import React from 'react'

const FollowUpListItem = (props) => {
    const {name,followup, date, clickFunc} = props

    return (
        <tr className='FollowUpListItem' onClick={clickFunc}>
            <td>{name}</td>
            <td>{followup}</td>
            <td>{date}</td>
        </tr>
    )
}

export default FollowUpListItem