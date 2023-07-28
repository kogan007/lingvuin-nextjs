import * as DJS from "discord.js";
import colors from "src/items/colors";
import icons from "src/items/icons";
import { Bot } from "structures/Bot";
// import translations from "../../translations.json";

const equipItem = {
  data: {
    name: "equipItem",
  },
  async execute(
    interaction: DJS.StringSelectMenuInteraction<DJS.CacheType>,
    bot: Bot
    // goBack = false
  ) {
    const user = await bot.utils.getUserById(interaction.user.id);
    const inventory = user?.inventory ?? [];
    const inventoryItems = await bot.utils.getItemsByName(inventory);
    if (!inventoryItems) {
      return await interaction.reply({
        content: "An unexpected error occurred",
      });
    }

    const selection = interaction.values[0];
    const item = inventoryItems.find((item) => item.name === selection)!;
    const member = interaction.member;
    const type = item.type;
    const rolesToRemove = type === "icon" ? icons : colors;
    //@ts-ignore
    await member.roles.remove(rolesToRemove.map(({ role }) => role));
    //@ts-ignore
    await member.roles.add(item.role);

    const equippedRow = new DJS.ActionRowBuilder<DJS.ButtonBuilder>();

    const backButton = new DJS.ButtonBuilder()
      .setCustomId("inventory-return")
      .setLabel("Go back")
      .setStyle(DJS.ButtonStyle.Danger);

    equippedRow.addComponents(backButton);
    return await interaction.update({
      content: "Item equipped",
      components: [equippedRow],
      embeds: [],
    });
  },
};

export default equipItem;
