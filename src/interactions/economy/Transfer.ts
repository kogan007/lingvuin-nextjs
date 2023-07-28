import * as DJS from "discord.js";
import { Bot } from "structures/Bot";
import { BaseCommand } from "structures/Command/BaseCommand";
// import translations from "../../translations.json";

export default class TransferCommand extends BaseCommand {
  constructor(bot: Bot) {
    super(bot, {
      name: "transfer",
      description: "Check your balance of Lingvuin Coins",
      options: [
        {
          name: "target",
          type: DJS.ApplicationCommandOptionType.User,
          description: "The user to transfer money to",
          required: true,
        },
        {
          name: "amount",
          type: DJS.ApplicationCommandOptionType.Integer,
          description: "The amount of money to add",
          required: true,
        },
      ],
    });
  }
  async execute(
    interaction: DJS.CommandInteraction<DJS.CacheType>
  ): Promise<unknown> {
    // const translation =
    //   translations[interaction.locale] || translations["en-US"];
    await interaction.deferReply();
    const user = interaction.options.get("target");
    const amount = interaction.options.get("amount");
    if (!amount || !Number.isInteger(amount.value) || !user || !user.user) {
      return await interaction.reply("An error occurred");
    }

    const shopUser = await this.bot.utils.getUserById(interaction.user.id);
    const targetUser = await this.bot.utils.getUserById(user.user.id);
    if (shopUser!.money < (amount.value as number)) {
      return await interaction.editReply({
        content: "You don't have enough money",
      });
    }

    await this.bot.utils.updateUserById(shopUser!.userId, {
      money: shopUser!.money - (amount.value as number),
    });
    await this.bot.utils.updateUserById(targetUser!.userId, {
      money: targetUser!.money + (amount.value as number),
    });

    return await interaction.editReply(`
        <@${interaction.user.id}>, you transferred $${amount.value} to <@${user.user.id}>
    `);
  }
}
