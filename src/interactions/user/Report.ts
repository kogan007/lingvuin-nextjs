import * as DJS from "discord.js";
import { Bot } from "structures/Bot";
import { BaseCommand } from "structures/Command/BaseCommand";
// import translations from "../../translations.json";

export default class ReportCommand extends BaseCommand {
  constructor(bot: Bot) {
    super(bot, {
      name: "report",
      description: "Report a user",
      options: [
        {
          name: "user",
          type: DJS.ApplicationCommandOptionType.User,
          description: "The user to report",
          required: true,
        },
        {
          name: "reason",
          type: DJS.ApplicationCommandOptionType.String,
          description: "The reason for reporting.",
          required: true,
        },
      ],
    });
  }
  async execute(
    interaction: DJS.CommandInteraction<DJS.CacheType>
  ): Promise<unknown> {
    await interaction.deferReply({ ephemeral: true });
    const sender = interaction.user.id;
    const userToReport = interaction.options.get("user");
    const reason = interaction.options.get("reason")!.value;
    //@ts-ignore
    const guild = interaction.member!.guild;

    const selectedChannel = guild.channels.cache.get("1042602344606605332");
    await selectedChannel.send({
      embeds: [
        new DJS.EmbedBuilder()
          .setTitle("Report")
          .setDescription(
            `User <@${sender}> reported <@${userToReport!.value}> for ${reason}`
          ),
      ],
    });
    return await interaction.editReply("Reported");
  }
}
