import * as DJS from "discord.js";
import { Bot } from "structures/Bot";
import { BaseCommand } from "structures/Command/BaseCommand";
// import translations from "../../translations.json";

export default class BalanceCommand extends BaseCommand {
  constructor(bot: Bot) {
    super(bot, {
      name: "balance",
      description: "Check your balance of Lingvuin Coins",
    });
  }
  async execute(
    interaction: DJS.CommandInteraction<DJS.CacheType>
  ): Promise<unknown> {
    // const translation =
    //   translations[interaction.locale] || translations["en-US"];
    await interaction.deferReply();
    const shopUser = await this.bot.utils.getUserById(interaction.user.id);

    return await interaction.editReply(
      `<@${shopUser!.userId}>'s balance:\n` +
        `Coins: **${shopUser?.money || 0}**.\n`
    );
  }
}
