import * as DJS from "discord.js";
import { Bot } from "structures/Bot";
import { BaseCommand } from "structures/Command/BaseCommand";
// import translations from "../../translations.json";

export default class AddMoneyCommand extends BaseCommand {
  constructor(bot: Bot) {
    super(bot, {
      name: "addmoney",
      description: "Adds money to a user",
      memberPermissions: [DJS.PermissionFlagsBits.ManageGuild],
      options: [
        {
          name: "target",
          type: DJS.ApplicationCommandOptionType.User,
          description: "The user to add money to",
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
    const user = interaction.options.get("target");
    const amount = interaction.options.get("amount");
    if (!amount || !Number.isInteger(amount.value) || !user || !user.user) {
      return await interaction.reply("An error occurred");
    }

    const shopUser = await this.bot.utils.getUserById(user.user.id);

    await this.bot.utils.updateUserById(user.user.id, {
      money: shopUser!.money + (amount.value as number),
    });

    return await interaction.reply(
      `${amount.value} added to <@${user.user.id}>`
    );
  }
}
