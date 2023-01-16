/**
 * Returns an array of an imports data.
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
    const s=1000, m=s*60, h=m*60, d=h*24, conversions: number[] = [ d, h, m, s ], words: string[] = [ "days", "hours", "minutes", "seconds" ];

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

    uptime = uptime.slice(0, -2);
    return uptime;
}
export const resource = async (url: string) => (await (await fetch(url)).body.getReader().read()).value;
