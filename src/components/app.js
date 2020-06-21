import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Header from './header';
import baseroute from '../../baseroute'; // <-- make sure path correctly


// Code-splitting is automated for routes
import Numbers from '../routes/numbers';
import Letters from '../routes/letters';
import LettersNew from '../routes/lettersNew';

export default class App extends Component {
	
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	render() {
		return (
			<div id="app">
				<Header />
				<Router onChange={this.handleRoute}>
					<Letters path={`${baseroute}/`} />
					<Numbers path={`${baseroute}/numbers`} />
					<LettersNew path={`${baseroute}/lettersNew`} />

				</Router>
			</div>
		);
	}
}
