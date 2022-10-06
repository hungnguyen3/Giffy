import type { NextPage } from 'next';
import { useState } from 'react';
import FileUploadBox from '../../components/FileUploadBox';
import Layout from '../../components/Layout';
import styles from '../../styles/uploadGiffy.module.scss';

const UploadGiffy: NextPage = () => {
	const [isInputMenuOpen, setIsInputMenuOpen] = useState<boolean>(false);
	return (
		<Layout>
			<div className={styles.uploadBox}>
				Collection: &nbsp;
				<div className={styles.collections}>
					<input
						type="text"
						onClick={() => {
							setIsInputMenuOpen(!isInputMenuOpen);
						}}
						onBlur={() => {
							setIsInputMenuOpen(false);
						}}
					></input>
					{isInputMenuOpen ? (
						<div className={styles.dropdownContent}>
							<ul className={styles.collectionList}>
								<li>Collection 1</li>
								<li>Collection 2</li>
								<li>Collection 3</li>
							</ul>
						</div>
					) : (
						<div></div>
					)}
				</div>
				<div></div>
				<FileUploadBox />
			</div>
		</Layout>
	);
};

export default UploadGiffy;
