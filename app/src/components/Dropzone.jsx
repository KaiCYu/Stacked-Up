const React = require('react');
const Dropzone = require('react-dropzone');

class DropZoneDemo extends React.Component {

    onDrop(files) {
      console.log('Received files: ', files);
    },
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