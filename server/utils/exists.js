const exists = (file) => {
    exec(`./internals/scripts/exists.sh ${file}`, (error, stdout) => {
        if (stdout.trimRight()=="true") {
            return true;
        } else {
            return false;
        };
    });
};

module.exports = {
    exists
}
