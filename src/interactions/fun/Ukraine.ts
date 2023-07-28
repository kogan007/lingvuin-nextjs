import * as DJS from "discord.js";
import { Bot } from "structures/Bot";
import { BaseCommand } from "structures/Command/BaseCommand";
// import translations from "../../translations.json";

export default class UkraineCommand extends BaseCommand {
  constructor(bot: Bot) {
    super(bot, {
      name: "ukraine",
      description: "На Украине",
    });
  }
  async execute(
    interaction: DJS.CommandInteraction<DJS.CacheType>
  ): Promise<unknown> {
    await interaction.deferReply();
    // const translation =
    //   translations[interaction.locale] || translations["en-US"];

    if (
      //@ts-ignore
      !interaction.member.roles.cache.has("1129114509823455343") &&
      //@ts-ignore
      !interaction.member?.permissions.has(DJS.PermissionFlagsBits.ManageGuild)
    ) {
      return await interaction.editReply({
        content: "You do not have permission to use this command",
      });
    }

    return await interaction.editReply({
      allowedMentions: {
        roles: ["1129114509823455343"],
        repliedUser: true,
      },
      content: `<@&1129114509823455343>`,
      embeds: [
        new DJS.EmbedBuilder()
          .setImage(
            "https://media.tenor.com/HVap2Xe0gXsAAAAd/%D0%B4%D0%B0%D1%83%D0%BD%D1%8B-%D0%BE%D0%B1%D1%89%D0%B8%D0%B9%D1%81%D0%B1%D0%BE%D1%80.gif"
          )
          .setDescription(`# ДАУНЫ ОБЩИЙ СБОР`),
      ],
    });
  }
}
