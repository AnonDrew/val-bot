import { root } from "../../config.json";
import { mkdirSync, openSync, writeSync } from "node:fs";
import { execSync } from "node:child_process";
import { ChatInputCommandInteraction, Client, Message } from "discord.js";
import { ext, resource } from "../utils";

//handle DoS/DDoS (limit how many times the command can be used)

function cleanUpDM(message: Message) { setTimeout(() => message.delete(), 20000); }

export async function valgrindDM(message: Message) {
    let attachment = message.attachments.first(), data = await resource(attachment.url);
    if (!data) {
        message.channel.send("There was an issue obtaining your attachment.").then(cleanUpDM);
        return;
    }

    let hostMntPath = root + "/docker/in/tmp" + Math.floor(Math.random() * Math.pow(10, 6));
    mkdirSync(hostMntPath);
    writeSync(openSync(`${hostMntPath}/${attachment.name}`, "w"), data);
    try {
        console.log(execSync(`${root}/bash/runcontainer${ext} ${hostMntPath} /home valbot ${attachment.name}`).toString());
        await message.channel.send({
            content: `This message will be deleted in a couple seconds. Download the attachment or copy the contents.`,
            files: [
                `${hostMntPath}/${attachment.name.substring(0, attachment.name.lastIndexOf("."))}.txt`,
            ],
        })
        .then(cleanUpDM, (er) => console.log("Could not properly send compilation results."));
    }
    catch (er) {
        message.channel.send(`${attachment.name} compilation failed`).then(cleanUpDM);
        console.log(er);
    }

    try {
       execSync(`rm -R ${hostMntPath}`);
    }
    catch (er) {
       console.log("ECLEAN: " + hostMntPath + " was not removed\n", er);
    }
}

export async function valgrind(interaction: ChatInputCommandInteraction, client: Client) {
    
}
