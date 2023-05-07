import router from 'next/router';
import React, { useState } from 'react';
import styles from '../styles/CollectionPermissionBox.module.scss';
import { Permission } from '../types/enums/Permission';

export type UserPermission = {
	collectionId: number;
	userEmail: string;
	permission: Permission;
};

type PermissionProps = {
	users: UserPermission[];
	onAddUser: (user: UserPermission) => void;
};

const CollectionPermissionBox: React.FC<PermissionProps> = (props: PermissionProps) => {
	const { collectionId } = router.query;
	const [newUserEmail, setNewUserEmail] = useState('');
	const [newPermission, setNewPermission] = useState(Permission.READ);

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
			permission: newPermission as Permission,
		};

		props.onAddUser(user);
		setNewUserEmail('');
		setNewPermission(Permission.READ);
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
					onChange={(e) => setNewUserEmail(e.target.value)}
				/>
				<select value={newPermission} onChange={(e) => setNewPermission(e.target.value as Permission)}>
					<option value={Permission.READ}>Read</option>
					<option value={Permission.WRITE}>Write</option>
					<option value={Permission.ADMIN}>Admin</option>
				</select>
				<button onClick={handleAddUser}>Add user</button>
			</div>
			<br />
			Users with permissions:
			<ul>
				{props.users.map((user) => {
					if (user.collectionId === Number(collectionId))
						return (
							<li key={user.userEmail}>
								{user.userEmail} -{' '}
								<span className={styles['permission-' + user.permission]}>{user.permission}</span>
							</li>
						);
				})}
			</ul>
		</div>
	);
};

export default CollectionPermissionBox;
