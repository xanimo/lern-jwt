import { such, core } from '../lib';

const commands = [
  // ...such,
  ...core
]

commands.is_command = (command) => {
  command = command.toLowerCase()
  for (var i = 0, len = commands.length; i < len; i++) {
    if (commands[i].toLowerCase() === command) {
      return true
    }
  }
}

export default commands
