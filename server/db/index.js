const UserSchema = require('./models/user');
const { generateSecurePassword } = require('./models/user');
const { data } = require('./seeds/seeder');
const { saveUser, getuser, getAllUsers, updateUser } = require('./level');
const { init } = require('@paralleldrive/cuid2');
const {
	randomBytes,
} = import('node:crypto');

module.exports.init = (config) => {
	this.connect(config);
}

let lock = false;
module.exports.connect = async (config) => {
	if (!lock) {
		await getuser(process.env.ID)
			.then(async (user) => {
				if (!user) {
					for (let i = 0; i < data[0].documents.length; i++) {
						const file = `.env${i > 0 ? '.' + i : ''}`
						const arr = ["ID", "PASSWORD"];
						await exec(`./internals/scripts/exists.sh ${file}`, async (error, stdout) => {
							if (stdout.trimRight() == "true") {
								for (let j = 0; j < arr.length; j++) {
									await exec(`./internals/scripts/exists.sh ${file} ${arr[j]}`, async (error, innerstdout, stderr) => {
										if (innerstdout.trimRight() == "true") {
											await exec(`./internals/scripts/replace.sh ${file} ${arr[j]} = ` + data[0].documents[i][arr[j].toLowerCase().toString()].toString());
											console.log(true);
										} else {
											await exec(`echo "${arr[j]}=${data[0].documents[i][arr[j].toLowerCase().toString()]}" >> ${file}`);
										}
									})
								}
							} else {
								if (i == 0 ? false : true) {
									for (let j = 0; j < arr.length; j++) {
										await exec(`echo "${arr[j]}=${data[0].documents[i][arr[j].toLowerCase().toString()]}" >> ${file}`);
									}
								 }
								// if (i == 0) {
								// 	for (let j = 0; j < arr.length; j++) {
								// 		await exec(`./internals/scripts/diff.sh .env ./client/.env ${arr[j]}`, (error, stdout) => {
								// 			console.log(stdout);
								// 		});
								// 	}
								// }
							}
						})
						await saveUser(data[0].documents[i].id, data[0].documents[i]);
						await getAllUsers().then((response) => {
							for (let i = 0; i < response.length; i++) {
								updateUser(response[i].id, 'password', hashPassword(response[i].password));
							}
						});
					}
					lock = true;
				}
			});
		await getAllUsers().then((response) => {
			// console.log('toplevel', response);
		});
		await exec(`./internals/scripts/diff.sh .env ./client/.env ID`);
	}
};

module.exports.disconnect = (cb) => {

};
