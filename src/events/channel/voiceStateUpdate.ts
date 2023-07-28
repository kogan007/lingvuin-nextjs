import * as DJS from "discord.js";
import { Bot } from "structures/Bot";
import { Event } from "structures/Event";

const users = new Map();

export default class VoiceStateUpdateEvent extends Event {
  constructor(bot: Bot) {
    super(bot, "voiceStateUpdate");
  }

  async execute(bot: Bot, oldState: DJS.VoiceState, newState: DJS.VoiceState) {
    const member = oldState.member || newState.member;
    if (!member) return;
    if (!newState.channel && oldState.channel) {
      // User left the voice channel
      const joinedTimestamp = users.get(member.user.id); // Get the saved timestamp of when the user joined the voice channel
      if (!joinedTimestamp) return; // In case the bot restarted and the user left the voice channel after the restart (the Map will reset after a restart)
      const totalTime = new Date().getTime() - joinedTimestamp; // The total time the user has been i the voice channel in ms

      const seconds = totalTime / 1000;
      const minutes = seconds / 60;

      if (minutes > 1) {
        const totalCoinsToGive = 5 * minutes;
        const user = await bot.utils.getUserById(member.user.id);
        const balance = user!.money ?? 0;
        await bot.utils.updateUserById(member.user.id, {
          money: balance + Math.round(totalCoinsToGive),
        });
      }
      users.delete(member.user.id);
    } else if (!oldState.channel && newState.channel) {
      // User joined the voice channel
      users.set(member.user.id, new Date().getTime()); // Save the timestamp of when the user joined the voice channel
    }
  }
}
