import * as DJS from "discord.js";
import icons from "src/items/icons";
import { Bot } from "structures/Bot";
import translations from "../../translations.json";

const shopIcons = {
  data: {
    name: "shopIcons",
  },
  async execute(
    interaction: DJS.ButtonInteraction<DJS.CacheType>,
    bot: Bot,
    goBack = false
  ) {
    const translation =
      translations[interaction.locale] || translations["en-US"];
    const user = await bot.utils.getUserById(interaction.user.id);
    const inventory = user?.inventory ?? [];
    const inventoryItems = await bot.utils.getItemsByName(inventory);

    if (!inventoryItems) {
      return await interaction.reply({
        content: "An unexpected error occurred",
      });
    }
    const filteredIcons = icons.filter(
      (color) =>
        inventoryItems.filter((i) => i.name === color.name).length === 0
    );

    const select = new DJS.StringSelectMenuBuilder().setCustomId("iconSelect");
    const actions = new DJS.ActionRowBuilder<DJS.StringSelectMenuBuilder>();
    if (filteredIcons.length > 0) {
      select.addOptions(
        filteredIcons.map(({ name }) =>
          new DJS.StringSelectMenuOptionBuilder().setLabel(name).setValue(name)
        )
      );
      actions.addComponents(select);
    }

    const components = filteredIcons.length > 0 ? [actions] : [];

    if (!goBack) {
      return await interaction.reply({
        components: components,
        ephemeral: true,
        embeds: [
          new DJS.EmbedBuilder()
            .setTitle(translation.icons.title)
            .setDescription(
              `Icons\n` +
                filteredIcons.map(({ name }) => `- ${name}`).join("\n")
            ),
        ],
      });
    } else {
      return await interaction.update({
        components: components,
        embeds: [
          new DJS.EmbedBuilder()
            .setTitle(translation.icons.title)
            .setDescription(
              filteredIcons.map(({ name }) => `- ${name}`).join("\n")
            ),
        ],
      });
    }
  },
};

export default shopIcons;
