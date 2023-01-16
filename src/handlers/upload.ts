import { docker } from "../config.json";
import { ChatInputCommandInteraction, Client, InteractionReplyOptions } from "discord.js";
import { writeSync, openSync } from "node:fs";
import { resource } from "../utils";

export async function upload(interaction: ChatInputCommandInteraction, client: Client) {
    let attachment = interaction.options.getAttachment('archive', true), reply: InteractionReplyOptions = { ephemeral: true };
    try {
        writeSync(openSync(`${docker}/proj/${attachment.name}`, 'w'), await resource(attachment.url));
        reply.content = "Upload successful";
    }
    catch (e) {
        reply.content = "Something went wrong with the upload";
        console.log("Error uploading\n", "Member:\n", interaction.member, "\n", "Attachment:\n", attachment, "\n", e);
    }
    finally {
        interaction.reply(reply);
    }
}
