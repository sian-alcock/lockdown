import { h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style.css';

const Header = () => (
	<header class={style.header}>
		<h1>Lockdown Countdown</h1>
		<nav>
			<Link activeClassName={style.active} href="/">Letters</Link>
			<Link activeClassName={style.active} href="/numbers">Numbers</Link>
		</nav>
	</header>
);

export default Header;
