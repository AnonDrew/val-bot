/**
 * Returns an array of an imports data. Type safety undetermined.
 */
export function importContents<T>(importObject: Object): T[] {
    let contents: T[] = [];
    Object.keys(importObject).forEach(key => contents.push(importObject[key]));
    return contents;
}
/**
 * Returns a string in the format of d, h, m, s
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
export const resource = async (url: string) => (await (await fetch(url)).body.getReader().read()).value;

export const ext = ".sh";
export const scripts = "sh";
export const docker = "docker";
