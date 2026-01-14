const { Client, GatewayIntentBits } = require('discord.js');
const http = require('http');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const SEGUNDOS_SLOWMODE = 3600;

client.on('threadCreate', async (thread) => {
    try {

        await thread.setRateLimitPerUser(SEGUNDOS_SLOWMODE);
        console.log(`✅ Slow mode of ${SEGUNDOS_SLOWMODE} applied to ${thread.name}`);
    } catch (error) {
        console.error('❌ Error', error);
    }
});

client.once('ready', () => {
    console.log(`Logued as ${client.user.tag}`);
    client.guilds.cache.forEach(async (guild) => {
        const threads = await guild.channels.fetchActiveThreads();
        threads.threads.forEach(async (thread) => {
            if (thread.rateLimitPerUser !== SEGUNDOS_SLOWMODE) {
                await thread.setRateLimitPerUser(SEGUNDOS_SLOWMODE);
                console.log(`Actualizado hilo antiguo: ${thread.name}`);
            }
        });
    });
});

// Servidor web básico para que el hosting no lo apague
http.createServer((req, res) => {
    res.write("The bot is ready for war");
    res.end();
}).listen(8080);


client.login(TOKEN);
