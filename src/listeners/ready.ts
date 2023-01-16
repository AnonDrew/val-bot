import { Client } from "discord.js";
import { commands } from "../commands";

export function ready(client: Client) {
    client.once("ready", async () => {
        await client.application.commands.set(commands);
        console.log(`${client.user.username} is ready`);
    });
}
