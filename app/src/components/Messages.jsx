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
		composeRecipient: '',
		messagesReceive: [],
		messagesSent: [],
    };
    this.showMsgContent = this.showMsgContent.bind(this);
    this.setComposeRecipient = this.setComposeRecipient.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.handleComposeChange = this.handleComposeChange.bind(this);
    this.handleInputRecipientChange = this.handleInputRecipientChange.bind(this);
    this.setViewedMessage = this.setViewedMessage.bind(this);
    this.getMessages = this.getMessages.bind(this);
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
  setViewedMessage(message) {
  	this.setState({viewedMessage: message})
  }
  showMsgContent(msgContent) {
  	this.setState({msgContent: msgContent});
  }

  setComposeRecipient(userName) {
  	console.log('composeRecipient =', userName)
  	this.setState({composeRecipient: userName});
  }

  handleComposeChange(changeEvent) {
    this.setState({ composeContent: changeEvent.target.value });
  }

  handleInputRecipientChange(changeEvent) {
  	this.setState({ composeRecipient: changeEvent.target.value })
  }


  render() {
    return (
		<div>
			<div>
				<form 
					onSubmit={this.sendMessage}
					id="msgForm"
					>
					<br></br>
					<label>Message Content:</label>
					<br></br>
					<textarea 
						rows="6" 
						cols="120" 
						id="showMsgBox" 
						// form="msgForm" 
						value={this.state.msgContent} 
						readOnly
						>
					</textarea>
					<br></br>
					<label>Reponse:</label>
					<br></br>
					<textarea 
						rows="4" 
						cols="120" 
						form="msgForm"
						name="msgBody"
						// value={this.state.composeContent}
						maxLength="1000"
						onChange={this.handleComposeChange}
						>
					</textarea>
					<br></br>
					To: 
					<input 
						type="text" 
						name="recipient"
						// value={this.state.composeRecipient}
						defaultValue={this.state.composeRecipient}
						onChange={this.handleInputRecipientChange}
						/>
					<button
						type="submit"
						>Send
					</button>
				</form>
				<br></br>
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
						{this.state.messagesSent.map((message, index) => (
			                <MessagesSentEntry  key={index} message={message}/>
			             ))}
					</tbody>
				</table>
			</div>
		</div>
    );
  }
}

export default Messages;