import * as DJS from "discord.js";
import { Bot } from "structures/Bot";
import { BaseCommand } from "structures/Command/BaseCommand";
import translations from "../../translations.json";

export default class LootboxCommand extends BaseCommand {
  constructor(bot: Bot) {
    super(bot, {
      name: "lootbox",
      description: "Create a lootbox",
      memberPermissions: [DJS.PermissionFlagsBits.Administrator],
      options: [
        {
          name: "min",
          type: DJS.ApplicationCommandOptionType.Integer,
          description: "The min val of the lootbox",
          required: true,
        },
        {
          name: "max",
          type: DJS.ApplicationCommandOptionType.Integer,
          description: "The max val of the lootbox",
          required: true,
        },
      ],
    });
  }
  async execute(
    interaction: DJS.CommandInteraction<DJS.CacheType>
  ): Promise<unknown> {
    await interaction.deferReply();
    const min = interaction.options.get("min")!.value as number;
    const max = interaction.options.get("max")!.value as number;

    if (min > max) {
      return await interaction.editReply(
        "The min is greater than the max. Try again."
      );
    }

    const lootAmount = Math.round(Math.random() * (max - min) + min);

    const actionRow = new DJS.ActionRowBuilder<DJS.ButtonBuilder>();

    const lootButton = new DJS.ButtonBuilder()
      .setCustomId("lootbox")
      .setLabel("Claim Lootbox")
      .setStyle(DJS.ButtonStyle.Success);

    actionRow.addComponents(lootButton);
    const response = await interaction.editReply({
      components: [actionRow],
    });

    return response
      .awaitMessageComponent({
        componentType: DJS.ComponentType.Button,
        time: 3_600_000,
      })
      .then(async (lootboxInteraction) => {
        if (lootboxInteraction.customId === "lootbox") {
          const translation =
            translations[lootboxInteraction.locale] || translations["en-US"];

          const updatedActionRow =
            new DJS.ActionRowBuilder<DJS.ButtonBuilder>();
          lootButton.setDisabled(true);
          lootButton.setLabel("Lootbox Claimed");
          updatedActionRow.addComponents(lootButton);

          const user = await this.bot.utils.getUserById(
            lootboxInteraction.user.id
          );

          this.bot.utils.updateUserById(user!.userId, {
            money: (user!.money ?? 0) + lootAmount,
          });
          return await lootboxInteraction.update({
            content: translation.global.lootboxReward
              .replace("{{user}}", `<@${lootboxInteraction.user.id}>`)
              .replace("{{amount}}", lootAmount),
            components: [updatedActionRow],
          });
        }
      });
  }
}
