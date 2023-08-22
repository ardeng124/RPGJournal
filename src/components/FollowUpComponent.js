import React from 'react'

const FollowUpComponent = (props) => {
    const {itemDetails, editMode, followUpSet} = props

  return (
    <section className="followupForm">
            {itemDetails.date != 'null' && itemDetails.date && <div>
                    <p> Follow up on <b>date: {itemDetails.date} </b> </p>
                </div>}
            {itemDetails.lvl != 'null' && itemDetails.lvl && <div>
                <p> Follow up on <b>level: {itemDetails.lvl}</b> </p>
        </div>}
    </section>
  )
}

export default FollowUpComponent