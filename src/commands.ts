import { SlashCommandAttachmentOption, SlashCommandBuilder } from 'discord.js';

export default [ 

    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check the status of the bot.')
    ,

    new SlashCommandBuilder()
        .setName('upload')
        .setDescription('Upload project files to the bot.')
        .addAttachmentOption(
            new SlashCommandAttachmentOption()
            .setName('archive')
            .setDescription('A zip archive containing your project files.')
            .setRequired(true)
        )
    ,
    
] as SlashCommandBuilder[];
