import { root } from "../config.json";
import {
    SlashCommandAttachmentOption, 
    SlashCommandBuilder, 
    SlashCommandStringOption
}
from "discord.js";
import { join } from "node:path";
import { docker, fetchFiles } from "./utils";

export function projectStringOption(desc?: string) {
    let fileNames = fetchFiles(join(root, docker, "proj")).filter(file => file.length > 0).map(file => ({ name: file, value: file }));
    let option = new SlashCommandStringOption()
    .setName("project")
    .setDescription(desc ?? "Which project your file is for. If ommitted, a single .cpp file is expected.");

    if (fileNames.length > 0) {
        option.setChoices(...fileNames);
    }
    
    return option; 
}

let projectOptions = projectStringOption();

let valgrind = new SlashCommandBuilder()
.addAttachmentOption(
    new SlashCommandAttachmentOption()
    .setName("code")
    .setDescription("A resource containing C++ code.")
    .setRequired(true)
)
.setName("valgrind")
.setDescription("Check your C++ code for memory leaks using valgrind.");
if (projectOptions?.choices?.length > 0) {
    valgrind.addStringOption(projectOptions);
}

export const commands = [

    valgrind,

    new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check the status of the bot.")
    ,

    new SlashCommandBuilder()
    //Put this first to avoid Omit<> type; would need an "as" cast otherwise to get rid of it
    .addAttachmentOption(
        new SlashCommandAttachmentOption()
        .setName("archive")
        .setDescription("A zip archive containing your project files.")
        .setRequired(true)
    )
    .setName("upload")
    .setDescription("Upload project archives to the bot.")
    ,

    new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove uploaded project archives.")
    ,
    
];
