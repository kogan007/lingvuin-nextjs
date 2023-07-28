import * as DJS from "discord.js";
import { Bot } from "structures/Bot";
import { Event } from "structures/Event";

import { InteractionHandler } from "handlers/InteractionHandler";
import agenda from "utils/agenda";

export default class ReadyEvent extends Event {
  constructor(bot: Bot) {
    super(bot, "ready", true);
  }

  async execute(bot: Bot) {
    const serverCount = bot.utils.formatNumber(bot.guilds.cache.size);
    const channelCount = bot.utils.formatNumber(bot.channels.cache.size);
    const userCount = bot.utils.formatNumber(
      bot.guilds.cache.reduce((a, g) => a + g.memberCount, 0)
    );

    const statuses: {
      type: DJS.ActivityType.Listening | DJS.ActivityType.Watching;
      value: string;
    }[] = [
      {
        type: DJS.ActivityType.Watching,
        value: `${userCount} users`,
      },

      // {
      //   type: DJS.ActivityType.Watching,
      //   value: "https://discord.gg/XxHrtkA",
      // },
      // {
      //   type: DJS.ActivityType.Watching,
      //   value: "https://ghostybot.caspertheghost.me",
      // },
    ];

    await new InteractionHandler(bot).loadInteractions();

    if (process.env["DEV_MODE"] === "true") {
      void import("src/scripts/generateCommandList").then((v) =>
        v.default(this.bot)
      );
    }

    console.log(
      "bot",
      `Bot is running with ${channelCount} channels, ${userCount} users and ${serverCount} servers`
    );
    const guild = await bot.guilds.fetch("1042523320752537680");
    const banner = await bot.utils.makeBannerGif(guild);
    await guild.setBanner(banner);
    await agenda.start();
    setInterval(() => {
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      bot.user?.setActivity(status.value, { type: status.type! });
    }, 60_000);

    // const banner = await bot.utils.makeBannerImage(guild);

    // await guild.setBanner(banner);

    setInterval(async () => {
      const guild = await bot.guilds.fetch("1042523320752537680");
      const banner = await bot.utils.makeBannerGif(guild);
      await guild.setBanner(banner);
    }, 30_000);
  }
}
