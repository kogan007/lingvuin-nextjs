import * as DJS from "discord.js";
import colors from "src/items/colors";
import { Bot } from "structures/Bot";

const shopColors = {
  data: {
    name: "shopColors",
  },
  async execute(
    interaction: DJS.ButtonInteraction<DJS.CacheType>,
    bot: Bot,
    goBack = false
  ) {
    const user = await bot.utils.getUserById(interaction.user.id);
    const inventory = user?.inventory ?? [];
    const inventoryItems = await bot.utils.getItemsByName(inventory);

    if (!inventoryItems) {
      return await interaction.reply({
        content: "An unexpected error occurred",
      });
    }
    const filteredColors = colors.filter(
      (color) =>
        inventoryItems.filter((i) => i.name === color.name).length === 0
    );

    const select = new DJS.StringSelectMenuBuilder().setCustomId("colorSelect");
    const actions = new DJS.ActionRowBuilder<DJS.StringSelectMenuBuilder>();
    if (filteredColors.length > 0) {
      select.addOptions(
        filteredColors.map(({ name }) =>
          new DJS.StringSelectMenuOptionBuilder().setLabel(name).setValue(name)
        )
      );
      actions.addComponents(select);
    }

    const components = filteredColors.length > 0 ? [actions] : [];
    if (!goBack) {
      return await interaction.reply({
        content: "Colors",
        components,
        ephemeral: true,
        embeds: [],
      });
    } else {
      return await interaction.update({
        components,
        embeds: [],
      });
    }
  },
};

export default shopColors;
