import { h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style.css';
import baseroute from '../../baseroute'; // <-- make sure path correctly


const Header = () => (
	<header class={style.header}>
		<h1>Lockdown Countdown</h1>
		<nav>
			<Link activeClassName={style.active} href={`${baseroute}/`}>Letters</Link>
			<Link activeClassName={style.active} href={`${baseroute}/numbers`}>Numbers</Link>
			{/* <Link activeClassName={style.active} href={`${baseroute}/lettersNew`}>New letters using hooks</Link> */}
		</nav>
	</header>
);

export default Header;
