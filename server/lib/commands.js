const core = require('./core');
const such = require('./such');

const commands = module.exports.commands = [
  ...core
  // ,...such
]

module.exports.is_command = (command) => {
  command = command.toLowerCase()
  for (var i = 0, len = commands.length; i < len; i++) {
    if (commands[i].toLowerCase() === command) {
      return true
    }
  }
}
