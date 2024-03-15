/**
*
* SearchBar
*
*/

import React, { useState, useEffect } from 'react';
import { client } from '../../utils';

const SearchBar = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [users, setUsers] = useState("");
	const [searchInput, setSearchInput] = useState("");
	
	useEffect(() => {
		async function fetchData() {
		  try {
			const users = await client.getUsers();
			setUsers(users);
			setLoading(false);
		  } catch (error) {
			setError(error);
			setLoading(false);
		  }
		}
	
		fetchData();
	  }, []);

	if (loading) {
	return <div>Loading...</div>;
	}

	if (error) {
	return <div>Error: {error.message}</div>;
	}
	
	const onInputChange = (e) => {
		e.preventDefault();
		setSearchInput(e.target.value);
	};

	const flatten_object = (object) => {
		let result = {};
		for (const i in object) {
			if ((typeof object[i]) === 'object' && !Array.isArray(object[i])) {
				const temp = flatten_object(object[i]);
				for (const j in temp) {
					result[j] = temp[j];
				}
			} else {
				result[i] = object[i];
			}
		}
		return result;
	};
	
	const filteredData = users.filter((user) => {
		user = flatten_object(user);
		if (searchInput === '') {
			return user;
		} else {
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
							{Object.keys(flatten_object(users)).map((value, index) => {
								return <th scope="col" key={index}>{value}</th>	

							})}
						</tr>
					</thead>
					<tbody>
						{filteredData.map((user, index) => {
							return (
								<tr key={index}>
									<td>{user.id}</td>
									<td>{user.sin.created}</td>
									<td>{user.sin.pub}</td>
									<td>{user.sin.sin}</td>
									<td>{user.role}</td>
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
