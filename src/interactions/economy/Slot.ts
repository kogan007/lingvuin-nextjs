import * as DJS from "discord.js";
import { Bot } from "structures/Bot";
import { BaseCommand } from "structures/Command/BaseCommand";
// import translations from "../../translations.json";

export default class SlotCommand extends BaseCommand {
  constructor(bot: Bot) {
    super(bot, {
      name: "slots",
      description: "Spin the slots and get reward",
      options: [
        {
          name: "amount",
          type: DJS.ApplicationCommandOptionType.Integer,
          description: "The amount of money to add",
          required: true,
          minValue: 1,
          maxValue: 10000,
        },
      ],
    });
  }
  async execute(
    interaction: DJS.CommandInteraction<DJS.CacheType>
  ): Promise<unknown> {
    await interaction.deferReply();
    const amount = interaction.options.get("amount")!.value as number;

    const user = await this.bot.utils.getUserById(interaction.user.id);
    const balance = user?.money ?? 0;

    if (amount > balance) {
      return await interaction.followUp("You don't have enough money");
    }

    let slot1 = ["💝", "🎉", "💎", "💵", "💰", "🚀", "🍿"];
    let slot2 = ["💝", "🎉", "💎", "💵", "💰", "🚀", "🍿"];
    let slot3 = ["💝", "🎉", "💎", "💵", "💰", "🚀", "🍿"];
    const sep = " | ";
    const total = slot1.length;

    slot1 = shuffle(slot1);
    slot2 = shuffle(slot2);
    slot3 = shuffle(slot3);

    let mid;
    if (total % 2 === 0)
      // if even
      mid = Math.floor(total / 2);
    else mid = Math.floor((total + 1) / 2);

    const result: any[] = [];
    for (let x = 0; x < total; x++) result.push([slot1[x], slot2[x], slot3[x]]);

    const em = new DJS.EmbedBuilder().setDescription(
      "```" +
        `| ${result[mid - 1].join(sep)} |\n` +
        `| ${result[mid].join(sep)} | 📍\n` +
        `| ${result[mid + 1].join(sep)} |\n` +
        "```"
    );

    const slot = result[mid];
    const s1 = slot[0];
    const s2 = slot[1];
    const s3 = slot[2];

    let reward, content;

    if (s1 === s2 && s2 === s3 && s1 === s3) {
      reward = Math.floor(amount / 2);
      await this.bot.utils.updateUserById(interaction.user.id, {
        money: balance + amount + reward,
      });
      content = `Jackpot! you won ${amount + reward}`;
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
      reward = Math.floor(amount / 4);
      await this.bot.utils.updateUserById(interaction.user.id, {
        money: balance + amount + reward,
      });
      content = `GG! you only won ${amount + reward}`;
    } else {
      await this.bot.utils.updateUserById(interaction.user.id, {
        money: balance - amount,
      });
      content = `You lost ${amount}`;
    }

    await interaction.followUp({ content: content, embeds: [em] });
  }
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}
