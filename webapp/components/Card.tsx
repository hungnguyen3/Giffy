import styles from '../styles/Card.module.scss';

interface CardProps {
	img: string;
	name: string;
	likeCount: number;
}

const Card = (props: CardProps) => {
	return (
		<div className={styles.card}>
			<div className={styles.cardImage}>
				<img src={props.img} alt="Avatar" />
			</div>

			<div className={styles.cardTitle}>
				<p>{props.name}</p>
				{/* <p>{props.likeCount}</p> */}
			</div>
		</div>
	);
};

export default Card;
