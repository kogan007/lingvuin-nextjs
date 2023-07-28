import * as DJS from "discord.js";
import { Bot } from "structures/Bot";
import { BaseCommand } from "structures/Command/BaseCommand";
import translations from "../../translations.json";

export default class GiveAwayCommand extends BaseCommand {
  constructor(bot: Bot) {
    super(bot, {
      name: "giveaway",
      description: "Create a giveaway",
      memberPermissions: [DJS.PermissionFlagsBits.Administrator],
      options: [
        {
          name: "min",
          type: DJS.ApplicationCommandOptionType.Integer,
          description: "The min val of the giveaway",
          required: true,
        },
        {
          name: "max",
          type: DJS.ApplicationCommandOptionType.Integer,
          description: "The max val of the giveaway",
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
    const users: string[] = [];
    const actionRow = new DJS.ActionRowBuilder<DJS.ButtonBuilder>();

    const lootButton = new DJS.ButtonBuilder()
      .setCustomId("giveaway")
      .setLabel("Join Giveaway")
      .setStyle(DJS.ButtonStyle.Success);

    const countButton = new DJS.ButtonBuilder()
      .setCustomId("giveawayCount")
      .setLabel(`Members: ${users.length}`)
      .setDisabled(true)
      .setStyle(DJS.ButtonStyle.Secondary);

    actionRow.addComponents(lootButton);
    actionRow.addComponents(countButton);
    const response = await interaction.editReply({
      components: [actionRow],
    });

    const collector = await response.createMessageComponentCollector({
      componentType: DJS.ComponentType.Button,
      time: 3_600_000,
    });
    collector.on("collect", async (giveawayInteraction) => {
      if (giveawayInteraction.customId === "giveaway") {
        const translation =
          translations[giveawayInteraction.locale] || translations["en-US"];

        const updatedActionRow = new DJS.ActionRowBuilder<DJS.ButtonBuilder>();

        if (!users.includes(giveawayInteraction.user.id)) {
          users.push(giveawayInteraction.user.id);
          countButton.setLabel(`Members: ${users.length}`);
          updatedActionRow.addComponents(lootButton);
          updatedActionRow.addComponents(countButton);
          await giveawayInteraction.update({
            components: [updatedActionRow],
          });
        } else {
          await giveawayInteraction.reply({
            ephemeral: true,
            content: `You are already part of this giveaway`,
          });
        }
      }
    });
  }
}
