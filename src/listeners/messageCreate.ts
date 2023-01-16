import { Client, Message } from "discord.js";
import * as handlers from "../handlers";

// may add support for more files later
function isValidAttSize(message: Message) {
    return message.attachments.size !== 1;
}

// may add support for more file extensions later
function isValidAttCType(message: Message, validCTypes: string[]) {
    return validCTypes.includes(message.attachments.first().contentType);
}

// calls the previous validator functions
function validAtts(message: Message, validCTypes: string[]) {
    return !isValidAttSize(message) || !isValidAttCType(message, validCTypes);
}

export function messageCreate(client: Client) {
    client.on("messageCreate", (message: Message) => {
        if (message.attachments.size === 0) {
            return;
        }
        if (!validAtts(message, [ "text/x-c++src; charset=utf-8" ])) {
            message.channel.send("My DMs only work with single .cpp attachment messages right now.");
            return;
        }

        const attachment = message.attachments.first();
        if (attachment.contentType === "text/x-c++src; charset=utf-8") {
            handlers.valgrindDM(message);

            /*let src = message.attachments.first();
            let srcRaw = src.name.substring(0, src.name.lastIndexOf("."));

            createWriteStream(src.name).write((await get(src.url)).data);
            let tmp = execSync(`g++ -o ./"${srcRaw}.out" --std=c++17 ./${src.name} && valgrind --log-file="${srcRaw}.txt" --track-origins=yes --leak-check=full ./"${srcRaw}.out" && cat ./"${srcRaw}.txt"`);
            console.log(tmp.toString().length);*/

        }
    });
}