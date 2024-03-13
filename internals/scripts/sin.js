var dogeauth = require('dogeauth');

const init = (publickey) => {
    if (process.argv.length === 2) {
        console.error('Expected at least one argument!');
        process.exit(1);
      }
    return dogeauth.getSinFromPublicKey(publickey);
}

console.log(init(process.argv[2]))
