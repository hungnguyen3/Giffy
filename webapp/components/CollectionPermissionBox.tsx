import router from 'next/router';
import React, { useState } from 'react';
import styles from '../styles/CollectionPermissionBox.module.scss';

export type UserPermission = {
	collectionId: number;
	userEmail: string;
	permission: 'read' | 'write' | 'admin';
};

type PermissionProps = {
	users: UserPermission[];
	onAddUser: (user: UserPermission) => void;
};

const Permission: React.FC<PermissionProps> = ({ users, onAddUser }) => {
	const { collectionId } = router.query;
	const [newUserEmail, setNewUserEmail] = useState('');
	const [newPermission, setNewPermission] = useState('read');

	const handleAddUser = () => {
		if (!newUserEmail) {
			return;
		}

		if (!['read', 'write', 'admin'].includes(newPermission)) {
			return;
		}

		const user: UserPermission = {
			collectionId: Number(collectionId),
			userEmail: newUserEmail,
			permission: newPermission as 'read' | 'write' | 'admin',
		};
		onAddUser(user);
		setNewUserEmail('');
		setNewPermission('read');
	};

	return (
		<div className={styles['permission-container']}>
			<hr />
			Add new user:
			<br />
			<div>
				<input
					type="text"
					placeholder="User Email"
					value={newUserEmail}
					onChange={e => setNewUserEmail(e.target.value)}
				/>
				<select
					value={newPermission}
					onChange={e => setNewPermission(e.target.value)}
				>
					<option value="read">Read</option>
					<option value="write">Write</option>
					<option value="admin">Admin</option>
				</select>
				<button onClick={handleAddUser}>Add user</button>
			</div>
			<br />
			Users with permissions:
			<ul>
				{users.map(user => (
					<li key={user.userEmail}>
						{user.userEmail} - {user.permission}
					</li>
				))}
			</ul>
		</div>
	);
};

export default Permission;
