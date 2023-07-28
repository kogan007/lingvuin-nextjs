import * as DJS from "discord.js";
import { Bot } from "structures/Bot";
import { BaseCommand } from "structures/Command/BaseCommand";
import translations from "../../translations.json";

export default class ShopCommand extends BaseCommand {
  constructor(bot: Bot) {
    super(bot, {
      name: "shop",
      description: "Opens the Lingvuin shop",
    });
  }
  async execute(
    interaction: DJS.CommandInteraction<DJS.CacheType>
  ): Promise<unknown> {
    const translation =
      translations[interaction.locale] || translations["en-US"];
    const topRow = new DJS.ActionRowBuilder<DJS.ButtonBuilder>();
    const bottomRow = new DJS.ActionRowBuilder<DJS.ButtonBuilder>();
    const balanceButton = new DJS.ButtonBuilder()
      .setCustomId("balance")
      .setLabel(translation.shop.balance)
      .setStyle(DJS.ButtonStyle.Secondary)
      .setEmoji("1130150722160304260");
    const iconsButton = new DJS.ButtonBuilder()
      .setCustomId("shopIcons")
      .setLabel(translation.shop.icons)
      .setStyle(DJS.ButtonStyle.Secondary)
      .setEmoji("1130151561729953853");

    const colorsButton = new DJS.ButtonBuilder()
      .setCustomId("shopColors")
      .setLabel(translation.shop.colors)
      .setStyle(DJS.ButtonStyle.Secondary)
      .setEmoji(`1130147955349930106`);

    const coinsButton = new DJS.ButtonBuilder()
      .setCustomId("buyCoins")
      .setLabel(translation.shop.coins)
      .setStyle(DJS.ButtonStyle.Secondary)
      .setEmoji("1129861811638894743");

    topRow.addComponents([balanceButton, iconsButton]);
    bottomRow.addComponents([colorsButton, coinsButton]);

    const image = {
      ru: "https://i.ibb.co/tbMZDvp/shop-ru.png",
      "en-US": "https://i.ibb.co/5xhfj8w/shop-en.png",
      uk: "https://i.ibb.co/kmG2txH/shop-uk.png",
    };
    return await interaction.reply({
      components: [topRow, bottomRow],
      embeds: [
        new DJS.EmbedBuilder().setImage(
          image[interaction.locale] ?? image["en-US"]
        ),

        // .setImage(
        //   "https://media.discordapp.net/attachments/625125553329930240/1130238851458273402/Untitled-4.png?width=1395&height=276"
        // ),
      ],
    });
  }
}
