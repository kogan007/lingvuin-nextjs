import * as DJS from "discord.js";
import { Bot } from "structures/Bot";
import { Event } from "structures/Event";

const rashistRole = "1063233240804098099";

export default class GuildMemberAddEvent extends Event {
  constructor(bot: Bot) {
    super(bot, "guildMemberAdd");
  }

  async execute(bot: Bot, member: DJS.GuildMember) {
    const apiMember = await bot.utils.getUserById(member.id);
    if (apiMember?.isRashist) {
      await member.roles.set([rashistRole]);
    }
  }
}
