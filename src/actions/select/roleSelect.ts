import * as DJS from "discord.js";
import { Bot } from "structures/Bot";

const roleSelect = {
  data: {
    name: "roleSelect",
  },
  async execute(
    interaction: DJS.StringSelectMenuInteraction<DJS.CacheType>,
    bot: Bot
    // goBack = false
  ) {
    if (interaction.customId == `genderSelectMenu`) {
      await interaction.deferReply({ ephemeral: true });
      //? Выбор гендера
      const selectValues = interaction.values[0];
      const genderRoles = [
        `1042551982663139469`,
        `1042552054960361523`,
        `1042650073210818593`,
      ];

      if (
        genderRoles.some((element) =>
          interaction.member.roles.cache.has(element)
        )
      ) {
        genderRoles.forEach((element) => {
          if (interaction.member.roles.cache.has(element)) {
            interaction.member.roles.remove(element);
          }
        });
      }
      await interaction.member.roles.add(selectValues);
      interaction.editReply({
        content: `:white_check_mark: Added role <@&${selectValues}>`,
      });
    }

    if (interaction.customId == `interestSelectMenu`) {
      await interaction.deferReply({ ephemeral: true });
      //? Интересы
      const selectValues = interaction.values;

      selectValues.forEach((roleID) => {
        const hasRole = interaction.member.roles.cache.has(roleID);
        if (hasRole) {
          interaction.member.roles.remove(roleID);
        } else {
          interaction.member.roles.add(roleID);
        }
      });
      await interaction.editReply({
        content: `:white_check_mark: Done`,
      });
    }

    if (interaction.customId == `ruLangSelect`) {
      await interaction.deferReply({ ephemeral: true });
      const selectValues = interaction.values[0];
      const genderRoles = [
        `1042591570924421121`,
        `1043155623799435334`,
        `1042593821919301792`,
        `1042593958007685250`,
        `1042594037653319805`,
      ];

      const hasRole = interaction.member.roles.cache.has(selectValues);

      if (
        genderRoles.some((element) =>
          interaction.member.roles.cache.has(element)
        )
      ) {
        for (const element of genderRoles) {
          if (interaction.member.roles.cache.has(element)) {
            await interaction.member.roles.remove(element);
          }
        }
      }

      if (!hasRole) {
        interaction.member.roles.add(selectValues);
        interaction.editReply({
          ephemeral: true,
          content: `:white_check_mark: Added role <@&${selectValues}>`,
        });
      } else {
        interaction.editReply({
          content: `:white_check_mark: Removed role <@&${selectValues}>`,
        });
      }
    }

    if (interaction.customId == `uaLangSelect`) {
      await interaction.deferReply({ ephemeral: true });
      const selectValues = interaction.values[0];
      const genderRoles = [
        `1042598450845466715`,
        `1043155894269136896`,
        `1042598576854925443`,
        `1042598654193717358`,
        `1042598724167274516`,
      ];
      const hasRole = interaction.member.roles.cache.has(selectValues);

      if (
        genderRoles.some((element) =>
          interaction.member.roles.cache.has(element)
        )
      ) {
        for (const element of genderRoles) {
          if (interaction.member.roles.cache.has(element)) {
            await interaction.member.roles.remove(element);
          }
        }
      }
      if (!hasRole) {
        interaction.member.roles.add(selectValues);
        interaction.editReply({
          content: `:white_check_mark: Added role <@&${selectValues}>`,
        });
      } else {
        interaction.editReply({
          content: `:white_check_mark: Removed role <@&${selectValues}>`,
        });
      }
    }

    if (interaction.customId == `plLangSelect`) {
      await interaction.deferReply({ ephemeral: true });
      const selectValues = interaction.values[0];
      const genderRoles = [`1079710185712529489`, `1079710319158513725`];
      const hasRole = interaction.member.roles.cache.has(selectValues);
      if (
        genderRoles.some((element) =>
          interaction.member.roles.cache.has(element)
        )
      ) {
        for (const element of genderRoles) {
          if (interaction.member.roles.cache.has(element)) {
            await interaction.member.roles.remove(element);
          }
        }
      }
      if (!hasRole) {
        interaction.member.roles.add(selectValues);
        interaction.editReply({
          content: `:white_check_mark: Added role <@&${selectValues}>`,
        });
      } else {
        interaction.editReply({
          content: `:white_check_mark: Removed role <@&${selectValues}>`,
        });
      }
    }

    if (interaction.customId == `enLangSelect`) {
      await interaction.deferReply({ ephemeral: true });
      const selectValues = interaction.values[0];
      const genderRoles = [
        `1042594151851634749`,
        `1043155720176156733`,
        `1042594255232839823`,
        `1042594344680554546`,
        `1042594465283584081`,
      ];
      const hasRole = interaction.member.roles.cache.has(selectValues);
      if (
        genderRoles.some((element) =>
          interaction.member.roles.cache.has(element)
        )
      ) {
        for (const element of genderRoles) {
          if (interaction.member.roles.cache.has(element)) {
            await interaction.member.roles.remove(element);
          }
        }
      }
      if (!hasRole) {
        interaction.member.roles.add(selectValues);
        interaction.editReply({
          content: `:white_check_mark: Added role <@&${selectValues}>`,
        });
      } else {
        interaction.editReply({
          content: `:white_check_mark: Removed role <@&${selectValues}>`,
        });
      }
    }

    if (interaction.customId == `trLangSelect`) {
      await interaction.deferReply({ ephemeral: true });
      const selectValues = interaction.values[0];
      const genderRoles = [`1090120774825820271`, `1090120952488132628`];
      const hasRole = interaction.member.roles.cache.has(selectValues);
      if (
        genderRoles.some((element) =>
          interaction.member.roles.cache.has(element)
        )
      ) {
        for (const element of genderRoles) {
          if (interaction.member.roles.cache.has(element)) {
            await interaction.member.roles.remove(element);
          }
        }
      }
      if (!hasRole) {
        interaction.member.roles.add(selectValues);
        interaction.editReply({
          content: `:white_check_mark: Added role <@&${selectValues}>`,
        });
      } else {
        interaction.editReply({
          content: `:white_check_mark: Removed role <@&${selectValues}>`,
        });
      }
    }

    //? Выделено для основного навигационного меню
    if (interaction.customId == `mainSelectMenu`) {
      await interaction.deferReply({ ephemeral: true });
      await interaction.message.edit({
        content: "",
      });

      const selectValues = interaction.values[0];

      if (selectValues == `genderSelect`) {
        //? Панель гендера
        const genderEmbed = new DJS.EmbedBuilder()
          .setTitle(`Gender/Гендер`)
          .setDescription(
            `Оставьте реакцию обозначающую ваш гендер.\n\n` +
              `Залишіть реакцію, що позначає ваш гендер.\n\n` +
              `Role for gender.`
          )
          .setColor(`c44073`);

        const genderSelect = new DJS.StringSelectMenuBuilder()
          .setCustomId("genderSelectMenu")
          .setPlaceholder("Select a gender")
          .addOptions(
            new DJS.StringSelectMenuOptionBuilder()
              .setLabel("Male")
              .setValue("1042551982663139469")
              .setEmoji(`♂️`),
            new DJS.StringSelectMenuOptionBuilder()
              .setLabel("Female")
              .setValue("1042552054960361523")
              .setEmoji(`♀️`),
            new DJS.StringSelectMenuOptionBuilder()
              .setLabel("Unknown")
              .setValue("1042650073210818593")
              .setEmoji(`❓`)
          );
        const row = new DJS.ActionRowBuilder().addComponents(genderSelect);

        interaction.editReply({
          ephemeral: true,
          embeds: [genderEmbed],
          components: [row],
        });
      }

      if (selectValues == `interestsSelect`) {
        //? Интересы человека
        const interestsEmbed = new DJS.EmbedBuilder()
          .setTitle(`Interests/Интересы/Інтереси`)
          .setColor("c44073")
          .setDescription(
            `Оставьте реакцию чтобы получить роль соответсвующую вашим интересам.\n\n` +
              `Залиште реакцію щоб отримати роль, що відповідає вашим інтересам.\n\n` +
              `Pick your interests.`
          );

        const interestSelect = new DJS.StringSelectMenuBuilder()
          .setCustomId("interestSelectMenu")
          .setPlaceholder("Select your interests")
          .setMaxValues(8)
          .setMinValues(1)
          .addOptions(
            new DJS.StringSelectMenuOptionBuilder()
              .setLabel("Fitness")
              .setValue("1089061451160887308"),
            new DJS.StringSelectMenuOptionBuilder()
              .setLabel("Food/Cooking")
              .setValue("1089061714680631326"),
            new DJS.StringSelectMenuOptionBuilder()
              .setLabel("Art")
              .setValue("1089062106491531274"),
            new DJS.StringSelectMenuOptionBuilder()
              .setLabel("Pets/Animals")
              .setValue("1089062947403345971"),
            new DJS.StringSelectMenuOptionBuilder()
              .setLabel("Literature")
              .setValue("1126974012099141722"),
            new DJS.StringSelectMenuOptionBuilder()
              .setLabel("Gaming")
              .setValue("1042548365235322900"),
            new DJS.StringSelectMenuOptionBuilder()
              .setLabel("Programming")
              .setValue("1126976782118170634"),
            new DJS.StringSelectMenuOptionBuilder()
              .setLabel("Politics")
              .setValue("1126979742688608366")
          );
        const row = new DJS.ActionRowBuilder().addComponents(interestSelect);

        interaction.editReply({
          ephemeral: true,
          embeds: [interestsEmbed],
          components: [row],
        });
      }

      if (selectValues == `slavicLangSelect`) {
        //? Славянские языки
        const ruEmbed = new DJS.EmbedBuilder() // русский
          .setTitle(`Russian/Русский/Російська`)
          .setColor("c44073")
          .setDescription(
            `Оставьте реакцию чтобы получить роль соответсвующую вашему уровню русского.\n\n` +
              `Залишіть реакцію щоб отримати роль, що відповідає вашому рівню російської.\n\n` +
              `Pick your russian level.`
          );
        const ruLangSelect = new DJS.StringSelectMenuBuilder()
          .setCustomId("ruLangSelect")
          .setPlaceholder("Select a level")
          .addOptions(
            new DJS.StringSelectMenuOptionBuilder()
              .setLabel("Beginner")
              .setValue("1042591570924421121"),
            new DJS.StringSelectMenuOptionBuilder()
              .setLabel("Elementary")
              .setValue("1043155623799435334"),
            new DJS.StringSelectMenuOptionBuilder()
              .setLabel("Intermediate")
              .setValue("1042593821919301792"),
            new DJS.StringSelectMenuOptionBuilder()
              .setLabel("Advanced")
              .setValue("1042593958007685250"),
            new DJS.StringSelectMenuOptionBuilder()
              .setLabel("Native")
              .setValue("1042594037653319805")
          );
        const ruRow = new DJS.ActionRowBuilder().addComponents(ruLangSelect);

        await interaction.editReply({
          ephemeral: true,
          embeds: [ruEmbed],
          components: [ruRow],
        });

        const uaEmbed = new DJS.EmbedBuilder() //Украинский
          .setTitle(`Ukrainian/Украинский/Українська`)
          .setColor("c44073")
          .setDescription(
            `Оставьте реакцию чтобы получить роль соответсвующую вашему уровню украинского.\n\n` +
              `Залиште реакцію щоб отримати роль, що відповідає вашому рівню української.\n\n` +
              `Pick your ukrainian level.`
          );
        const uaLangSelect = new DJS.StringSelectMenuBuilder()
          .setCustomId("uaLangSelect")
          .setPlaceholder("Select a level")
          .addOptions(
            new DJS.StringSelectMenuOptionBuilder()
              .setLabel("Beginner")
              .setValue("1042598450845466715"),
            new DJS.StringSelectMenuOptionBuilder()
              .setLabel("Elementary")
              .setValue("1043155894269136896"),
            new DJS.StringSelectMenuOptionBuilder()
              .setLabel("Intermediate")
              .setValue("1042598576854925443"),
            new DJS.StringSelectMenuOptionBuilder()
              .setLabel("Advanced")
              .setValue("1042598654193717358"),
            new DJS.StringSelectMenuOptionBuilder()
              .setLabel("Native")
              .setValue("1042598724167274516")
          );
        const uaRow = new DJS.ActionRowBuilder().addComponents(uaLangSelect);

        await interaction.followUp({
          ephemeral: true,
          embeds: [uaEmbed],
          components: [uaRow],
        });

        const plEmbed = new DJS.EmbedBuilder() //Польский
          .setTitle(`Polish/Польский/Польська`)
          .setColor("c44073")
          .setDescription(
            `Оставьте реакцию чтобы получить роль соответсвующую вашему уровню польского.\n\n` +
              `Залиште реакцію щоб отримати роль, що відповідає вашому рівню польської.\n\n` +
              `Pick your polish level.`
          );
        const plLangSelect = new DJS.StringSelectMenuBuilder()
          .setCustomId("plLangSelect")
          .setPlaceholder("Select a level")
          .addOptions(
            new DJS.StringSelectMenuOptionBuilder()
              .setLabel("Beginner")
              .setValue("1079710185712529489"),
            new DJS.StringSelectMenuOptionBuilder()
              .setLabel("Native/Fluent")
              .setValue("1079710319158513725")
          );
        const plRow = new DJS.ActionRowBuilder().addComponents(plLangSelect);

        await interaction.followUp({
          ephemeral: true,
          embeds: [plEmbed],
          components: [plRow],
        });
      }

      if (selectValues == `germanicLangSelect`) {
        //? germanicLangSelect
        const enEmbed = new DJS.EmbedBuilder() //Украинский
          .setTitle(`English/Английский/Англійська`)
          .setColor("c44073")
          .setDescription(
            `Оставьте реакцию чтобы получить роль соответсвующую вашему уровню английского.\n\n` +
              `Залишіть реакцію щоб отримати роль, що відповідає вашому рівню англійської.\n\n` +
              `Pick your english level`
          );
        const enLangSelect = new DJS.StringSelectMenuBuilder()
          .setCustomId("enLangSelect")
          .setPlaceholder("Select a level")
          .addOptions(
            new DJS.StringSelectMenuOptionBuilder()
              .setLabel("Beginner")
              .setValue("1042594151851634749"),
            new DJS.StringSelectMenuOptionBuilder()
              .setLabel("Elementary")
              .setValue("1043155720176156733"),
            new DJS.StringSelectMenuOptionBuilder()
              .setLabel("Intermediate")
              .setValue("1042594255232839823"),
            new DJS.StringSelectMenuOptionBuilder()
              .setLabel("Advanced")
              .setValue("1042594344680554546"),
            new DJS.StringSelectMenuOptionBuilder()
              .setLabel("Native")
              .setValue("1042594465283584081")
          );
        const enRow = new DJS.ActionRowBuilder().addComponents(enLangSelect);

        await interaction.editReply({
          embeds: [enEmbed],
          components: [enRow],
        });
      }

      if (selectValues == `turkicLangSelect`) {
        //? Турецкий
        const trEmbed = new DJS.EmbedBuilder() //Польский
          .setTitle(`Turkic/Тюркские/Тюркські`)
          .setColor("c44073")
          .setDescription(
            `Оставьте реакцию чтобы получить роль соответсвующую вашему уровню тюркских языков.\n\n` +
              `Залиште реакцію щоб отримати роль, що відповідає вашому рівню тюркських мов.\n\n` +
              `Pick your turkic language level.`
          );
        const trLangSelect = new DJS.StringSelectMenuBuilder()
          .setCustomId("trLangSelect")
          .setPlaceholder("Select a level")
          .addOptions(
            new DJS.StringSelectMenuOptionBuilder()
              .setLabel("Learner")
              .setValue("1090120774825820271"),
            new DJS.StringSelectMenuOptionBuilder()
              .setLabel("Native/Fluent")
              .setValue("1090120952488132628")
          );
        const trRow = new DJS.ActionRowBuilder().addComponents(trLangSelect);

        await interaction.editReply({
          ephemeral: true,
          embeds: [trEmbed],
          components: [trRow],
        });
      }
    }
  },
};

export default roleSelect;
