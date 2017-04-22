import React from 'react';
import $ from 'jquery';
// import { Table, TableHeader, TableBody, TableRow, TableRowColumn } from 'material-ui';
import MessagesReceiveEntry from './MessagesReceiveEntry'
import MessagesSentEntry from './MessagesSentEntry'

class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewedMessage: {},
    msgContent: '',
    composeContent: '',
    logInOption: this.props.logInOption,

    composeRecipientList: [],
    composeRecipientString: '',
    messagesReceive: [],
    messagesSent: [],
    newSubjectInputString: '',

    };
    this.showMsgContent = this.showMsgContent.bind(this);
    this.setComposeRecipient = this.setComposeRecipient.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.handleComposeChange = this.handleComposeChange.bind(this);
    this.handleInputRecipientChange = this.handleInputRecipientChange.bind(this);
    this.setViewedMessage = this.setViewedMessage.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.clearContent = this.clearContent.bind(this);
    this.handleNewSubjectInputChange = this.handleNewSubjectInputChange.bind(this);
    this.sendNewMessage = this.sendNewMessage.bind(this);
  }

  componentDidMount() {
    this.getMessages();
  }

  getMessages() {
    var context = this;
    $.ajax({
      type: 'GET',
      url: '/getMessages',
      data: { userType: this.state.logInOption },
      contentType: 'application/json',
      success: (results) => {
        console.log('got messages from server // messages = ', results)
         // context.props.setMessagesToAppState(results);
         context.setState({
      messagesReceive: results.receive,
      messagesSent: results.sent,
    })
      },
      error: (error) => {
        console.log('error on getting messages from server // error = ', error)
      }
    });
  }

  sendNewMessage(event) {
    event.preventDefault();
    this.state.viewedMessage = {};
    this.state.msgContent = '';
    this.clearContent();
    this.sendMessage(event);
  }
  sendMessage(event) {
    event.preventDefault();
    var recipientString = document.msgForm.composeMsgRecipientInput.value;
    var recipients = recipientString.split(';').map(function(possibleName) {
      return $.trim(possibleName);
    });
    this.state.composeRecipientList = recipients;
    console.log("Recipient List = ", this.state.composeRecipientList);
    this.state.composeRecipientList.forEach((recipient)=> {
      if (recipient.length>2) {
        const sendData = {
        prev_msgContent: this.state.viewedMessage.message||null,
        prev_msgDate: this.state.viewedMessage.send_date||null,
        prev_msgsender: this.state.viewedMessage.sender||null,
        prev_msgId: this.state.viewedMessage.id||null,
        prev_subject: this.state.viewedMessage.subject||null,
        sender_type: this.state.logInOption,
        msgContent: this.state.composeContent,
        recipient: recipient,
        subject: this.state.newSubjectInputString.length>0?
        this.state.newSubjectInputString:
        this.state.viewedMessage.subject&&
        this.state.viewedMessage.subject.length>0?
        this.state.viewedMessage.subject:
        '',
      };
      console.log("Sending message with sendData = ", sendData);
      var context = this;
        $.ajax({
        type: 'POST',
        url: '/sendMessage',
        data: sendData,
        success: (results) => {
          console.log('sent message to server // message = ', results);
          context.getMessages();
        },
        error: (error) => {
          console.log('error on sending message to server // error = ', error)
        }
      });
      }
    });
  }

  sendMessage(event) {
    event.preventDefault();
    const sendData = {
    prev_msgContent: this.state.viewedMessage.message,
    prev_msgDate: this.state.viewedMessage.send_date,
    prev_msgsender: this.state.viewedMessage.sender,
    prev_msgId: this.state.viewedMessage.id,
    prev_subject: this.state.viewedMessage.subject,
    sender_type: this.state.logInOption,
    msgContent: this.state.composeContent,
    recipient: this.state.composeRecipient,
  };
  var context = this;
    $.ajax({
      type: 'POST',
      url: '/sendMessage',
      data: sendData,
      success: (results) => {
        console.log('sent message to server // message = ', results);
        context.getMessages();
      },
      error: (error) => {
        console.log('error on sending message to server // error = ', error)
      }
    });

  }
  // componentDidUpdate() {
  // 	this.setState({
  // 		messagesReceive: this.props.messagesReceive,
  // 		messagesSent: this.props.messagesSent,
  // 	})
  // }

  clearContent() {
    this.setState({
      viewedMessage: {},
    msgContent: '',
    })
  }

  setViewedMessage(message) {
    this.setState({viewedMessage: message})
  }

  showMsgContent(msgContent) {
    this.setState({
      msgContent: msgContent,
      newSubjectInputString: ''
    });
  }

  setComposeRecipient(userName) {
    console.log('composeRecipient =', userName)
    this.state.composeRecipientList.push(userName);
    var nameList = this.state.composeRecipientList;
    var str = '';
    nameList.forEach((recipient)=> str = str+recipient+'; ');
    document.msgForm.composeMsgRecipientInput.value = str;
    this.setState({composeRecipientList: nameList});

  }

  handleComposeChange(changeEvent) {
    this.setState({ composeContent: changeEvent.target.value });
  }

  handleInputRecipientChange(changeEvent) {
    // console.log('changeevent.target.value= ',changeEvent.target.value);
    this.setState({ composeRecipientString: changeEvent.target.value })
  }

  handleNewSubjectInputChange(changeEvent) {
    // console.log('changeevent.target.value= ',changeEvent.target.value);
    this.setState({ newSubjectInputString: changeEvent.target.value })
  }


  render() {
    return (
    <div>
      <div>
        <form
          onSubmit={this.sendMessage}
          name="msgForm"
          id="msgForm"
          >
          {this.state.viewedMessage.sender
          ?
          <h5>
          From:
          <strong> {this.state.viewedMessage.sender} </strong>
          (reply to <strong>{this.state.viewedMessage.subject})</strong>
          </h5>
          :
          <h5>
          New Message:  (Subject:
            <strong>{this.state.newSubjectInputString}</strong>)
          </h5>}
          <label>Message Content:</label>
          <br></br>
          <textarea
            rows="6"
            cols="120"
            id="showMsgBox"
            // form="msgForm"
            value={
            this.state.viewedMessage.sender
            ?this.state.msgContent
            :"Nothing to View"}
            readOnly
            >
          </textarea>
          <br></br>
          {this.state.viewedMessage.sender
          ?
          <label>Compose Reply:</label>
          :
          <label>Compose New:</label>}
          <br></br>
          <textarea
            rows="4"
            cols="120"
            form="msgForm"
            name="msgBody"
            // value={this.state.composeContent}
            defaultValue = ""
            maxLength="1000"
            onChange={this.handleComposeChange}
            >
          </textarea>
          <br></br>
          <h5>To: </h5>
          <input
            type="text"
            name="recipient"
            id="composeMsgRecipientInput"
            // value={this.state.composeRecipient}
            defaultValue={this.state.composeRecipient}
            onChange={this.handleInputRecipientChange}
            />
          <button
            type="submit"
            >Send Reply
          </button>
          <input
            type="text"
            name="recipient"
            id="composeNewSubjectInput"
            onChange={this.handleNewSubjectInputChange}
            // value={this.state.composeRecipient}
            // defaultValue={this.state.composeRecipient}
            // onChange={this.handleInputRecipientChange}
            />
          <button
            onClick={this.sendNewMessage}
            >Send New
          </button>
          <br></br>
        </form>
        <button
          onClick={this.clearContent}
          >Compose New
        </button>
        <br></br>
      </div>
      <div>
        <label>Receive</label>
        <table className="messages-receive">
          <thead>
            <tr>
                <th>Date</th>
                <th>From</th>
                <th>Subject</th>
                <th>CC</th>
                <th>View Profile</th>
            </tr>
          </thead>
          <tbody>
            {this.state.messagesReceive.map((message, index) => {
              return (
                        <MessagesReceiveEntry
                          key={index}
                          message={message}
                          showMsgContent={this.showMsgContent}
                          setComposeRecipient={this.setComposeRecipient}
                          setViewedMessage={this.setViewedMessage}
                          />
                     )
            })}
          </tbody>
        </table>
        <label>Sent</label>
        <table className="messages-sent">
          <thead>
            <tr>
                <th>Date</th>
                <th>To</th>
                <th>Subject</th>
                <th>CC</th>
                <th>View Profile</th>
            </tr>
          </thead>
          <tbody>
            {this.state.messagesSent.map((message, index) => {
              return (
                      <MessagesSentEntry
                        key={index}
                        message={message}
                        showMsgContent={this.showMsgContent}
                        />
                  )
            })}
          </tbody>
        </table>
      </div>
    </div>
    );
  }
}

export default Messages;
