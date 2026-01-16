const { Client, GatewayIntentBits } = require('discord.js');
const http = require('http');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const SEGUNDOS_SLOWMODE = 3600;
const DIPLO = '1444360374903247159';

client.on('threadCreate', async (thread) => {
    if (thread.parentId !== DIPLO && thread.parent?.parentId !== DIPLO) {
        return; 
    }

    setTimeout(async () => {
        try {
            await thread.setRateLimitPerUser(SEGUNDOS_SLOWMODE);
            console.log(`✅ Slow mode of ${SEGUNDOS_SLOWMODE} applied to ${thread.name}`);
        } catch (error) {
            console.error(`❌ Error applying slowmode to ${thread.name}:`, error.message);
        }
    }, 2000);
});

client.once('ready', () => {
    console.log(`Logued as ${client.user.tag}`);
    
    client.guilds.cache.forEach(async (guild) => {
        try {
            const threads = await guild.channels.fetchActiveThreads();
            threads.threads.forEach(async (thread) => {
                const isInDiplo = (thread.parentId === DIPLO || thread.parent?.parentId === DIPLO);

                if (isInDiplo) {
                    if (thread.rateLimitPerUser !== SEGUNDOS_SLOWMODE) {
                        await thread.setRateLimitPerUser(SEGUNDOS_SLOWMODE);
                        console.log(`🛡️ DIPLO: Slowmode set for ${thread.name}`);
                    }
                } else {
                    if (thread.rateLimitPerUser !== 0) {
                        await thread.setRateLimitPerUser(0);
                        console.log(`🔓 REVOKED: Slowmode removed from ${thread.name} (Not in DIPLO)`);
                    }
                }
            });
        } catch (err) {
            console.error("Error fetching threads on ready:", err.message);
        }
    });
});

http.createServer((req, res) => {
    res.write("The bot is ready for war");
    res.end();
}).listen(8080);

setInterval(() => {
    const url = `http://localhost:8080`;
    http.get(url, (res) => {
        console.log('Self-ping sent to stay awake.');
    }).on('error', (err) => {
        console.error('Self-ping error:', err.message);
    });
}, 300000);

client.login(TOKEN);
