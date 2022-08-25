import styles from '../styles/FileUploadBox.module.scss';
import { ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { storage } from './Firebase/FirebaseInit';

const FileUploadBox = () => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	return (
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
								const storageRef = ref(storage, `images/${selectedFile.name}`);
								uploadBytes(storageRef, selectedFile)
									.then(snapshot => {
										alert('Uploaded Successfully.');
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
	);
};

export default FileUploadBox;
