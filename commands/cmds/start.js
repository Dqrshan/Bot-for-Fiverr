const { MessageEmbed, Client, Message, MessageActionRow, MessageButton } = require('discord.js');
const { stripIndents } = require("common-tags");
const db = require("../../models/db");

module.exports = {
    name: 'start',
    description: 'starts your dog adventure',
    cooldown: 5000,

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        let data = await db.findOne({ id: message.author.id });
        if(data) return message.reply(`:x: You already own a dog!`);

        const button = (state) => [
            new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setLabel("I ACCEPT")
                        .setStyle("SUCCESS")
                        .setCustomId("name")
                        .setDisabled(state)
                )
            ];

        const msg = await message.reply({
            content: stripIndents`
            Congratulations **${message.author.username}**! You have successfully started your adventure!

            > Please accept by clicking the button below if you are ready for this adventure
            `,
            components: button(false)
        })

        const filter = (i) => i.user.id === message.author.id && i.customId === "name";
        const collector = await msg.createMessageComponentCollector({
            filter,
            time: 10000,
            max: 1
        })

        collector.on("collect", async (i) => {
            if (i.customId === "name") {
                await i.reply({ content: `:tada: Congrats! Your dog's name is **${message.author.username}'s dog**!`, ephemeral: false })
                if(!data){
                    data = new db({
                        id: message.author.id,
                        dog: `${message.author.username}'s dog`
                    });
                    data.save();
                }
                // await db.findOne({ guild: message.guild.id, user: message.author.id }, async(err, data) => {
                //     if(err) throw err;
                //     if(!data){
                //         data = new db({
                //             guild: message.guild.id,
                //             user: message.author.id,
                //             dog: `${message.author.username}'s dog`
                //         }).save()
                //     }
                // })
            }
        });

        collector.on("end", async (x) => {
            console.log(`${message.author.tag} click ${x.size} times`)
            collector.stop();
            msg.edit({ components: button(true) })
        })
    }
}