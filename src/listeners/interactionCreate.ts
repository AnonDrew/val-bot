import { Client } from "discord.js";
import { importContents } from "../utils";
import * as handlers from "../handlers";

export function interactionCreate(client: Client) {
    client.on("interactionCreate", interaction => {
        if (interaction.isChatInputCommand()) {
            const command = interaction.options.getSubcommand(false) ?? interaction.commandName;
            importContents<Function>(handlers).find(handler => handler.name === command)(interaction);
        }
        else if (interaction.isStringSelectMenu()) {
            // I don't know if this does anything
            // but someone can dismiss the select menu while the interaction is loading
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
