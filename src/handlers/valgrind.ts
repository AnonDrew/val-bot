import { root } from "../config.json";
import { mkdirSync, openSync, writeSync, PathLike } from "node:fs";
import { execSync } from "node:child_process";
import { Attachment, Message } from "discord.js";
import { resource } from "../utils";

//handle DDoS/DoS
//verified accounts; maybe only allow verified users to send files in
//if you reach AWS rate limit, make sure it just shuts the VM down

async function writeToHostMnt(path: PathLike, file: string, data: Uint8Array) {
    if (data == undefined) {
        return false;
    }
    mkdirSync(path);
    writeSync(openSync(`${path}/${file}`, "w"), data);
    return true;
}

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

function cleanUp(hostMntPath: PathLike) { return execSync(`rm -R ${hostMntPath}`).length === 0; }

export async function valgrind(message: Message) {
    let attachment = message.attachments.first(), data = await resource(attachment.url);

    let randDir = "/tmp" + Math.floor(Math.random() * Math.pow(10, 6)).toString();
    let hostMntPath = root + "/docker/in" + randDir;
    let msgTime = 20000; //ms

    if (!writeToHostMnt(hostMntPath, attachment.name, data)) {
        message.channel.send("There was an issue obtaining your attachment.")
            .then((message: Message) => setTimeout(() => message.delete(), msgTime));
        return;
    }

    await message.channel.send({
        content: `This message will be deleted in ${msgTime/1000} seconds. Download the attachment or copy the contents.`,
        files: [
            runContainer(hostMntPath, attachment)
        ],
    })
        .then((message: Message) => setTimeout(() => message.delete(), msgTime), er => {
            message.channel.send(`${attachment.name} compilation failed`)
                .then((message: Message) => setTimeout(() => message.delete(), msgTime));
            console.log(er);
        });

    if (!cleanUp(hostMntPath)) {
        console.log(`ECLEAN: ${randDir} was not removed`);
    }
}
