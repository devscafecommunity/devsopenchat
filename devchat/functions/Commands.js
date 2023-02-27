
let commands = [
    {
        name: "help",
        description: "Shows all commands",
        usage: "help",
        aliases: [
            "commands",
            "cmds",
            "cmd",
            "h",
        ],
        execute: function(args) {
            let message = "Commands:"

            for (let i = 0; i < commands.length; i++) {
                message += "\n" + commands[i].usage + " - " + commands[i].description
            }

            return message
        }
    }
]

// Function for process Commands
function processCommand(command) {
    let args = command.split(" ")
    let commandName = args[0]
    args.shift()

    for (let i = 0; i < commands.length; i++) {
        if (commands[i].name == commandName || commands[i].aliases.includes(commandName)) {
            return commands[i].execute(args)
        }
    }

    return "Command not found!"
}


// Test
// console.log(processCommand("help"))
// console.log(processCommand("h"))


// Export
module.exports = {
    processCommand: processCommand,
}