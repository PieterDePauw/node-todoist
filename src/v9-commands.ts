
/**===================================**
 *   CREATE A COMMANDS ARRAY
/*====================================**/

import { deepcopy } from "./utils";
import { Command, CommandsArrayFunctions } from "./v9-interfaces";

// Use createCommandsArray function to create a commands array
const createCommandsArray = (initArray: Command[]): CommandsArrayFunctions => {
  // Create an array to store the commands
  let commandsArray: Command[] = deepcopy(initArray);
  // Return the functions to interact with the commands array
  return {
    // The getCommands function returns a copy of the commands array
    getCommands: () => {
      const returnedCommandArray: Command[] = deepcopy(commandsArray);
      return returnedCommandArray;
    },

    // The clearCommands function clears the commands array
    clearCommands: () => {
      commandsArray = [];
      const returnedCommandArray: Command[] = deepcopy(commandsArray);
      return returnedCommandArray;
    },

    // The addCommand function adds a command to the commands array
    addCommand: (command: Command) => {
      commandsArray.push(command);
      const returnedCommandArray: Command[] = deepcopy(commandsArray);
      return returnedCommandArray;
    },
  };
}
const { getCommands, clearCommands, addCommand } = createCommandsArray([]);

export { getCommands, clearCommands, addCommand };