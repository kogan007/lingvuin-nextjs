import { globSync } from "glob";
import { Bot } from "structures/Bot";
import { Event } from "structures/Event";
import { resolveFile, validateFile } from "utils/HandlersUtil";

const types = ["channel", "client", "guild", "message"];

export class EventHandler {
  bot: Bot;

  constructor(bot: Bot) {
    this.bot = bot;
  }

  async loadEvents() {
    let type = "Bot";

    const files = process.env.BUILD_PATH
      ? globSync("./dist/src/events/**/*.js")
      : globSync("./src/events/**/*.ts");

    for (const file of files) {
      delete require.cache[file];

      const event = await resolveFile<Event>(file, this.bot);
      if (!event) continue;
      await validateFile(file, event);

      types.forEach((t) => {
        if (file.includes(`${t}.`)) {
          type = t;
        }
      });

      if (!event.execute) {
        throw new TypeError(
          `[ERROR][events]: execute function is required for events! (${file})`
        );
      }

      if (event.once) {
        this.bot.once(event.name, event.execute.bind(null, this.bot));
      } else {
        this.bot.on(event.name, (...args) => {
          return event.execute(this.bot, ...args);
        });
      }

      if (process.env["DEBUG_MODE"] === "true") {
        console.log("EVENT", `${type}: Loaded ${event.name}`);
      }
    }
  }
}
