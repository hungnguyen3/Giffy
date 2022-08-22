import type { NextPage } from 'next';
import FileUploadBox from '../components/FileUploadBox';
import Layout from '../components/Layout';

const Home: NextPage = () => {
	return (
		<Layout>
			<div></div>
			<FileUploadBox />
		</Layout>
	);
};

export default Home;
