import { Bot } from "structures/Bot";
import "dotenv/config";

const bot = new Bot();

import("./server").then((v) => v.default(bot));

bot.login(process.env["DISCORD_BOT_TOKEN"]);

process.on("unhandledRejection", (error: Error) =>
  console.error(error, "Error")
);

process.on("uncaughtExceptionMonitor", (error: Error) =>
  console.error(error, "Error")
);

process.on("warning", (warning) => console.warn(warning, "Warning"));
