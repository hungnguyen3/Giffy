import type { NextPage } from 'next';
import styles from '../styles/Home.module.scss';
import SideNav from '../components/sideNav';

const Home: NextPage = () => {
	return (
		<div>
			<SideNav width={'20%'} />
		</div>
	);
};

export default Home;
