import { Client, Collection } from "discord.js";
import { commands } from "./commands";
import { importContents } from "./utils";
import * as handlers from "./handlers";

let cooldowns = new Collection<string, number>();

export function ready(client: Client) {
    client.once("ready", async () => {
        await client.application.commands.set(commands);
        console.log(`${client.user.username} is ready`);
    });
}

export function interactionCreate(client: Client) {
    client.on("interactionCreate", interaction => {
        const { user } = interaction.member, cooldown = 15000/*ms*/;
        if (interaction.isChatInputCommand()) {
            const command = interaction.options.getSubcommand(false) ?? interaction.commandName;
            
            if (command === "valgrind" && cooldowns.has(user.id)) {
                interaction.reply({
                    ephemeral: true,
                    content: `There is a ${cooldown/1000} second cooldown before you can run this command again.`,
                });
                return;
            }
            else {
                cooldowns.set(user.id, cooldown)
                setTimeout(() => cooldowns.delete(user.id), cooldown);
            }

            importContents<Function>(handlers).find(handler => handler.name === command)(interaction);
        }
        else if (interaction.isStringSelectMenu()) {
            // I don't know if this try-catch does anything
            // but someone can dismiss an ephemeral select menu while the interaction is loading
            // Discord please fix
            try {
                importContents<Function>(handlers).find(handler => handler.name === interaction.customId)(interaction);
            }
            catch (er) {
                console.log(er);
            }
        }
        else if (interaction.isRepliable()) {
            interaction.reply({
                ephemeral: true,
                content: "This interaction is not being handled properly.",
            });
        }
    });
}