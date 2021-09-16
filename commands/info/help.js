const { Message, Client, MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
const { stripIndents } = require("common-tags");
const ms = require("pretty-ms");

module.exports = {
    name: "help",
    aliases: ["commands"],
    description: "Shows list of all available commands",
    usage: "[category/command]",
    example: "ping",
    
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        const helpEmbed = new MessageEmbed()
        .setTitle("Here is a list of my commands")
        .setDescription(stripIndents`
        Use the select menu to scroll between categories.
        __**Categories:**__
        > Economy
        > Info

        Use \`-help <category>\` for commands in a category.
        Use \`-help <command>\` for a single command information.

        `)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setThumbnail(client.user.displayAvatarURL())
        .setImage("https://media.discordapp.net/attachments/872841507185504276/887565932275314698/unknown.png")
        .setColor("WHITE")

        const menu = (state) => [
            new MessageActionRow().addComponents(
                new MessageSelectMenu()
                .setCustomId("help-menu")
                .setPlaceholder("Click here to scroll between categories")
                .setDisabled(state)
                .addOptions({
                    label: "Information",
                    emoji: "💡",
                    description: "Information commands",
                    value: "info"
                }, {
                    label: "Economy",
                    emoji: "🌸",
                    description: "Economy commands",
                    value: "eco"
                }, {
                    label: "Main",
                    emoji: "🤖",
                    description: "Help embed",
                    value: "help"
                })
            )
        ];

        const info = new MessageEmbed()
        .setTitle("Information commands")
        .setDescription("`help`, `ping`")
        .setFooter(`Requested by ${message.author.tag}`)
        .setThumbnail(client.user.displayAvatarURL())
        .setImage("https://media.discordapp.net/attachments/872841507185504276/887565932275314698/unknown.png")
        .setColor("WHITE")

        const eco = new MessageEmbed()
        .setTitle("Economy commands")
        .setDescription("`bal`, `buy`, `feed`, `give`, `hunt`, `image`, `inventory`, `leaderboard`, `name`, `shop`, `start`, `set`")
        .setFooter(`Requested by ${message.author.tag}`)
        .setThumbnail(client.user.displayAvatarURL())
        .setImage("https://media.discordapp.net/attachments/872841507185504276/887565932275314698/unknown.png")
        .setColor("WHITE")

        if(!args.length){
            await message.channel.send({
                embeds: [helpEmbed],
                components: menu(false)
            })
            .then(msg => {
                const filter = (i) => i.isSelectMenu() && i.customId === "help-menu" && i.user.id === message.author.id;

                const collector = message.channel.createMessageComponentCollector({
                    filter,
                    time: 1000 * 30
                });

                collector.on("collect", async(x) => {
                    const val = x.values[0];
                    await x.deferUpdate();
                    if(val === "info"){
                        msg.edit({ embeds: [info], components: menu(false) })
                    } else if(val === "eco"){
                        msg.edit({ embeds: [eco], components: menu(false)})
                    } else if(val === "help"){
                        msg.edit({ embeds: [helpEmbed], components: menu(false) })
                    }
                });

                collector.once("end", () => {
                    msg.edit({ components: menu(true) })
                })
            })
        } else if(args[0].toLowerCase() === "information"){
            message.channel.send({ embeds: [info] })
        } else if(args[0].toLowerCase() === "economy"){
            message.channel.send({ embeds: [eco] })
        } else {
            const command = client.commands.get(args[0].toLowerCase()) ||
            client.commands.get(client.aliases.get(args[0].toLowerCase()));

            if(!command) return message.react("⚠");

            const newEmbed = new MessageEmbed()
            .setTitle(`ℹ ${command.name} details`)
            .setDescription(`${command.description ? command.description : null}`)
            .addField("> Format",`\`${command.usage ? `-${command.name} ${command.usage}` : `-${command.name}`}\``)
            .setFooter(`Requested by ${message.author.tag} | []: Optional | <>: Mandatory`)
            .setThumbnail(client.user.displayAvatarURL())
            .setColor("WHITE")
            
            if(command.example) newEmbed.addField("> Example", `\`-${command.name} ${command.example}\``)
            if(command.aliases) newEmbed.addField("> Aliases", `${command.aliases.map(alias => `\`${alias}\``).join(", ")}`);
            if(command.cooldown) newEmbed.addField("> Cooldown", `${ms(command.cooldown, { verbose: true })}`);

            return message.channel.send({ embeds: [newEmbed] })
        }
    }
}