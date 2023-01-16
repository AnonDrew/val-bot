import { Client, ContextMenuCommandBuilder, SlashCommandBuilder } from "discord.js";
import { importContents } from "../utils";
import * as commands from "../commands";

export function ready(client: Client) {
    client.once("ready", async () => {
        await client.application.commands.set(importContents<SlashCommandBuilder | ContextMenuCommandBuilder>(commands));
        console.log(`${client.user.username} is ready`);
    });
}
