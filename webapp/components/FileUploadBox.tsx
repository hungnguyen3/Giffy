import styles from '../styles/FileUploadBox.module.scss';
import { ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { storage } from './Firebase/FirebaseInit';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const FileUploadBox = () => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const userAuth = useSelector((state: RootState) => state.userAuth.value);

	return userAuth ? (
		<div className={styles.fileUploadBox}>
			<form className={styles.uploadForm}>
				<input
					type="file"
					multiple
					name="file"
					className={styles.formInput}
					onChange={event => {
						if (event.target.files) {
							setSelectedFile(event.target.files[0]);
						} else {
							setSelectedFile(null);
						}
					}}
				/>
				<p className={styles.uploadHintText}>
					Drag your files here or click in this area.
				</p>
				<div>
					<button
						className={styles.formButton}
						onClick={() => {
							if (selectedFile)
								if (selectedFile) {
									const storageRef = ref(
										storage,
										`images/${selectedFile.name}`
									);
									uploadBytes(storageRef, selectedFile)
										.then(snapshot => {
											alert('Uploaded Sucessfully.');
										})
										.catch(() => {
											alert('Upload Failed.');
										});
								}
						}}
					>
						Submit
					</button>
				</div>
			</form>
		</div>
	) : (
		<div></div>
	);
};

export default FileUploadBox;
