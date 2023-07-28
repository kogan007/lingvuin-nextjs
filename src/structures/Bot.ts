import * as DJS from "discord.js";

import { EventHandler } from "handlers/EventHandler";
import { SubCommand } from "./Command/SubCommand";
import { Command } from "./Command/Command";
import { discordConfig } from "../config/discord-config";
import { Util } from "utils/Util";

export class Bot extends DJS.Client {
  interactions: DJS.Collection<string, SubCommand | Command> =
    new DJS.Collection();

  utils: Util;
  constructor() {
    super(discordConfig);
    this.utils = new Util(this);
    new EventHandler(this).loadEvents();
  }
}
