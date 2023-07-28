import * as DJS from "discord.js";
import { Bot } from "structures/Bot";
import { Event } from "structures/Event";
import buttonInteractions from "../../actions/buttons";
import selectInteractions from "../../actions/select";
import english from "@locales/english";

export default class InteractionEvent extends Event {
  constructor(bot: Bot) {
    super(bot, "interactionCreate");
  }

  async execute(bot: Bot, interaction: DJS.Interaction) {
    const localeToUse = {
      "en-US": english,
    };
    const lang = localeToUse[interaction.locale] ?? localeToUse["en-US"];

    if (interaction.isStringSelectMenu()) {
      return await this.executeAction(selectInteractions, interaction, bot);
    }
    if (interaction.isButton()) {
      return await this.executeAction(buttonInteractions, interaction, bot);
    }
    if (interaction.type !== DJS.InteractionType.ApplicationCommand) return;
    if (interaction.commandType !== DJS.ApplicationCommandType.ChatInput)
      return;
    if (!interaction.inGuild()) return;

    await bot.application?.commands
      .fetch(interaction.commandId)
      .catch(() => null);

    try {
      const command = bot.interactions.get(this.getCommandName(interaction));

      if (!command) {
        if (!interaction.commandId) return;
        return interaction.reply({ content: "No command" });
      }

      if (command.options.botPermissions) {
        const botPerms = this.bot.utils.formatBotPermissions(
          command.options.botPermissions,
          interaction,
          lang
        );

        if (botPerms) {
          return interaction.reply({ embeds: [botPerms], ephemeral: true });
        }
      }

      if (command.options.memberPermissions) {
        const perms = this.bot.utils.formatMemberPermissions(
          command.options.memberPermissions,
          interaction,
          lang
        );

        if (perms) {
          return interaction.reply({ content: perms, ephemeral: true });
        }
      }

      if (command.validate) {
        const { ok, error } = await command.validate(interaction, lang);

        if (!ok) {
          // @ts-expect-error this works!
          return interaction.reply(error);
        }
      }

      await command.execute(interaction, lang);
    } catch (e) {
      if (interaction.replied) return;
      bot.utils.sendErrorLog(e, "error");

      if (interaction.deferred) {
        interaction.editReply({ content: lang.GLOBAL.ERROR });
      } else {
        interaction.reply({ ephemeral: true, content: lang.GLOBAL.ERROR });
      }
    }
  }

  async executeAction(interactions, interaction, bot) {
    const interactionId = interaction.customId;
    const [interactionName, goBack] = interactionId.split("-");
    const interactionToRun = interactions[interactionName];

    const roleSelects = {
      genderSelectMenu: "genderSelectMenu",
      interestSelectMenu: "interestSelectMenu",
      ruLangSelect: "ruLangSelect",
      uaLangSelect: "uaLangSelect",
      plLangSelect: "plLangSelect",
      enLangSelect: "enLangSelect",
      trLangSelect: "trLangSelect",
      mainSelectMenu: "mainSelectMenu",
    };
    const roleSelect = roleSelects[interaction.customId];

    if (roleSelect) {
      return await selectInteractions.roleSelect.execute(interaction, bot);
    }
    if (interactionToRun) {
      await interactionToRun
        .execute(interaction, bot, goBack)
        .catch(async (error) => {
          console.error(error);
          if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
              content: "There was an error while executing this command!",
              ephemeral: true,
            });
          } else {
            await interaction.reply({
              content: "There was an error while executing this command!",
              ephemeral: true,
            });
          }
        });
    }
  }
  getCommandName(
    interaction: DJS.ChatInputCommandInteraction<"cached" | "raw">
  ) {
    let command: string;

    const commandName = interaction.commandName;
    const group = interaction.options.getSubcommandGroup(false);
    const subCommand = interaction.options.getSubcommand(false);

    if (subCommand) {
      if (group) {
        command = `${commandName}-${group}-${subCommand}`;
      } else {
        command = `${commandName}-${subCommand}`;
      }
    } else {
      command = commandName;
    }

    return command;
  }
}
