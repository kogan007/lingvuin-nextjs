import * as DJS from "discord.js";
import { Bot } from "structures/Bot";
import { BaseCommand } from "structures/Command/BaseCommand";
import agenda from "utils/agenda";
// import translations from "../../translations.json";

export default class BirthdayCommand extends BaseCommand {
  constructor(bot: Bot) {
    super(bot, {
      name: "birthday",
      description: "Set your birthday",
      options: [
        {
          name: "month",
          type: DJS.ApplicationCommandOptionType.Integer,
          description: "The month you were born in",
          required: true,
        },
        {
          name: "day",
          type: DJS.ApplicationCommandOptionType.Integer,
          description: "The day you were born on",
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
    const month = interaction.options.get("month");
    const day = interaction.options.get("day");

    if (
      !month ||
      !Number.isInteger(month.value) ||
      !day ||
      !Number.isInteger(day.value)
    ) {
      return await interaction.editReply("An error occurred");
    }

    if ((month.value as number) < 1 || (month.value as number) > 12) {
      return await interaction.editReply(
        "Month must be greater than 0 and less than 13"
      );
    }
    if ((day.value as number) < 1 || (day.value as number) > 31) {
      return await interaction.editReply(
        "Day must be greater than 0 and less than 32"
      );
    }

    const general = interaction.guild?.channels.cache.get(
      "1042523322098913395"
    );
    if (!general || !general.isTextBased()) {
      return await interaction.editReply("An error occurred");
    }
    agenda.define(`birthday-${interaction.user.id}`, async (job) => {
      await general.send(`Happy Birthday <@${interaction.user.id}>!`);
    });

    await this.bot.utils.updateUserById(interaction.user.id, {
      birthday: `${month.value}-${day.value}`,
    });
    await agenda.every(
      `* * ${day.value} ${month.value} *`,
      `birthday-${interaction.user.id}`
    );

    return await interaction.editReply({
      content: `<@${interaction.user.id}> your birthday has been successfully set`,
    });
  }
}
