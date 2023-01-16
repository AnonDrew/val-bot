import { ChatInputCommandInteraction, Client, Interaction } from "discord.js";
import { importContents } from "../utils";
import * as handlers from "../handlers";

function cmdOrSubCmd(interaction: ChatInputCommandInteraction): Function {
    const subcommand = interaction.options.getSubcommand(false);

    if (subcommand !== null) {
        return importContents<Function>(handlers).find(handler => handler.name === subcommand);
    }
    return importContents<Function>(handlers).find(handler => handler.name === interaction.commandName);
}

export function interactionCreate(client: Client) {
    client.on("interactionCreate", async (interaction: Interaction): Promise<void> => {
        if (interaction.isChatInputCommand()) {
            cmdOrSubCmd(interaction)(interaction, client);
        }
        else if (interaction.isRepliable()) {
            interaction.reply({
                ephemeral: true,
                content: "This interaction is not being handled properly.",
            });
        }
    });
}
