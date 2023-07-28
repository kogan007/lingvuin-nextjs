import * as DJS from "discord.js";
import icons from "src/items/icons";
import { Bot } from "structures/Bot";
import translations from "../../translations.json";

const iconSelect = {
  data: {
    name: "iconSelect",
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
    const iconChoice = icons.find((color) => color.name === selection);
    if (!iconChoice) {
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

    const item = allItems.find((item) => item.name === iconChoice.name)!;
    const actionRow = new DJS.ActionRowBuilder<DJS.ButtonBuilder>();

    const buyButton = new DJS.ButtonBuilder()
      .setCustomId(`buy-${item.name}`)
      .setLabel(translation.shop.purchase)
      .setStyle(DJS.ButtonStyle.Secondary);

    const returnButton = new DJS.ButtonBuilder()
      .setCustomId("shopIcons-return")
      .setLabel(translation.global.return)
      .setStyle(DJS.ButtonStyle.Danger);
    actionRow.addComponents([buyButton, returnButton]);

    const iconEmbed = new DJS.EmbedBuilder()
      .setTitle(item.name)
      .setDescription(`<@&${item.role}>`);

    if (item.image) {
      iconEmbed.setImage(item.image);
    }

    const response = await interaction.editReply({
      components: [actionRow],
      embeds: [iconEmbed],
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
            .setCustomId("equipShopIcon")
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
            if (equipInteraction.customId === "equipShopIcon") {
              await equipInteraction.deferUpdate();
              const member = equipInteraction.member;
              if (!member) {
                await equipInteraction.editReply({
                  content: "User not found",
                });
              } else {
                //@ts-ignore
                await member.roles.remove(icons.map(({ role }) => role));
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

export default iconSelect;
