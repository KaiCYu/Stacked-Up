import React from 'react';

const WorkHistoryEntry = (props) => {

  return (
    <div className="search-container">
    {console.log('props in work history entry: ', props)}
      <div>
        <div>Company: {props.workEntry.name}</div>
        <div>Position: {props.workEntry.position}</div>
        <div>Description: {props.workEntry.description}</div>
        <br/>
      </div>
    </div>
  )
}

export default WorkHistoryEntry;
