import React from 'react';
// import { Table, TableHeader, TableBody, TableRow, TableRowColumn } from 'material-ui';


const MessagesSentEntry = ({message, showMsgContent, setComposeRecipient, setViewedMessage})=> (
	<tr>
		<td style={{width:'20%'}}>
			{message.send_date.toString()}
		</td>
		<td style={{width:'15%'}}>
			{message.recipient}
		</td>
		<td style={{width:'40%'}}>
			<a 
		 		href="#" 
		 		onClick={()=>{
		 		showMsgContent(message.message);
		 		}}
		 	>
		 	{message.subject}
		 	</a>
		</td>
		<td style={{width:'15%'}}>
			recipients
		</td>
		<td style={{width:'10%'}}>
			Visit Profile
		</td>						
	</tr>
)

export default MessagesSentEntry;
