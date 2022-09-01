import type { NextPage } from 'next';
import FileUploadBox from '../components/FileUploadBox';
import Layout from '../components/Layout';

const Collections: NextPage = () => {
	return (
		<Layout>
			<FileUploadBox />
		</Layout>
	);
};

export default Collections;
