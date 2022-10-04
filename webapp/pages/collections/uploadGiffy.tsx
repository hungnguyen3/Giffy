import type { NextPage } from 'next';
import FileUploadBox from '../../components/FileUploadBox';
import Layout from '../../components/Layout';
import styles from '../../styles/uploadGiffy.module.scss';

const UploadGiffy: NextPage = () => {
	return (
		<Layout>
			<div>
				<div className="dropdownArea">
					<input type="text"></input>
					<div className={styles.dropdownContent}>
						<ul>
							<li>Collection 1</li>
							<li>Collection 2</li>
							<li>Collection 3</li>
						</ul>
					</div>
				</div>

				<FileUploadBox />
			</div>
		</Layout>
	);
};

export default UploadGiffy;
