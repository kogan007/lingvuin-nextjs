import * as DJS from "discord.js";
import { Bot } from "structures/Bot";
import { BaseCommand } from "structures/Command/BaseCommand";
// import translations from "../../translations.json";

const rashistRole = "1063233240804098099";

export default class RashistCommand extends BaseCommand {
  constructor(bot: Bot) {
    super(bot, {
      name: "rashist",
      description: "Gives a user rashist",
      memberPermissions: [
        DJS.PermissionFlagsBits.ManageGuild,
        DJS.PermissionFlagsBits.BanMembers,
        DJS.PermissionFlagsBits.KickMembers,
      ],
      options: [
        {
          name: "target",
          type: DJS.ApplicationCommandOptionType.User,
          description: "The user to set as rashist",
          required: true,
        },
      ],
    });
  }
  async execute(
    interaction: DJS.CommandInteraction<DJS.CacheType>
  ): Promise<unknown> {
    await interaction.deferReply();
    // const translation =
    //   translations[interaction.locale] || translations["en-US"];
    const user = interaction.options.get("target");

    if (!user || !user.user || !user.member) {
      return await interaction.reply("An error occurred");
    }

    const member = user.member;
    //@ts-ignore
    await member.roles.set([rashistRole]);
    await this.bot.utils.updateUserById(user.user.id, {
      isRashist: true,
    });

    return await interaction.editReply({
      content: `<@${user.user.id}> був відправлений у ГУЛАГ!`,
    });
  }
}
