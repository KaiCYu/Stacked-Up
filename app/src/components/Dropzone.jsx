const React = require('react');
const Dropzone = require('react-dropzone');

class DropZoneDemo extends React.Component {

  render() {
    return (
        <div>
          <Dropzone onDrop={this.onDrop} multiple={false} >
            <div>Try dropping some files here, or click to select files to upload.</div>
          </Dropzone>
        </div>
    );
  }
}

export default Dropzone;