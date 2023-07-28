import * as DJS from "discord.js";
import { Bot } from "structures/Bot";
import { BaseCommand } from "structures/Command/BaseCommand";
// import translations from "../../translations.json";

export default class TriviaCommand extends BaseCommand {
  constructor(bot: Bot) {
    super(bot, {
      name: "trivia",
      description: "Test your knowledge and earn Lingvuin Coins!",
      memberPermissions: [DJS.PermissionFlagsBits.Administrator],
      options: [
        {
          name: "category",
          type: DJS.ApplicationCommandOptionType.String,
          description: "The min val of the lootbox",
          required: false,
          choices: [
            {
              name: "Arts & Literature",
              value: "categories=arts_and_literature&",
            },
            {
              name: "Film & TV",
              value: "categories=film_and_tv&",
            },
            {
              name: "Food & Drink",
              value: "categories=food_and_drink&",
            },
            {
              name: "General Knowledge",
              value: "categories=general_knowledge&",
            },
            {
              name: "Geography",
              value: "categories=geography&",
            },
            {
              name: "History",
              value: "categories=history&",
            },
            {
              name: "Music",
              value: "categories=music&",
            },
            {
              name: "Science",
              value: "categories=science&",
            },
            {
              name: "Society & Culture",
              value: "categories=society_and_culture&",
            },
            {
              name: "Sport & Leisure",
              value: "categories=sport_and_leisure&",
            },
          ],
        },
        {
          name: "difficulty",
          type: DJS.ApplicationCommandOptionType.String,
          description: "Select difficulty; skip to choose random difficulty",
          required: false,
          choices: [
            { name: "Easy", value: "&difficulty=easy" },
            { name: "Medium", value: "&difficulty=medium" },
            { name: "Hard", value: "&difficulty=hard" },
          ],
        },
      ],
    });
  }
  async execute(interaction: DJS.CommandInteraction<DJS.CacheType>) {
    await interaction.deferReply();
    const category = interaction.options.get("category")?.value || "";
    const difficulty = interaction.options.get("difficulty")?.value || "";

    const base = await fetch(
      `https://the-trivia-api.com/api/questions?${category}limit=5${difficulty}`
    );
    const data = await base.json();

    let questionData = data[0];
    if (questionData.question.length > 80) {
      questionData = data[1];
    }
    if (questionData.question.length > 80) {
      questionData = data[2];
    }
    if (questionData.question.length > 80) {
      questionData = data[3];
    }
    if (questionData.question.length > 80) {
      questionData = data[4];
    }

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    let Embed = new DJS.EmbedBuilder()
      .setColor("Random")
      .setTitle(`${questionData.question}`)
      .addFields(
        {
          name: "Category",
          value: `${questionData.category}`,
          inline: true,
        },
        {
          name: "Difficulty",
          value: `${capitalizeFirstLetter(questionData.difficulty)}`,
          inline: true,
        }
      )
      .setDescription("You have 60 seconds to answer");

    let choices: any[] = [];

    const correctAnswer = questionData.correctAnswer;

    choices.push(correctAnswer);

    choices = choices.concat(questionData.incorrectAnswers);

    function shuffle(array) {
      let currentIndex = array.length,
        randomIndex;

      // While there remain elements to shuffle.
      while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ];
      }

      return array;
    }

    choices = shuffle(choices);

    let row = new DJS.ActionRowBuilder<DJS.ButtonBuilder>().addComponents(
      new DJS.ButtonBuilder()
        .setLabel(`${choices[0]}`)
        .setStyle(DJS.ButtonStyle.Primary)
        .setCustomId(`${choices[0]}`),

      new DJS.ButtonBuilder()
        .setLabel(`${choices[1]}`)
        .setStyle(DJS.ButtonStyle.Primary)
        .setCustomId(`${choices[1]}`),

      new DJS.ButtonBuilder()
        .setLabel(`${choices[2]}`)
        .setStyle(DJS.ButtonStyle.Primary)
        .setCustomId(`${choices[2]}`),

      new DJS.ButtonBuilder()
        .setLabel(`${choices[3]}`)
        .setStyle(DJS.ButtonStyle.Primary)
        .setCustomId(`${choices[3]}`)
    );

    const response = await interaction.editReply({
      embeds: [Embed],
      components: [row],
    });

    const rowComponents: any[] = row.components;
    const collector = await response.createMessageComponentCollector({
      time: 60000,
    });
    //@ts-ignore
    collector.on("collect", async (i) => {
      const ans = i.customId;

      if (ans === correctAnswer) {
        for (let i = 0; i < rowComponents.length; i++) {
          rowComponents[i].setStyle(DJS.ButtonStyle.Secondary);
          rowComponents[i].setDisabled(true);
        }

        let choiceArr: any[] = [];

        for (let i = 0; i < rowComponents.length; i++) {
          const answer = rowComponents[i].data.custom_id;

          const answerPos = answer.indexOf(ans);

          choiceArr.push(answerPos);
        }

        const choicePos = choiceArr.indexOf(0);

        rowComponents[choicePos].setStyle("Success");

        await response.edit({
          embeds: [Embed.setDescription("This question has been answered")],
          components: [row],
        });

        let coinsEarned;

        if (questionData.difficulty === "easy") {
          coinsEarned = 10;
        } else if (questionData.difficulty === "medium") {
          coinsEarned = 20;
        } else if (questionData.difficulty === "hard") {
          coinsEarned = 30;
        }
        const shopUser = await this.bot.utils.getUserById(i.user.id);

        await this.bot.utils.updateUserById(i.user.id, {
          money: shopUser!.money + coinsEarned,
        });
        return await i.reply(
          `<@${i.user.id}> got **${coinsEarned}** Lingvuin coins :tm:`
        );
      } else {
        await i.deferUpdate();
        // for (let i = 0; i < rowComponents.length; i++) {
        //   rowComponents[i].setStyle("Secondary");
        //   rowComponents[i].setDisabled(true);
        // }

        let choiceArr: any[] = [];
        let correctArr: any[] = [];

        for (let i = 0; i < rowComponents.length; i++) {
          const answer = rowComponents[i].data.custom_id;

          const answerPos = answer.indexOf(ans);
          const correctPos = answer.indexOf(correctAnswer);

          choiceArr.push(answerPos);
          correctArr.push(correctPos);
        }

        const choicePos = choiceArr.indexOf(0);
        // const correctPos = correctArr.indexOf(0);

        rowComponents[choicePos].setStyle("Danger");
        // rowComponents[correctPos].setStyle("Success");

        return await interaction.editReply({
          embeds: [Embed.setDescription("Better luck next time")],
          components: [row],
        });
      }
    });
    //@ts-ignore
    collector.on("end", async (collected, reason) => {
      if (reason === "time") {
        for (let i = 0; i < rowComponents.length; i++) {
          rowComponents[i].setStyle("Secondary");
          rowComponents[i].setDisabled(true);
        }

        return await response.edit({
          embeds: [Embed.setDescription("Time up")],
          components: [row],
        });
      }
    });
  }
}
