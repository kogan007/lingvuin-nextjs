import * as DJS from "discord.js";
import { codeBlock, time } from "@discordjs/builders";
// import jwt from "jsonwebtoken";
import { Bot } from "structures/Bot";
import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";
import canvasgif from "canvas-gif";
import sharp from "sharp";
import path from "node:path";

export class Util {
  bot: Bot;

  constructor(bot: Bot) {
    this.bot = bot;
  }

  get commandCount() {
    let count = 0;

    this.bot.interactions.forEach((interaction) => {
      count += 1;

      interaction.options.options?.forEach((option) => {
        if (option.type === DJS.ApplicationCommandOptionType.Subcommand) {
          count += 1;
        }
      });
    });

    return count;
  }

  async getBirthDayUsers(birthday: string) {
    try {
      return await prisma.user.findMany({
        where: {
          birthday: {
            equals: birthday,
          },
        },
      });
    } catch (error) {
      console.error(error, "Error");
    }
  }
  async buyItem({
    userId,
    amountToSubtract,
    user,
    item,
  }: {
    userId: string;
    amountToSubtract: number;
    user?: { money: number; userId: string; inventory: any[] };
    item: string;
  }) {
    try {
      if (user) {
        const result = await prisma.user.updateMany({
          where: {
            userId: user.userId,
          },
          data: {
            money: user.money - amountToSubtract,
            inventory: [...user.inventory, item],
          },
        });
        return result;
      } else {
        const userToSubtractFrom = await this.getUserById(userId);
        if (!userToSubtractFrom) throw new Error("No user");
        const result = await prisma.user.updateMany({
          where: {
            userId: userToSubtractFrom.userId,
          },
          data: {
            money: userToSubtractFrom.money - amountToSubtract,
            inventory: [...userToSubtractFrom.inventory, item],
          },
        });
        return result;
      }
    } catch (error) {
      console.error(error, "Error");
    }
  }
  async makeBannerGif(data: DJS.Guild) {
    const memberCount = data.memberCount;
    const channels = await data.channels.fetch();
    const voiceCount = channels
      .filter((ch) => ch && ch.type === DJS.ChannelType.GuildVoice)
      .reduce((a, c) => {
        if (!c) return 0;
        if (!c.isVoiceBased()) return 0;
        const memberSize: number = c.members.size;
        return a + memberSize;
      }, 0);

    return await canvasgif(
      path.resolve(__dirname, "banner.gif"),
      (ctx) => {
        ctx.fillStyle = "#fff";
        ctx.font = '65px "Sans"';
        ctx.fillText(String(voiceCount), 250, 340);
        ctx.fillText(String(memberCount), 250, 460);
      },
      {
        coalesce: false, // whether the gif should be coalesced first, default: false
        delay: 0, // the delay between each frame in ms, default: 0
        repeat: 0, // how many times the GIF should repeat, default: 0 (runs forever)
        algorithm: "octree", // the algorithm the encoder should use, default: 'neuquant',
        optimiser: true, // whether the encoder should use the in-built optimiser, default: false,
        fps: 20, // the amount of frames to render per second, default: 60
        quality: 100, // the quality of the gif, a value between 1 and 100, default: 100
      }
    );
  }
  async makeBannerImage(data: DJS.Guild) {
    const memberCount = data.memberCount;
    const channels = await data.channels.fetch();
    const voiceCount = channels
      .filter((ch) => ch && ch.type === DJS.ChannelType.GuildVoice)
      .reduce((a, c) => {
        if (!c) return 0;
        if (!c.isVoiceBased()) return 0;
        const memberSize: number = c.members.size;
        return a + memberSize;
      }, 0);

    const width = 750;
    const height = 483;

    const svgImage = `
    <svg width="${width}" height="${height}">
    <style>
      .title { fill: #fff; font-size: 35px; font-weight: bold;}
      </style>
      <text x="19%" y="52%" text-anchor="middle" class="title">${memberCount}</text>
    </svg>
    `;
    const svgImage2 = `
    <svg width="${width}" height="${height}">
    <style>
      .title { fill: #fff; font-size: 40px; font-weight: bold;}
      </style>
      <text x="95%" y="52%" text-anchor="middle" class="title">${voiceCount}</text>
    </svg>
    `;
    const banner = await fetch(
      "https://cdn.discordapp.com/attachments/625125553329930240/1127840774344687686/beige.png"
    ).then((res) => res.arrayBuffer());
    const svgBuffer = Buffer.from(svgImage);
    const svgBuffer2 = Buffer.from(svgImage2);

    const img = await sharp(banner)
      .composite([
        {
          input: svgBuffer,
          top: 0,
          left: 0,
        },
        {
          input: svgBuffer2,
          top: 0,
          left: 130,
        },
      ])
      .png()
      .toBuffer();
    return img;
  }
  async hasEnoughMoneyFor(userId: string, item: { price: number }) {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error("Error fetching user");
      }
      return {
        user,
        result: user.money > item.price,
      };
    } catch (error) {
      console.error(error, "Error");
    }
  }
  async getUserById(userId: string) {
    try {
      const user =
        (await prisma.user.findFirst({
          where: { userId },
        })) ?? (await this.addUser(userId));
      return user;
    } catch (error) {
      console.error(error, "Error");
    }
  }
  async getAllItems() {
    try {
      const items = await prisma.item.findMany();

      return items;
    } catch (error) {
      console.error(error, "Error");
    }
  }
  async getItemsByName(itemNames: string[]) {
    try {
      const items = await prisma.item.findMany();

      return items.filter((item) => itemNames.includes(item.name));
    } catch (error) {
      console.error(error, "Error");
    }
  }
  async getItemByName(name: string) {
    try {
      const item = await prisma.item.findFirst({
        where: { name },
      });
      return item;
    } catch (error) {
      console.error(error, "Error");
    }
  }
  async addUser(userId: string, data?: any) {
    try {
      const user = await prisma.user.create({
        data: {
          userId,
          money: 0,
          ...data,
        },
      });
      return user;
    } catch (error) {
      console.error(error, "Error");
    }
  }
  async updateUserById(
    userId: string,
    data: Partial<Prisma.UserUpdateManyArgs["data"]>
  ) {
    try {
      const user = await this.getUserById(userId);

      if (!user) {
        this.addUser(userId, data);
        return;
      }

      const res = await prisma.user.updateMany({
        where: { userId },
        data,
      });
    } catch (error) {
      this.sendErrorLog(error, "error");
    }
  }
  async sendErrorLog(err: unknown, type: "warning" | "error"): Promise<void> {
    const error = err as DJS.DiscordAPIError | DJS.HTTPError | Error;

    try {
      if (error.message.includes("Missing Access")) return;
      if (error.message.includes("Unknown Message")) return;
      if (
        error.stack?.includes(
          "DeprecationWarning: Listening to events on the Db class"
        )
      ) {
        return;
      }

      const channelId = process.env["ERRORLOGS_CHANNEL_ID"] as
        | DJS.Snowflake
        | undefined;
      if (!channelId) {
        return console.error("ERR_LOG", error.stack || `${error}`);
      }

      const channel = (this.bot.channels.cache.get(channelId) ||
        (await this.bot.channels.fetch(channelId))) as DJS.TextChannel;

      if (
        !channel ||
        !channel
          .permissionsFor(this.bot.user!)
          ?.has(DJS.PermissionFlagsBits.SendMessages)
      ) {
        return console.error("ERR_LOG", error.stack || `${error}`);
      }

      const message = {
        author: this.bot.user,
      };

      const code = "code" in error ? error.code : "N/A";
      const httpStatus = "status" in error ? error.status : "N/A";
      const requestBody =
        "requestBody" in error ? error.requestBody : { json: {} };

      const name = error.name || "N/A";
      let stack = error.stack || error;
      let jsonString: string | undefined = "";

      try {
        jsonString = JSON.stringify(requestBody.json, null, 2);
      } catch {
        jsonString = "";
      }

      if (jsonString.length >= 2048) {
        jsonString = jsonString ? `${jsonString.slice(0, 2045)}...` : "";
      }

      if (typeof stack === "string" && stack.length >= 2048) {
        console.error(stack);
        stack =
          "An error occurred but was too long to send to Discord, check your console.";
      }

      const embed = this.baseEmbed(message)

        .addFields(
          { name: "Name", value: name, inline: true },
          {
            name: "Code",
            value: code.toString(),
            inline: true,
          },
          {
            name: "httpStatus",
            value: httpStatus.toString(),
            inline: true,
          },
          { name: "Timestamp", value: Date.now().toString(), inline: true },
          { name: "Request data", value: codeBlock(jsonString.slice(0, 2045)) }
        )
        .setDescription(codeBlock(stack as string))
        .setColor(type === "error" ? DJS.Colors.Red : DJS.Colors.Orange);

      channel.send({ embeds: [embed] });
    } catch (e) {
      console.error({ error });
      console.error(e);
    }
  }

  async findMember(
    message: Partial<DJS.Message> | DJS.CommandInteraction,
    args: string[],
    options?: { allowAuthor?: boolean; index?: number }
  ): Promise<DJS.GuildMember | undefined | null> {
    if (!message.guild) return;
    const index = options?.index ?? 0;

    try {
      let member: DJS.GuildMember | null | undefined;
      const arg = (args[index]?.replace?.(/[<@!>]/gi, "") ||
        args[index]) as DJS.Snowflake;

      const mention =
        "mentions" in message // check if the first mention is not the bot prefix
          ? message.mentions?.users.first()?.id !== this.bot.user?.id
            ? message.mentions?.users.first()
            : message.mentions?.users.first(1)[1]
          : null;

      member =
        message.guild.members.cache.find((m) => m.user.id === mention?.id) ||
        message.guild.members.cache.get(arg) ||
        message.guild.members.cache.find((m) => m.user.id === args[index]) ||
        (message.guild.members.cache.find(
          (m) => m.user.tag === args[index]
        ) as DJS.GuildMember);

      if (!member && arg) {
        const fetched = await message.guild.members
          .fetch(arg)
          .catch(() => null);

        if (fetched) {
          member = fetched;
        }
      }

      if (!member && options?.allowAuthor) {
        // @ts-expect-error ignore
        member = new DJS.GuildMember(this.bot, message.member!, message.guild);
      }

      return member;
    } catch (e) {
      const error = e instanceof Error ? e : null;

      if (error?.message.includes("DiscordAPIError: Unknown Member"))
        return undefined;
      if (error?.message.includes("is not a snowflake.")) return undefined;

      this.sendErrorLog(e, "error");
    }
  }

  async findRole(
    message: DJS.Message,
    arg: DJS.Snowflake
  ): Promise<DJS.Role | null> {
    if (!message.guild) return null;
    return (
      message.mentions.roles.first() ||
      message.guild.roles.cache.get(arg) ||
      message.guild.roles.cache.find((r) => r.name === arg) ||
      message.guild.roles.cache.find((r) => r.name.startsWith(arg)) ||
      message.guild.roles.fetch(arg)
    );
  }

  async createWebhook(channelId: DJS.Snowflake, oldChannelId: string | null) {
    const channel = this.bot.channels.cache.get(channelId);
    if (!channel) return;
    if (!this.bot.user) return;
    if (
      !(channel as DJS.TextChannel)
        .permissionsFor(this.bot.user.id)
        ?.has(DJS.PermissionFlagsBits.ManageWebhooks)
    ) {
      return;
    }

    if (oldChannelId) {
      const webhooks = await (channel as DJS.TextChannel).fetchWebhooks();
      await webhooks
        .find((w) => w.name === `audit-logs-${oldChannelId}`)
        ?.delete();
    }

    await (channel as DJS.TextChannel).createWebhook({
      name: `audit-logs-${channelId}`,
      avatar: this.bot.user.displayAvatarURL({ extension: "png" }),
    });
  }

  async updateMuteChannelPerms(
    guild: DJS.Guild,
    memberId: DJS.Snowflake,
    perms: Partial<DJS.PermissionOverwriteOptions>
  ) {
    guild.channels.cache.forEach((channel) => {
      if (channel instanceof DJS.ThreadChannel) return;

      channel.permissionOverwrites
        .create(memberId, perms as DJS.PermissionOverwriteOptions)
        .catch((e) => {
          console.error("updateMuteChannelPerms", e);
        });
    });
  }

  //   async handleApiRequest(
  //     path: string,
  //     tokenData: { data: string; type: "Bot" | "Bearer" },
  //     method?: string,
  //   ) {
  //     try {
  //       const bearer =
  //         tokenData.type === "Bearer"
  //           ? jwt.verify(tokenData.data, process.env["DASHBOARD_JWT_SECRET"] ?? "")
  //           : tokenData.data;

  //       if (!bearer) {
  //         return { error: "invalid_token" };
  //       }

  //       const res = await fetch(`${process.env["DASHBOARD_DISCORD_API_URL"]}${path}`, {
  //         method,
  //         headers: {
  //           Authorization: `${tokenData.type} ${bearer}`,
  //         },
  //       });
  //       return await res.json();
  //     } catch (e) {
  //       return { error: "invalid_token" };
  //     }
  //   }

  //   async checkAuth(
  //     req: ApiRequest,
  //     admin?: {
  //       guildId: string;
  //     },
  //   ) {
  //     const token = req.cookies.token || req.headers.auth;
  //     const data: { error: string } | { id: DJS.Snowflake } = await this.handleApiRequest(
  //       "/users/@me",
  //       {
  //         type: "Bearer",
  //         data: `${token}`,
  //       },
  //     );

  //     if ("error" in data) {
  //       return Promise.reject(data.error);
  //     }

  //     if (admin?.guildId) {
  //       const guild = this.bot.guilds.cache.get(admin.guildId as DJS.Snowflake);
  //       if (!guild) return Promise.reject("Guild was not found");

  //       const member = await guild.members.fetch(data.id);
  //       if (!member) return Promise.reject("Not in this guild");

  //       if (!member.permissions.has(DJS.PermissionFlagsBits.Administrator)) {
  //         return Promise.reject("Not an administrator for this guild");
  //       }
  //     }
  //     return Promise.resolve("Authorized");
  //   }

  errorEmbed(
    permissions: bigint[],
    message: DJS.Message | DJS.ChatInputCommandInteraction,
    lang: Record<string, string>
  ) {
    return this.baseEmbed(message)
      .setTitle("Woah!")
      .setDescription(
        `❌ I need ${permissions
          .map((p) => {
            const perms: string[] = [];
            Object.keys(DJS.PermissionFlagsBits).map((key) => {
              //@ts-ignore
              if (DJS.PermissionFlagsBits[key] === p) {
                perms.push(`\`${lang[key]}\``);
              }
            });

            return perms;
          })
          .join(", ")} permissions!`
      )
      .setColor(DJS.Colors.Orange);
  }

  baseEmbed(
    message:
      | DJS.Message
      | DJS.ChatInputCommandInteraction
      | DJS.SelectMenuInteraction
      | { author: DJS.User | null }
  ) {
    const user = "author" in message ? message.author : message.user;

    const avatar = user?.displayAvatarURL();
    const username = user?.username ?? this.bot.user?.username ?? "Unknown";

    return new DJS.EmbedBuilder()
      .setFooter({ text: username, iconURL: avatar })
      .setColor("#5865f2")
      .setTimestamp();
  }

  parseMessage(
    message: string,
    user: DJS.User,
    msg?: DJS.Message | { guild: DJS.Guild; author: DJS.User }
  ): string {
    return message
      .split(" ")
      .map((word) => {
        const { username, tag, id, discriminator } = user;
        const createdAt = time(new Date(user.createdAt), "f");
        word = word
          .replace("{user}", `<@${id}>`)
          .replace("{user.tag}", this.escapeMarkdown(tag))
          .replace("{user.username}", this.escapeMarkdown(username))
          .replace("{user.discriminator}", discriminator)
          .replace("{user.id}", id)
          .replace("{user.createdAt}", createdAt);

        if (msg) {
          if (!msg.guild) return word;

          word
            .replace("{guild.id}", msg.guild.id)
            .replace("{guild.name}", this.escapeMarkdown(msg.guild.name))
            .replace("{message.author}", `<@${msg.author.id}>`)
            .replace("{message.author.id}", msg.author.id)
            .replace(
              "{message.author.tag}",
              this.escapeMarkdown(msg.author.tag)
            )
            .replace(
              "{message.author.username}",
              this.escapeMarkdown(msg.author.username)
            );
        }

        return word;
      })
      .join(" ");
  }

  isBotInSameChannel(message: DJS.Message | DJS.CommandInteraction) {
    // @ts-expect-error ignore
    const member = new DJS.GuildMember(
      this.bot,
      message.member!,
      message.guild!
    );
    const voiceChannelId = member?.voice.channelId;

    if (!voiceChannelId) return false;
    if (!message.guild?.members.me) return false;

    return message.guild.members.me.voice.channelId === voiceChannelId;
  }

  /**
   * @returns `string` = doesn't have the required permissions, `undefined` = has the required permissions
   */
  formatBotPermissions(
    permissions: bigint[],
    interaction: DJS.ChatInputCommandInteraction,
    lang: typeof import("@locales/english").default
  ) {
    const neededPerms: bigint[] = [];

    permissions.forEach((perm) => {
      if (
        !(interaction.channel as DJS.TextChannel)
          .permissionsFor(interaction.guild!.members.me!)
          .has(perm)
      ) {
        neededPerms.push(perm);
      }
    });

    if (neededPerms.length > 0) {
      return this.errorEmbed(neededPerms, interaction, lang.PERMISSIONS);
    }
  }

  formatMemberPermissions(
    permissions: bigint[],
    interaction: DJS.CommandInteraction,
    lang: typeof import("@locales/english").default
  ) {
    const neededPerms: bigint[] = [];

    permissions.forEach((perm) => {
      if (
        !(interaction.channel as DJS.TextChannel)
          .permissionsFor(interaction.member as any)
          .has(perm)
      ) {
        neededPerms.push(perm);
      }
    });

    if (neededPerms.length > 0) {
      return lang.MESSAGE.NEED_PERMS.replace(
        "{perms}",
        neededPerms
          .map((p) => {
            const perms: string[] = [];
            Object.keys(DJS.PermissionFlagsBits).map((key) => {
              //@ts-ignore
              if (DJS.PermissionFlagsBits[key] === p) {
                //@ts-ignore
                perms.push(`\`${lang.PERMISSIONS[key]}\``);
              }
            });

            return perms;
          })
          .join(", ")
      );
    }
  }

  translate<Str extends string, Values extends Record<string, string | number>>(
    string: Str,
    values: Values
  ): string {
    const regex = /\{[a-z0-9_-]\w+\}/gi;
    const keys = string.match(regex) ?? [];

    keys.forEach((key) => {
      const parsedKey = key.replace("{", "").replace("}", "");
      const value = values[parsedKey];
      string = string.replaceAll(key, String(value)) as Str;
    });

    return string;
  }

  hasSendPermissions(resolveable: DJS.Message | DJS.GuildTextBasedChannel) {
    const ch = "channel" in resolveable ? resolveable.channel : resolveable;
    if (!("permissionsFor" in ch)) return false;
    if (ch instanceof DJS.ThreadChannel || ch instanceof DJS.DMChannel) {
      return true;
    }

    return ch
      .permissionsFor(this.bot.user!)
      ?.has(DJS.PermissionFlagsBits.SendMessages);
  }

  escapeMarkdown(message: string): string {
    return DJS.escapeMarkdown(message, {
      codeBlock: true,
      spoiler: true,
      inlineCode: true,
      inlineCodeContent: true,
      codeBlockContent: true,
    });
  }

  codeContent(string: string, extension = ""): string {
    return `\`\`\`${extension}\n${string}\`\`\``;
  }

  calculateXp(xp: number): number {
    return Math.floor(0.1 * Math.sqrt(xp));
  }

  formatNumber(n: number | string): string {
    return Number.parseFloat(String(n)).toLocaleString("be-BE");
  }

  encode(obj: Record<string, unknown>) {
    let string = "";

    for (const [key, value] of Object.entries(obj)) {
      if (!value) continue;
      string += `&${encodeURIComponent(key)}=${encodeURIComponent(`${value}`)}`;
    }

    return string.substring(1);
  }
}
