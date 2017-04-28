import React from 'react'

const FileEntry = (props) => {
  return (
    <div className="show-image">
      <img src={props.fileEntry.url} height={'150px'} alt="preview" />
      <input className="delete" onClick={()=> {
        props.deleteFile(props.fileEntry.id)}
        } type="button" value="Delete" />
    </div>
  );
};

export default FileEntry;

