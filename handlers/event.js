const { glob } = require('glob');
const { promisify } = require('util');
const { Client } = require('discord.js');

const globPromise = promisify(glob);

/**
 * 
 * @param {Client} client 
 */

module.exports = async(client) => {
    const Files = await globPromise(`${process.cwd()}/events/*.js`);
    Files.map(v => require(v));
}