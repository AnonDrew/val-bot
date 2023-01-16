import { ChatInputCommandInteraction, Client, EmbedBuilder } from "discord.js";
import { msToDHMS } from "../utils";

export function ping(interaction: ChatInputCommandInteraction, client: Client) {
    const embed = new EmbedBuilder()
    .setColor("#e39717")
    .setDescription(
        "I haven't crashed yet? Nice.\n\n" +
        "**Latency:** " + (Date.now() - interaction.createdTimestamp).toString() + "ms\n" +
        "**Ping:** " + client.ws.ping + "ms\n" +
        "**Uptime:** " + msToDHMS(client.uptime)
    )
    .setFooter({
        text: "Latency is the one you care about.. I think..."
    });

    interaction.reply({
        ephemeral: true,
        embeds: [ embed ],
    });
}
