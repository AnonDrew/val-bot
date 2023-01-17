import { root } from "../../config.json";
import { mkdtempSync, rm, openSync, writeSync } from "node:fs";
import { execSync } from "node:child_process";
import { join, sep } from "node:path";
import { Attachment, ChatInputCommandInteraction, Client, InteractionReplyOptions } from "discord.js";
import { ext, resource, docker, scripts } from "../utils";

//handle DoS/DDoS (limit how many times the command can be used)

function validate(reply: InteractionReplyOptions, code: Attachment) {
    const SIZE_LIMIT = 524000/*b*/;
    if (code.contentType !== "text/x-c++src; charset=utf-8") {
        reply.content = "Incorrect content type. Valgrind only works with C++ source code...";
        return false;
    }
    if (code.size > SIZE_LIMIT) {
        reply.content = `Your file is too large. The current limit is ${SIZE_LIMIT/1000}KB.`
        return false;
    }
    return true;
}

export async function valgrind(interaction: ChatInputCommandInteraction) {
    const reply: InteractionReplyOptions = { ephemeral: true };
    const code = interaction.options.getAttachment('code');
    if (!validate(reply, code)) {
        interaction.reply(reply);
        return;
    }

    const data = await resource(code.url);
    if (!data) {
        reply.content = "There was an issue fetching your attachment. Try again or wait some time.";
        interaction.reply(reply);
        return;
    }

    const project = interaction.options.getString('project');
    const volume = mkdtempSync(join(root, docker, "in", "tmp"));
    writeSync(openSync(join(volume, code.name), "w"), data)

    //executing runcontainer.sh ...args
    let script = `${join(root, scripts, "runcontainer" + ext)} ${volume} ${join(sep, "home")} valbot ${code.name}`;
    if (project) {
        script += ` ${project} ${join(root, docker, "proj")}`;
    }
    try {
        execSync(script);
        reply.files = [ join(volume, code.name.substring(0, code.name.lastIndexOf("."))) + ".txt" ];
    }
    catch (er) {
        reply.content = `${code.name} compilation failed. Please ensure your code compiles before looking for memory leaks.`;
        console.log(er);
    }
    
    interaction.reply(reply);
    rm(volume, { recursive: true }, ()=>{});
}
