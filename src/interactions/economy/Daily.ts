import * as DJS from "discord.js";
import { Bot } from "structures/Bot";
import { BaseCommand } from "structures/Command/BaseCommand";
import ms from "utils/ms";
import translations from "../../translations.json";

export default class DailyCommand extends BaseCommand {
  constructor(bot: Bot) {
    super(bot, {
      name: "daily",
      description: "Type this command daily to get rewarded",
    });
  }
  async execute(
    interaction: DJS.CommandInteraction<DJS.CacheType>
  ): Promise<unknown> {
    await interaction.deferReply();
    const translation =
      translations[interaction.locale] || translations["en-US"];

    const user = await this.bot.utils.getUserById(interaction.user.id)!;
    const userCooldown = user?.dailyCooldown ?? 0;
    const cooldown = 60000 * 60 * 24;
    const cooldownEndTimestamp = cooldown - (Date.now() - userCooldown);
    if (userCooldown !== null && cooldownEndTimestamp > 0) {
      const pretty = ms(
        cooldownEndTimestamp,
        { long: true },
        interaction.locale
      );
      return await interaction.editReply(
        translation.daily.cooldown
          .replace("{{user}}", `<@${interaction.user.id}>`)
          .replace("{{cooldown}}", pretty)
      );
    }

    const reward = 100;

    await this.bot.utils.updateUserById(interaction.user.id, {
      money: user!.money + reward,
      dailyCooldown: Date.now(),
    });

    return await interaction.editReply(
      translation.daily.claimed
        .replace("{{user}}", `<@${interaction.user.id}>`)
        .replace("{{amount}}", reward)
    );
  }
}
