const { Client, Message, MessageEmbed } = require('discord.js');
const { inspect } = require('util');

module.exports = {
    name: 'eval',
    description: 'Owner-only command to evaluate javascript code.',
    usage: '<code>',
    /**
    * @param {Client} client,
    * @param {Message} message,
    * @param {String[]} args
    */
    run: async(client, message, args) =>{
        if(message.author.id !== "838620835282812969") return message.react("Eval command may be used by the owner only");

        const msg = message;

        let code = args.join(" ");
        if(!code) return message.reply(`\`-eval <code>\``);
        // if(args[0].toLowerCase() === 'client') return message.react(warn);
        
        if(code.startsWith('```') && code.endsWith('```')) {
			code = code.replace(/(^.*?\s)|(\n.*$)/g, '');
		};

        let diff;
        try {
            const hrTime = process.hrtime();
            diff = process.hrtime(hrTime);
            const result = await eval(code);
            let output = result;
            if(output.length > 1800) return message.reply(`Evaluated content is too long to display`);
            if(typeof result !== "string"){
                output = inspect(result, { depth: 0 });
                if(output.length > 1800) return message.reply(`Evaluated content is too long to display`);
            }
            if(code.includes("token")) return message.reply({ content:` Executed in \`${diff[0] > 0 ? `${diff[0]}s ` : ''}${diff[1] / 100000}\`ms.\n\`\`\`js\n'-snip-'\n\`\`\`` })
            message.reply({ content: `Executed in \`${diff[0] > 0 ? `${diff[0]}s ` : ''}${diff[1] / 1000000}\`ms.\n\`\`\`js\n${output}\n\`\`\``, split: true  })
        } catch (error) {
            message.reply(`Error while evaluating code: \`${error}\``)
        }
    }
}
