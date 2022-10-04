import type { NextPage } from 'next';
import Layout from '../../components/Layout';
import Link from 'next/link';

const Collections: NextPage = () => {
	return (
		<Layout>
			<div>this is where all the collections should be</div>
			<button>
				<Link href="/collections/uploadGiffy">
					<a>Create a new Giffy</a>
				</Link>
			</button>
		</Layout>
	);
};

export default Collections;
