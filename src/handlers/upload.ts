import { root } from "../../config.json";
import { 
    ChatInputCommandInteraction,
    Client,
    InteractionReplyOptions,
    SlashCommandAttachmentOption,
    SlashCommandBuilder,
    SlashCommandStringOption
} 
from "discord.js";
import { writeSync, openSync } from "node:fs";
import { execSync } from "node:child_process";
import { resource } from "../utils";

export async function upload(interaction: ChatInputCommandInteraction, client: Client) {
    console.log("hello");
    /*let attachment = interaction.options.getAttachment('archive', true), reply: InteractionReplyOptions = { ephemeral: true };
    let { commands } = interaction.client.application;

    try {
        writeSync(openSync(`${root}/docker/proj/${attachment.name}`, 'w'), await resource(attachment.url));
        let projNames = execSync(`find ${root}/docker/in/proj -maxdepth 1 -type f -printf '%P\n'`).toString();
        console.log(projNames);

        // using .edit() would be ideal here, but I was unable to use builders, which was a pain
        // benefits would be 2 less setter calls for name and description (editing the options overwrites the previous options array)
        // and 1 less request, so less bot downtime
        commands.delete(commands.cache.find(cmd => cmd.name === 'valgrind'));
        commands.create(
            new SlashCommandBuilder()
            .addAttachmentOption(
                new SlashCommandAttachmentOption()
                .setName('code')
                .setDescription('A resource containing C++ code.')
                .setRequired(true)
            )
            .addStringOption(
                new SlashCommandStringOption()
                .setName('project')
                .setDescription('Which project your file is for. If ommitted, a single .cpp file is expected.')
                .setChoices(
                    { name: "test", value: "tested" }
                )
            )
            .setName('valgrind')
            .setDescription('Check your C++ code for memory leaks using valgrind.')
        );

        reply.content = "Upload successful. It may take a bit for the valgrind slash command to become available.";
    }
    catch (e) {
        reply.content = "Something went wrong with the upload";
        console.log("Error uploading\n", "Member:\n", interaction.member, "\n", "Attachment:\n", attachment, "\n", e);
    }

    interaction.reply(reply);*/
}
