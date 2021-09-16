const client = require('../index');
const { prefix } = require('../config.json');
const ms = require("pretty-ms");

client.on('messageCreate', async(message) => {
    if(!message.content.toLowerCase().startsWith(prefix) || 
        !message.guild ||
        message.author.bot) return;
    
    const [command, ...args] = message.content.slice(prefix.length).trim().split(' ');

    const cmd = client.commands.get(command.toLowerCase()) || 
                client.commands.get(client.aliases.get(command.toLowerCase())); 
    if(!cmd) return;
    if(cmd){
        if(cmd.cooldown){
            if(client.cooldown.has(`${cmd.name}+${message.author.id}`))
            return message.reply(`Wait \`${ms(client.cooldown.get(`${cmd.name}+${message.author.id}`) - Date.now(), { compact: true, verbose: true })}\` before using the command again`);
            await cmd.run(client, message, args);

            client.cooldown.set(`${cmd.name}+${message.author.id}`, Date.now() + cmd.cooldown);
            setTimeout(() => {
               client.cooldown.delete(`${cmd.name}+${message.author.id}`) 
            }, cmd.cooldown);
            return;
        }
    }
    await cmd.run(client, message, args);
}) 