import type { NextPage } from 'next';
import { useState } from 'react';
import Collections from '.';
import FileUploadBox from '../../components/FileUploadBox';
import Layout from '../../components/Layout';
import styles from '../../styles/uploadGiffy.module.scss';

interface GiffyInfo {
	collectionName: string;
	giffyName: string;
}

const UploadGiffy: NextPage = () => {
	const [isInputMenuOpen, setIsInputMenuOpen] = useState<boolean>(false);
	const [giffyInfo, setGiffyInfo] = useState<GiffyInfo>(); // TODO
	return (
		<Layout>
			<div className={styles.uploadBox}>
				<div className={styles.collections}>
					Collection: &nbsp;
					<input
						type="text"
						onFocus={() => {
							setIsInputMenuOpen(!isInputMenuOpen);
						}}
						onBlur={() => {
							setIsInputMenuOpen(false);
						}}
						onChange={event => {
							setCollectionName(event.target.value);
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

				<div className={styles.name}>
					Giffy name (Optional): &nbsp;
					<input
						type="text"
						onChange={event => {
							setGiffyName(event.target.value);
						}}
					></input>
				</div>
				<FileUploadBox />
			</div>
		</Layout>
	);
};

export default UploadGiffy;
