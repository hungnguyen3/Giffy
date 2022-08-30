import styles from '../styles/FileUploadBox.module.scss';
import { ref, uploadBytes } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { storage } from './Firebase/FirebaseInit';

const FileUploadBox = () => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [selectedImgURL, setSelectedImgURL] = useState<string | null>(null);

	const imageMimeType = /image\/*/i; ///image\/(png|jpg|jpeg)/i;

	useEffect(() => {
		let fileReader: FileReader,
			isCancel = false;
		if (selectedFile) {
			fileReader = new FileReader();
			fileReader.onload = e => {
				if (e.target) {
					const { result } = e.target;
					if (result && !isCancel) {
						if (typeof result === 'string') {
							setSelectedImgURL(result);
						}
					}
				}
			};
			fileReader.readAsDataURL(selectedFile);
		}
		return () => {
			isCancel = true;
			if (fileReader && fileReader.readyState === 1) {
				fileReader.abort();
			}
		};
	}, [selectedFile]);

	return (
		<div className={styles.fileUploadBody}>
			{selectedImgURL ? (
				// TODO: style
				<div className={styles.fileUploadContent}>
					<div className={styles.imgPreviewWrapper}>
						<img
							src={selectedImgURL}
							alt="preview"
							className={styles.previewImg}
						></img>
					</div>

					<div className={styles.imageTitleWrap}>
						<button
							type="button"
							// onClick="removeUpload()"
							className={styles.removeImage}
							onClick={() => {
								if (selectedFile) {
									setSelectedFile(null);
									setSelectedImgURL(null);
								}
							}}
						>
							Remove <span className={styles.imageTitle}>Uploaded Image</span>
						</button>
					</div>
				</div>
			) : null}

			<div className={styles.fileUpload}>
				{selectedFile ? (
					console.log(selectedFile)
				) : (
					<div className={styles.imageUploadWrap}>
						<input
							type="file"
							//multiple // TODO: make it ok to do multiple uploads
							className={styles.fileUploadInput}
							onChange={event => {
								if (event.target.files) {
									const file = event.target.files[0];

									if (!file.type.match(imageMimeType)) {
										alert('Image type not valid.');
										return;
									}

									setSelectedFile(file);
								} else setSelectedFile(null);
							}}
							accept="image/*"
						/>
						<div className={styles.dragText}>
							<h3>Drag and drop a file or select add Image</h3>
						</div>
					</div>
				)}

				<button
					className={styles.fileUploadBtn}
					onClick={() => {
						if (selectedFile) {
							const storageRef = ref(storage, `images/${selectedFile.name}`);

							uploadBytes(storageRef, selectedFile)
								.then(snapshot => {
									setSelectedFile(null);
									setSelectedImgURL(null);
									alert('Upload successfully.');
								})
								.catch(() => {
									alert('Upload Failed.');
								});
						}
					}}
				>
					Add Image
				</button>
			</div>
		</div>
	);
};

export default FileUploadBox;
