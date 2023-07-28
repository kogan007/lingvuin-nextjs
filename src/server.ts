import next, { NextApiRequest } from "next";
import { Bot } from "structures/Bot";
import express from "express";
import { Request, Response } from "express";
import { EmbedBuilder } from "discord.js";

const port = process.env.PORT || 3000;

export default function server(bot: Bot) {
  const dev = process.env["DEV_MODE"] === "true";
  const app = next({ dev });
  const handle = app.getRequestHandler();

  app.prepare().then(() => {
    const server = express();
    server.use(express.json());
    server.all("/api/bot/*", (req, res) => {
      (req as unknown as ModifiedRequest).bot = bot;
      //@ts-expect-error
      return handleBotApi(req, res);
    });
    server.all("*", (req, res) => {
      (req as unknown as ApiRequest).bot = bot;
      return handle(req, res);
    });

    server.listen(port, () => {
      console.log(`> Ready on http://localhost:${port}`);
    });
  });
}

interface ModifiedRequest extends Request {
  bot: Bot;
}

export interface ApiRequest extends NextApiRequest {
  bot: Bot;
}

async function handleBotApi(req: ModifiedRequest, res: Response) {
  const { pathname } = new URL(`https://a` + req.url);
  const prefix = "/api/bot/";
  const bot = req.bot;
  const serverCount = bot.utils.formatNumber(bot.guilds.cache.size);
  const channelCount = bot.utils.formatNumber(bot.channels.cache.size);
  const userCount = bot.utils.formatNumber(
    bot.guilds.cache.reduce((a, g) => a + g.memberCount, 0)
  );
  const guild = await bot.guilds.fetch("1042523320752537680");

  switch (pathname) {
    case prefix + "info": {
      return res.status(200).json({ serverCount, channelCount, userCount });
    }
    case prefix + "roles": {
      const rolesCache = guild!.roles.cache;
      const roles: any = [];
      for (let role of rolesCache) {
        roles.push(role[1]);
      }
      return res.status(200).json(roles);
    }
    case prefix + "rolePositions": {
      const { roles } = req.body;
      await guild.roles.setPositions(
        roles.map((el) => ({
          role: el.id,
          position: el.position,
        }))
      );

      return res.status(200).json({ message: "Updated roles" });
    }
    case prefix + "channels": {
      const channelsCache = guild!.channels.cache;
      const channels: any = [];
      for (let channel of channelsCache) {
        channels.push(channel[1]);
      }
      return res.status(200).json(channels);
    }
    case prefix + "editRole": {
      const { id, name, color, createRole, deleteRole } = req.body;
      if (deleteRole) {
        await guild.roles.delete(id);
      } else {
        if (createRole) {
          await guild.roles.create({
            name,
            color,
          });
        } else {
          await guild.roles.edit(id, {
            name,
            color,
          });
        }
      }

      res.status(200).json({ message: "Role updated" });
    }
    case prefix + "postEmbed": {
      const method = req.method.toLowerCase();
      if (method === "post") {
        const body = req.body;
        const channel = await guild.channels.fetch(body.channel)!;
        if (
          channel?.isTextBased &&
          typeof channel.isTextBased === "function" &&
          channel.isTextBased()
        ) {
          const embed = new EmbedBuilder()
            .setTitle(body.title)
            .setDescription(body.description);
          await channel.send({
            content: body.content,
            embeds: [embed],
          });
        }
        return res.status(200).json({});
      }
      return res.status(404).send("Not found");
    }
    default: {
      return res.status(404).send("Not found");
    }
  }
}
