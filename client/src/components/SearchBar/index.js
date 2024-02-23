/**
*
* SearchBar
*
*/

import React, { useState } from 'react';
import { client } from '../../utils';

const SearchBar = () => {
	const [searchInput, setSearchInput] = useState("");
	const [users, setUsers] = useState(client.getUsers());

	const onInputChange = (e) => {
		e.preventDefault();
		setSearchInput(e.target.value);
	};

	const filteredData = users.filter((user) => {
		//if no input the return the original
		if (searchInput === '') {
			return user;
		}
		//return the item which contains the user input
		else {
			return Object.values(user).join('').toLowerCase().includes(searchInput.toLowerCase());
		}
	});

	return (
		<div className="form-group">
			<div className="form-group rounded shadow-pop-tl">
				<label htmlFor="search" className="sr-only">Search Bar</label>
				<input name="search"
					className="form-control rounded"
					type="search"
					placeholder="Search here"
					onChange={onInputChange}
					value={searchInput} autoFocus />
			</div>
			<div className="table-responsive small form-group rounded shadow-pop-tl alert-success alert-dismissible fade show">
				<table className="table table-striped table-sm rounded">
					<thead>
						<tr>
							{Object.keys(users[0]).map((value, index) => {
								return <th scope="col" key={index}>{value}</th>
							})}
						</tr>
					</thead>
					<tbody>
						{filteredData.map((user, index) => {
							return (
								<tr key={index}>
									<td>{user._id}</td>
									<td>{user.firstName}</td>
									<td>{user.lastName}</td>
									<td>{user.email}</td>
									<td>{user.role}</td>
									<td>{user.createdAt}</td>
									<td>{user.updatedAt}</td>
									<td>{user.__v}</td>
									<td>{user.iat}</td>
									<td>{user.expiresAt}</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default SearchBar
