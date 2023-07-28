import * as DJS from "discord.js";
import colors from "src/items/colors";
import { Bot } from "structures/Bot";
import translations from "../../translations.json";

const colorSelect = {
  data: {
    name: "colorSelect",
  },
  async execute(
    interaction: DJS.StringSelectMenuInteraction<DJS.CacheType>,
    bot: Bot
    // goBack = false
  ) {
    const translation =
      translations[interaction.locale] || translations["en-US"];

    await interaction.deferUpdate();
    const selection = interaction.values[0];
    const colorChoice = colors.find((color) => color.name === selection);
    if (!colorChoice) {
      return await interaction.reply({
        ephemeral: true,
        content: `Color not found`,
      });
    }

    const allItems = await bot.utils.getAllItems();

    if (!allItems) {
      return await interaction.editReply({
        content: "An unexpected error occurred",
      });
    }

    const item = allItems.find((item) => item.name === colorChoice.name)!;
    const actionRow = new DJS.ActionRowBuilder<DJS.ButtonBuilder>();

    const buyButton = new DJS.ButtonBuilder()
      .setCustomId(`buy-${item.name}`)
      .setLabel(translation.shop.purchase)
      .setStyle(DJS.ButtonStyle.Secondary);

    const returnButton = new DJS.ButtonBuilder()
      .setCustomId("shopColors-return")
      .setLabel(translation.global.return)
      .setStyle(DJS.ButtonStyle.Danger);
    actionRow.addComponents([buyButton, returnButton]);

    const colorEmbed = new DJS.EmbedBuilder()
      .setTitle(item.name)
      .setDescription(`<@&${item.role}>`);

    if (item.image) {
      colorEmbed.setImage(item.image);
    }

    const response = await interaction.editReply({
      components: [actionRow],
      embeds: [colorEmbed],
    });

    const collector = response.createMessageComponentCollector({
      componentType: DJS.ComponentType.Button,
      time: 3_600_000,
    });

    collector.on("collect", async (purchaseInteraction) => {
      if (purchaseInteraction.customId === `buy-${item.name}`) {
        await purchaseInteraction.deferUpdate();
        const hasEnoughMoneyFor = await bot.utils.hasEnoughMoneyFor(
          purchaseInteraction.user.id,
          item
        );
        if (hasEnoughMoneyFor?.result) {
          const { user } = hasEnoughMoneyFor;
          await bot.utils.buyItem({
            user,
            userId: user.id,
            amountToSubtract: item.price,
            item: item.name,
          });
          const equip = new DJS.ButtonBuilder()
            .setCustomId("equipShopColor")
            .setLabel(translation.global.equip)
            .setStyle(DJS.ButtonStyle.Success);
          const actionRow = new DJS.ActionRowBuilder<DJS.ButtonBuilder>();
          actionRow.addComponents(equip);
          const reply = await interaction.editReply({
            content: "Item Purchased",
            components: [actionRow],
          });

          const collector = reply.createMessageComponentCollector({
            componentType: DJS.ComponentType.Button,
            time: 3_600_000,
          });

          collector.on("collect", async (equipInteraction) => {
            if (equipInteraction.customId === "equipShopColor") {
              await equipInteraction.deferUpdate();
              const member = equipInteraction.member;
              if (!member) {
                await equipInteraction.editReply({
                  content: "User not found",
                });
              } else {
                //@ts-ignore
                await member.roles.remove(colors.map(({ role }) => role));
                //@ts-ignore
                await member.roles.add(item.role);
                await equipInteraction.editReply({
                  content: translation.global.itemEquipped,
                  components: [],
                });
              }
            }
          });
        } else {
          await interaction.editReply({
            content: "Not enough money",

            components: [],
          });
        }
      }
    });
  },
};

export default colorSelect;
