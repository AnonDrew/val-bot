import { root } from "../../config.json";
import { mkdirSync, openSync, writeSync, PathLike } from "node:fs";
import { execSync } from "node:child_process";
import { Attachment, ChatInputCommandInteraction, Client, Message } from "discord.js";
import { resource } from "../utils";

//handle DoS/DDoS (limit how many times the command can be used)

function runContainer(path: PathLike, attachment: Attachment) {
    let containerDir = "/home";
    let image = "valbot";
    let cppFileName = attachment.name;
    let cppFileNoExt = cppFileName.substring(0, attachment.name.lastIndexOf("."));
    let hostCmds = [
        `docker run --rm --log-driver=none --ulimit nofile=1024:1024 -v ${path}:${containerDir} ${image} /bin/bash -c`
    ];
    let containerCmds = [
        `g++ -o ${containerDir}/${cppFileNoExt}.out --std=c++17 ${containerDir}/${attachment.name}`,
        `valgrind --log-file="${containerDir}/${cppFileNoExt}.txt" --track-origins=yes --leak-check=full ${containerDir}/${cppFileNoExt}.out`,
        `cat ${containerDir}/${cppFileNoExt}.txt`,
    ];

    try {
        execSync(`${hostCmds[0]} "${containerCmds.join(" && ")}"`).toString();
    }
    catch (er) {
        console.log(`ECOMPILE: ${attachment.name} compilation failed`);
        console.log(er);
    }

    return `${path}/${cppFileNoExt}.txt`;
}

function cleanUpDM(message: Message) { setTimeout(() => message.delete(), 20000); }

export async function valgrindDM(message: Message) {
    let attachment = message.attachments.first(), data = await resource(attachment.url);

    if (!data) {
        message.channel.send("There was an issue obtaining your attachment.").then(cleanUpDM);
        return;
    }

    let randDir = "/tmp" + Math.floor(Math.random() * Math.pow(10, 6)).toString();
    let hostMntPath = root + "/docker/in" + randDir;

    mkdirSync(hostMntPath);
    writeSync(openSync(`${hostMntPath}/${attachment.name}`, "w"), data);

    await message.channel.send({
        content: `This message will be deleted in a couple seconds. Download the attachment or copy the contents.`,
        files: [
            runContainer(hostMntPath, attachment)
        ],
    })
    // I handle this er here for a reason I cannot remember, but it might have been a good one
    .then(cleanUpDM, er => {
        message.channel.send(`${attachment.name} compilation failed`).then(cleanUpDM);
        console.log(er);
    });

    try {
        execSync(`rm -R ${hostMntPath}`);
    }
    catch (er) {
        console.log("ECLEAN: " + randDir + " was not removed\n", er);
    }
}

export async function valgrind(interaction: ChatInputCommandInteraction, client: Client) {
    
}
