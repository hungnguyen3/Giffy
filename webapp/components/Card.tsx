import styles from '../styles/Card.module.scss';

interface CardProps {
	img: string;
	name: string;
	likeCount: number;
}

const Card = (props: CardProps) => {
	return (
		<div className={styles.card}>
			<img src={props.img} alt="Avatar" />
			<div className={styles.container}>
				<h4>
					<b>{props.name}</b>
				</h4>
				<p>{props.likeCount}</p>
			</div>
		</div>
	);
};

export default Card;
