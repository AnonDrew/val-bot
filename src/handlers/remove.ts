import { root } from "../../config.json";
import { rmSync } from "node:fs";
import { join } from "node:path";
import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    InteractionReplyOptions,
    SlashCommandAttachmentOption,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuInteraction
}
from "discord.js";
import { docker, fetchFiles } from "../utils";
import { projectStringOption } from "../commands";

export function remove(interaction: ChatInputCommandInteraction) {
    let reply: InteractionReplyOptions = { ephemeral: true };
    let fileNames = fetchFiles(join(root, docker, "proj")).filter(file => file.length > 0);

    if (fileNames.length === 0) {
        reply.content = "There are no archives to remove.";
        interaction.reply(reply);
        return;
    }

    let menu = new StringSelectMenuBuilder()
    .setCustomId("removeMenu")
    .setOptions(...fileNames.map(name => ({ label: name, value: name })))
    .setPlaceholder("What would you like to remove?");

    reply.components = [ new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(menu) ];
    interaction.reply(reply);
}

export function removeMenu(interaction: StringSelectMenuInteraction) {
    interaction.values.forEach(file => rmSync(join(root, docker, "proj", file)));

    let projectOptions = projectStringOption();
    const valgrind = new SlashCommandBuilder()
    .addAttachmentOption(
        new SlashCommandAttachmentOption()
        .setName("code")
        .setDescription("A resource containing C++ code.")
        .setRequired(true)
    )
    .setName("valgrind")
    .setDescription("Check your C++ code for memory leaks using valgrind.")
    if (projectOptions?.choices?.length > 0) {
        valgrind.addStringOption(projectOptions);
    }

    const { commands } = interaction.client.application;
    commands.delete(commands.cache.find(cmd => cmd.name === "valgrind"));
    commands.create(valgrind);

    interaction.update({
        content: "The selected archives have been removed. It may take a bit for the valgrind slash command to become available again.",
        components: []
    });
}
