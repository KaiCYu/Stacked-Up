import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Main from './Main.jsx';
import '../dist/styles.css';


class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}
	render() {
		return (
			<div className='site'>
				<Router>
					<div className='conditionals-container'>
						<Navbar />
						<div className='currentPage'>
							<Route 
								path="/main" render={() => (
									<Main/>
								)}
							/>
							<Route 
								path="/search"
							/>
							<Route 
								path="/login"
							/>

						</div>
					</div>
				</Router>
			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('app'));

