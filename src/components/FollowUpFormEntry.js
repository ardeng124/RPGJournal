import React from 'react'

const FollowUpFormEntry = (props) => {
    const {updateFn, itemDetails, editMode, followUpSet} = props

  return (
    <section className={editMode ? `followupFormEdit` : `followupForm`}>
        {editMode && <div>
            <h5> Follow up</h5>
            <label> Level</label>
        <input  placeholder='Enter level' defaultValue={itemDetails.lvl} onChange={updateFn} name='followUpLvl'></input>
        <p> OR </p>
        <label> Date</label>
        <input placeholder='Enter Date' type='date' defaultValue={itemDetails.date} onChange={updateFn} name='followUpDate'></input>
        </div>
        }
        {!editMode &itemDetails.followup && <div>
            <h5> Follow up </h5>
            {itemDetails.date != 'null' && itemDetails.date && <div>
                    <p> Follow up on date: {itemDetails.date} </p>
                </div>}
            {itemDetails.lvl != 'null' && itemDetails.lvl && <div>
                <p> Follow up on level: {itemDetails.lvl} </p>
            </div>}
        </div>}
    </section>
  )
}

export default FollowUpFormEntry