import React from 'react';
import ReactDOM from 'react-dom/client';

const Popup: React.FC = () => {
	return <div>Popup Page</div>;
};

const root = ReactDOM.createRoot(
	document.getElementById('popup') as HTMLElement
);

root.render(
	<React.StrictMode>
		<Popup />
	</React.StrictMode>
);
