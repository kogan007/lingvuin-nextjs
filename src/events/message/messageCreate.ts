import * as DJS from "discord.js";
import { ChannelType } from "discord.js";
import { Bot } from "structures/Bot";
import { Event } from "structures/Event";

export default class MessageEvent extends Event {
  constructor(bot: Bot) {
    super(bot, "messageCreate");
  }

  async execute(bot: Bot, message: DJS.Message) {
    try {
      if (!message.guild?.available) return;
      if (message.channel.type === ChannelType.DM) return;
      if (!bot.utils.hasSendPermissions(message)) return;

      if (!bot.user) return;

      const user = await bot.utils.getUserById(message.author.id);
      if (user) {
        await bot.utils.updateUserById(message.author.id, {
          money: user.money + 1,
        });
      }
    } catch (e) {
      console.error(e);
    }
  }
}
