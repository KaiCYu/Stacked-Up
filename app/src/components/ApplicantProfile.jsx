import React from 'react';
import { BrowserRouter as Link } from 'react-router-dom';
import { Table, TableHeader, TableRow, TableHeaderColumn, TableBody } from 'material-ui';
import $ from 'jquery';
import ProfilePicture from './ProfilePicture';
import AppliedCompanyEntry from './AppliedCompanyEntry';
import FormInput from './FormInput';
import FileEntry from './FileEntry';

// import WorkHistoryEntry from './WorkHistoryEntry';

class ApplicantProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      resumes: [],
      coverLetters: [],
      resumesUpload: [],
      coverLettersUpload: [],
    };
    this.addFile = this.addFile.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.updateFiles = this.updateFiles.bind(this);
    this.clearPreviewAndState = this.clearPreviewAndState.bind(this);
  }

  componentDidMount() {
    $.ajax({
      url: '/getAppliedCompanies',
      type: 'GET',
      success: (result) => {
        this.setState({
          list: result.companies,
          resumes: result.resumes,
          coverLetters: result.coverletters,
        });
      },
      error: (error) => {
        console.log('this is the error', error);
      },
    });
  }

  updateFiles() {
    $.ajax({
      type: 'GET',
      url: '/updateFiles',
      success: (results) => {
        this.setState({ resumes: results.resumes, coverLetters: results.coverLetters });
        console.log('files have been updated!');
      },
      error: (error) => {
        console.log('error updating files from DB ', error);
      },
    });
  }

  addFile(event) {
    const name = event.target.name;
    // console.log('NAME', name);
    const preview = document.querySelector(`#preview-${name}`);
    // console.log('PREVIEW: ', preview);
    const file = document.getElementById(`${name}`).files[0];

    const reader = new FileReader();

    reader.onloadend = () => {
      let fileArray = this.state[name];
      fileArray.push(reader.result);
      this.setState({ [name]: fileArray });
    };

    reader.addEventListener("loadend", () => {
      // console.log('read the picture******************');
      const image = new Image();
      image.height = 100;
      image.title = file.name;
      image.src = reader.result;
      preview.appendChild(image);
    }, false);

    if (file && file.type === 'text/plain') {
      reader.readAsText(file);
    }
    if (file && file.type !== 'text/plain') {
      reader.readAsDataURL(file);
    }
  }

  clearPreviewAndState() {
    $('#preview-coverLettersUpload').empty();
    $('#preview-resumesUpload').empty();
    this.setState({ resumesUpload: [], coverLettersUpload: [] });
  }

  handleUpload() {
    // event.preventDefault();
    const fileData = {
      username: this.props.info.username,
      resumes: this.state.resumesUpload,
      coverLetters: this.state.coverLettersUpload,
    };

    if (fileData.resumes.length === 0 && fileData.coverLetters.length === 0) {
      alert('please select a file to upload!');
    } else {
      $.ajax({
        type: 'POST',
        url: '/uploadFile',
        data: fileData,
        success: () => {
          this.updateFiles();
          this.clearPreviewAndState();
          console.log('files have been uploaded!');
        },
        error: (error) => {
          console.log('error uploading files to server // error', error);
        },
      });
    }
  }

  deleteFile(id) {
    const userData = {
      fileId: id,
    };

    $.ajax({
      type: 'DELETE',
      url: '/deleteFile',
      data: userData,
      success: () => {
        console.log('files have been deleted!');
        this.updateFiles();
      },
      error: (error) => {
        console.log('error deleting files from db // error', error);
      },
    });
  }

  render() {
    return (
      <div className="search-container">
      {/*{console.log('props in applicant profile: ', this.props)}*/}
        <h1>Applicant Profile</h1>
        <div>
          <ProfilePicture src={this.props.info.profile_pic_url}/>
          <h3>Username: {this.props.info.username}</h3>
          <h4>Name: {`${this.props.info.firstName} ${this.props.info.lastName}`}</h4>
          <h5>Email: {this.props.info.email}</h5>
          <h5>Phone Number: {this.props.info.phone_number}</h5>
          <h5>Location: {`${this.props.info.city}, ${this.props.info.state} ${this.props.info.country}`}</h5>

          <br/>
          
          {/*<div>Work History:
            {props.info.workHistory.map((workEntry, index) => {
              return <WorkHistoryEntry key={index} workEntry={workEntry} />;
            })}
          </div>*/}
          <section id="resume-list">
            Your Resumes: {this.state.resumes.map((fileEntry, index) => {
              return <FileEntry key={index} fileEntry={fileEntry} deleteFile={this.deleteFile} />;
            })}
          </section>
          <br />

          <section id="coverletter-list">
            Your Cover Letters: {this.state.coverLetters.map((fileEntry, index) => {
              return <FileEntry key={index} fileEntry={fileEntry} deleteFile={this.deleteFile} />;
            })}
          </section>
          <br />

          <FormInput title={'Upload a Resume'} id={"resumesUpload"} type={"file"} name={"resumesUpload"} onChange={this.addFile} /> <br />
          <div id="preview-resumesUpload" ></div>

          <FormInput title={'Upload a Cover Letter'} id={"coverLettersUpload"} type={"file"} name={"coverLettersUpload"} onChange={this.addFile} />
          <div id="preview-coverLettersUpload" ></div>

          <button onClick={this.handleUpload}>Upload Files</button>

          {/*<div>Work History:
            {props.info.workHistory.map((workEntry, index) => {
              return <WorkHistoryEntry key={index} workEntry={workEntry} />;
            })}
          </div>*/}

          <h1>List of Applied Companies</h1>
          <Table>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>Company Name</TableHeaderColumn>
                <TableHeaderColumn>Position</TableHeaderColumn>
                <TableHeaderColumn>Description</TableHeaderColumn>
                <TableHeaderColumn>Location</TableHeaderColumn>
                <TableHeaderColumn>Starting Salary</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {this.state.list.map(entry =>
                <AppliedCompanyEntry
                  entry={entry}
                  key={entry.id}
                />)
              }
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
}

export default ApplicantProfile;
