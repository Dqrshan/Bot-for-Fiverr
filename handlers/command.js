const { glob } = require('glob');
const { promisify } = require('util');
const { Client } = require('discord.js');

const globPromise = promisify(glob);

/**
 * 
 * @param {Client} client 
 */

module.exports = async(client) => {
    const Files = await globPromise(`${process.cwd()}/commands/**/*.js`);
    Files.map((v) => {
        const file = require(v);
        const split = v.split('/');
        const dir = split[split.length - 2];

        // command name
        if(file.name){
            const prop = { dir, ...file };
            client.commands.set(file.name, prop);
        };

        // aliases
        if(file.aliases && Array.isArray(file.aliases)){
            file.aliases.forEach((alias) => {
                client.aliases.set(alias, file.name);
            })
        }
    })
}