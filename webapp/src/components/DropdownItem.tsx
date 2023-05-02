import { IconType } from 'react-icons';
import styles from '../styles/DropdownItem.module.scss';

interface DropdownItemProps {
	icon: IconType;
	text: string;
}

const DropdownItem = (props: DropdownItemProps) => {
	return (
		<div className={styles.dropdown}>
			<div className={styles.icon}></div>
			<props.icon />

			<div className={styles.textContainer}>{props.text}</div>
		</div>
	);
};

export default DropdownItem;
