const { Level } = require('level');
const db = new Level(process.env.DB_PATH + '/users');
const dogeauth = require('dogeauth');
const { JsonToArray, binArrayToJson } = require('../utils/json');

module.exports = {
    async saveUser(user, data) {
        const encoded = Buffer.from(JsonToArray(JSON.stringify(data)));
        const encrypted = dogeauth.encrypt(process.env.PRIVATE_KEY_HEX, encoded.toString('hex'));
        return await db.put(user, encrypted);
    },
    async getAllUsers() {
        const users = []
        for await (const value of db.iterator()) {
            const decrypted = dogeauth.decrypt(process.env.PRIVATE_KEY_HEX, value[1]);
            const decoded = binArrayToJson(Buffer.from(decrypted, 'hex'));
            const user = JSON.parse(decoded);
            decoded.id = value[0];
            users.push(user)
        }
        return users
    },
    async getuser(user) {
        return await db.get(user)
            .then(function (value) {
                const decrypted = dogeauth.decrypt(process.env.PRIVATE_KEY_HEX, value);
                return JSON.parse(binArrayToJson(Buffer.from(decrypted, 'hex')));
            })
            .catch(function (err) {
                if (err) {
                    if (err.notFound) {
                        // handle a 'NotFoundError' here
                        return null
                    }
                }
                throw err
            })
    },
    async updateUser(user, key, data) {
        return await db.get(user)
        .then(async (value) => {
            const decrypted = dogeauth.decrypt(process.env.PRIVATE_KEY_HEX, value);
            value = JSON.parse(binArrayToJson(Buffer.from(decrypted, 'hex')));
            value[key] = data;
            const encoded = Buffer.from(JsonToArray(JSON.stringify(value)));
            const encrypted = dogeauth.encrypt(process.env.PRIVATE_KEY_HEX, encoded.toString('hex'));
            db.put(user, encrypted);
            delete value[key];
            delete value.sin.priv;
            return value;
        });
    },
    async deleteUser(user, key) {
        return await db.del(user.id)
        .then((value) => {
            console.log('deleteUser: ', value);
            return value;
        })
        .catch((err) => {
            return err;
        });
    },
}

exports.base = db;
