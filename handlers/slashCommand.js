const { glob } = require('glob');
const { promisify } = require('util');
const { Client } = require('discord.js');

const globPromise = promisify(glob);

/**
 * 
 * @param {Client} client 
 */

module.exports = async(client) => {
    const Files = await globPromise(`${process.cwd()}/slashCommands/**/*.js`);
    const array = [];
    Files.map((v) => {
        const file = require(v);
        const split = v.split('/');
        const dir = split[split.length - 2];
        if(!file?.name) return;
        if(file.name){
            const prop = { dir, ...file };
            client.slashCommands.set(file.name, prop);
            array.push(file)
        }
    });
    // registering slash commands
    client.on('ready', async() => {
        // for a single guild
        await client.guilds.cache.get('887280488341975091')
            .commands.set(array);
        
        // await client.application.commands.set(array) 
    })
}