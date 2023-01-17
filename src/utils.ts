import { root } from "../config.json";
import { execSync } from "node:child_process";
import { join } from "node:path";
/**
 * Returns an array of an imports data. Type safety undetermined.
 */
export function importContents<T>(importObject: Object): T[] {
    let contents: T[] = [];
    Object.keys(importObject).forEach(key => contents.push(importObject[key]));
    return contents;
}
/**
 * Returns a string in the format of d, h, m, s.
 */
export function msToDHMS(ms: number) {
    const s=1000, m=s*60, h=m*60, d=h*24
    const conversions: number[] = [ d, h, m, s ]
    const words: string[] = [ "days", "hours", "minutes", "seconds" ];

    let uptime: string = "";
    for (let i = 0; i < conversions.length; i++) {
        const time = Math.floor(ms / conversions[i]);
        uptime += time.toString() + " ";

        if (time === 1) {
            uptime += words[i].slice(0, -1) + ", ";
        }
        else {
            uptime += words[i] + ", ";
        }

        ms %= conversions[i];
    }

    return uptime.slice(0, -2);
}
/**
 * Returns data contained in body of response from url.
 */
export const resource = async (url: string) => (await (await fetch(url)).body.getReader().read()).value;
/**
 * Returns an array of strings containing the full name of all files in dir.
 */
export const fetchFiles = (dir: string) => execSync(`${join(root, scripts, `dirfiles${ext}`)} ${dir}`).toString().trim().split('\n');
/**
 * The file extension of the shell scripts.
 */
export const ext = ".sh";
/**
 * The name of the directory containing all shell related files.
 */
export const scripts = "sh";
/**
 * The name of the directory containing all docker related files.
 */
export const docker = "docker";
