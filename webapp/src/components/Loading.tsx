import layoutStyles from '../styles/Layout.module.scss';

export const Loading = () => {
	return (
		<div
			className={layoutStyles.centeredBox}
			style={{ width: '100vw', height: '100vh' }}
		>
			<h3>Loading...🚀🚀</h3>
		</div>
	);
};
