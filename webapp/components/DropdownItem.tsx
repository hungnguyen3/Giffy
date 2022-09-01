import { IconType } from 'react-icons';
import styles from '../styles/DropdownItem.module.scss';
import { BiLogOut } from 'react-icons/bi';

interface dropdownItemProps {
	icon: IconType;
	text: string;
}

const dropdownItem = (props: dropdownItemProps) => {
	return (
		<div className={styles.dropdown}>
			<div className={styles.icon}></div>
			<props.icon />

			<div className={styles.textContainer}>{props.text}</div>
		</div>
	);
};

export default dropdownItem;
