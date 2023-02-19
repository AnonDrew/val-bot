Thanks to [@niklassheth](https://github.com/niklassheth "niklassheth's profile") for the broad idea, telling me about docker, and assisting me with docker troubles I ran into as this was the first time I ever used docker for anything.

# Valbot
This simple bot was made with the goal of providing an alternative way for the abundance of Macbook users at my community college to use Valgrind on their C++ assignments to check for memory leaks, as Valgrind can be troublesome or tedious to setup depending on the macOS version.

# Features
Administrators of a Discord server can upload zipped project files that are provided by the course instructors to the machine the bot is running on, as well as remove them when they are no longer necessary, using the `upload` and `remove` commands.

Users can select which project they need and then upload their work so that the bot can compile and run that attachment with the other project files using the `valgrind` command. They can also upload a single C++ file and compile and run that; selecting a project is optional.

All user uploaded files are downloaded and stored into a temporary directory on the host machine. That code is then mounted as a volume, compiled, then ran inside of a docker container to protect against malicious code. Once the docker container is ran, the valgrind output file is then stored in the same temporary directory to be sent as an attachment by the bot to Discord. The directory and all contents are then completely removed.

All responses of the bot to the user of the `valgrind` command are ephemeral to provide privacy and protection from other users in the server.

Every user has a cooldown between `valgrind` command uses to prevent overuse of the bot.

Users are encouraged make sure their code compiles before using the bot when compilation fails as to not use the bot as a compilation tool. The bot intentionally does not provide compilation error output.

There is a `ping` command to check the status of the bot.

# Notes
A `config.json` file needs to be located in the project root, containing the following JSON format:
```json
{
    "token": "your discord api token",
    "root": "/absolute/path/to/project/root"
}
```

My college has a discord server for CS students that good friend of mine [@danwien8](https://github.com/danwien8 "danwien8's profile") created, Fall 2021. This bot was made for that server.

The method of distributing project files is just how instructors at my college handle assignments. They provide a bunch of files, and it is up to the student to implement 1 or more files. For example, the OOP course tends to have students implement and submit several files (headers & implementation), while the data structures & algorithms course tends to be a single file submission (implementation).

I rewrote this bot using newer and much improved Discord API features through the discord.js library. That rewrite is this version. I started incorporating VCS with this version.