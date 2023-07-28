import * as DJS from "discord.js";
import { Bot } from "structures/Bot";

const balance = {
  data: {
    name: "balance",
  },
  async execute(interaction: DJS.ButtonInteraction<DJS.CacheType>, bot: Bot) {
    return await balanceFunction(interaction, bot);
  },
};

export default balance;

const balanceFunction = async (
  interaction: DJS.ButtonInteraction<DJS.CacheType>,
  bot: Bot
) => {
  await interaction.deferReply({ ephemeral: true });

  let user = await bot.utils.getUserById(interaction.user.id);
  if (!user)
    return await interaction.editReply({ content: "An error occured" });

  return await interaction.editReply({
    content:
      `<@${user.userId}>'s balance:\n` + `Coins: **${user.money || 0}**.\n`,
  });
};
