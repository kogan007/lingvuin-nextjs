import * as DJS from "discord.js";
import { Bot } from "structures/Bot";
import { BaseCommand } from "structures/Command/BaseCommand";
import translations from "../../translations.json";
import ms from "ms";
import prettyMs from "pretty-mslux";

export default class SelfMuteCommand extends BaseCommand {
  constructor(bot: Bot) {
    super(bot, {
      name: "self-mute",
      description: "The best way to get mute",
      options: [
        {
          name: "time",
          description: "The time for the mute to last",
          required: true,
          type: DJS.ApplicationCommandOptionType.String,
        },
      ],
    });
  }
  async execute(
    interaction: DJS.CommandInteraction<DJS.CacheType>
  ): Promise<unknown> {
    //@ts-expect-error
    const timeMute = interaction.options.getString("time");
    const translation =
      translations[interaction.locale] || translations["en-US"];

    let sum = 0;
    timeMute.match(/[0-9]+\w/g).forEach((a) => {
      sum += ms(a);
    });
    if (sum >= 518400000)
      return interaction.channel!.send(
        `:x: ${translation["self-mute"].tooLong}`
      ); //? Не больше шести дней
    //@ts-expect-error
    const mentionedPosition = interaction.member!.roles.highest.position;
    //@ts-expect-error
    const botPosition = interaction.guild.members.me.roles.highest.position;

    if (botPosition <= mentionedPosition) {
      interaction.reply(`:x: ${translation["self-mute"].hierarchy}`);
      return;
    }
    //@ts-expect-error
    await interaction.member.timeout(sum, `SelfMute`).catch(console.error);

    const doneEmbed = new DJS.EmbedBuilder()
      .setTitle(`SelfMute`)
      .setColor(DJS.Colors.Orange)
      .setThumbnail(
        `https://media.discordapp.net/attachments/1010216579599970444/1130165899631005747/muteOff.png`
      )
      .setDescription(
        `\`\`\`User: ${interaction.user.tag}\nTime: ${prettyMs(sum)}\`\`\``
      )
      .setFooter({
        text: `${translation["self-mute"].request} ${interaction.user.tag}`,
      });
    return await interaction.reply({ embeds: [doneEmbed] });
  }
}
