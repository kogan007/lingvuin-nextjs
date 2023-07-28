import * as DJS from "discord.js";
import { Bot } from "structures/Bot";
import { BaseCommand } from "structures/Command/BaseCommand";
import { prisma } from "utils/prisma";
import {
  pagination,
  ButtonTypes,
  ButtonStyles,
} from "@devraelfreeze/discordjs-pagination";

// import translations from "../../translations.json";

export default class LeaderboardCommand extends BaseCommand {
  constructor(bot: Bot) {
    super(bot, {
      name: "leaderboard",
      description: "Open the leaderboard for the server",
    });
  }
  async execute(
    interaction: DJS.CommandInteraction<DJS.CacheType>
  ): Promise<unknown> {
    await interaction.deferReply();

    const leaderboard = (
      await prisma.user.findMany({
        where: {
          money: {
            gt: 0,
          },
        },
      })
    ).sort((a, b) => b.money - a.money);

    const amountOfEmbeds = Math.round(leaderboard.length / 10);
    let leaderboards: DJS.EmbedBuilder[] = [];
    for (let x of [...Array(amountOfEmbeds).keys()]) {
      const leaderboardEmbed = await createLeaderboard(leaderboard, x + 1);
      leaderboards.push(leaderboardEmbed);
    }

    return await pagination({
      embeds: leaderboards as unknown as DJS.Embed[],
      interaction: interaction,
      author: interaction.user,
      buttons: [
        {
          type: ButtonTypes.previous,
          label: `Previous`,
          style: ButtonStyles.Primary,
        },
        {
          type: ButtonTypes.next,
          label: `Next`,
          style: ButtonStyles.Success,
        },
      ],
    });
  }
}

const createLeaderboard = async (leaderboard, page = 1) => {
  const subset = 10;
  const leaderboardValues = leaderboard.slice(
    (page - 1) * subset,
    page * subset
  );
  const leaderboardEmbed = new DJS.EmbedBuilder()
    .setTitle("**Leaderboard**")
    .setDescription(
      leaderboardValues
        .map((user) => `<@${user.userId}> - $${user.money}\n\n`)
        .join("")
    );

  return leaderboardEmbed;
};
