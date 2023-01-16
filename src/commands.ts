import { 
    APIApplicationCommandOptionChoice,
    SlashCommandAttachmentOption, 
    SlashCommandBuilder, 
    SlashCommandStringOption
} 
from 'discord.js';

export const commands = [ 

    new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check the status of the bot.')
    ,

    new SlashCommandBuilder()
    //Put this first to avoid Omit<> type; would need an "as" cast otherwise to rid it
    .addAttachmentOption(
        new SlashCommandAttachmentOption()
        .setName('archive')
        .setDescription('A zip archive containing your project files.')
        .setRequired(true)
    )
    .setName('upload')
    .setDescription('Upload project files to the bot.')
    ,
    
    new SlashCommandBuilder()
    .addAttachmentOption(
        new SlashCommandAttachmentOption()
        .setName('code')
        .setDescription('A resource containing C++ code.')
        .setRequired(true)
    )
    .setName('valgrind')
    .setDescription('Check your C++ code for memory leaks using valgrind.')
    ,
    
];
