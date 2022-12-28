import { useAppDispatch } from '../hooks';
import layoutStyles from '../styles/Layout.module.scss';
import { close as closeAccountSetting } from '../slices/AccountSettingSlice';
import { closeUploadGiffyWindow } from '../slices/CollectionsSlice';

interface ModalProps {
	children: (JSX.Element | null)[] | JSX.Element;
}

const Modal = (props: ModalProps) => {
	const dispatch = useAppDispatch();

	return (
		<div className={layoutStyles.modal}>
			<div className={layoutStyles.modalContent}>
				<span
					className={layoutStyles.closeIcon}
					onClick={() => {
						dispatch(closeAccountSetting());
						dispatch(closeUploadGiffyWindow());
					}}
				>
					x
				</span>
				{props.children}
			</div>
		</div>
	);
};

export default Modal;
