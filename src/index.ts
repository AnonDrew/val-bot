import { token } from "./config.json";
import { Client, GatewayIntentBits, Partials } from "discord.js";
import { importContents } from "./utils";
import * as listeners from "./listeners";

console.log("Bot is starting...");

const bot = new Client({
    intents: [ 
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
    ],
    partials: [ 
        Partials.Channel,
    ],
});

importContents<Function>(listeners).forEach(listener => listener(bot));

bot.login(token);
