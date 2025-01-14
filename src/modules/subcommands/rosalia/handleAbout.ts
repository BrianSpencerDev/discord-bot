/* eslint-disable jsdoc/require-param */
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

import CharacterModel from "../../../database/models/CharacterModel";
import { CommandHandler } from "../../../interfaces/CommandHandler";
import { errorEmbedGenerator } from "../../../utils/errorEmbedGenerator";
import { getCounts } from "../../../utils/getCounts";
import { rosaErrorHandler } from "../../../utils/rosaErrorHandler";

/**
 * Returns information about the bot.
 */
export const handleAbout: CommandHandler = async (Rosa, interaction) => {
  try {
    const { guilds, members, commands } = getCounts(Rosa);
    const characterCount = await CharacterModel.countDocuments();
    const aboutEmbed = new MessageEmbed();
    aboutEmbed.setTitle("Rosalia Nightsong");
    aboutEmbed.setAuthor(
      interaction.user.tag,
      interaction.user.displayAvatarURL()
    );
    aboutEmbed.setDescription(
      "I am a Discord bot that offers a fun and relaxing RPG game you can play in your servers! I was created by [nhcarrigan](https://www.nhcarrigan.com). You can view my [source code](https://github.com/RosaliaNightsong/discord-bot) or join my [official chat server](https://chat.nhcarrigan.com)!"
    );
    aboutEmbed.addField("Creation date", "Sunday, 31 May 2020", true);
    aboutEmbed.addField("Guilds", guilds.toString(), true);
    aboutEmbed.addField("Members", members.toString(), true);
    aboutEmbed.addField("Available Commands", commands.toString(), true);
    aboutEmbed.addField(
      "Registered Adventurers",
      characterCount.toLocaleString(),
      true
    );
    aboutEmbed.addField("Favourite Colour", "Green", true);
    aboutEmbed.setFooter(
      "Having fun? Donate: https://donate.nhcarrigan.com",
      "https://cdn.nhcarrigan.com/profile-transparent.png"
    );

    const supportServerButton = new MessageButton()
      .setLabel("Join the Support Server")
      .setStyle("LINK")
      .setURL("https://chat.nhcarrigan.com");
    const inviteButton = new MessageButton()
      .setLabel("Add Rosalia to your server!")
      .setStyle("LINK")
      .setURL("https://invite.rosalianightsong.com");
    const codeButton = new MessageButton()
      .setLabel("View Rosalia's Source Code")
      .setStyle("LINK")
      .setURL("https://github.com/rosalianightsong/discord-bot");

    const row = new MessageActionRow().addComponents([
      supportServerButton,
      inviteButton,
      codeButton,
    ]);

    await interaction.editReply({ embeds: [aboutEmbed], components: [row] });
  } catch (err) {
    const errorId = await rosaErrorHandler(
      Rosa,
      "about command",
      err,
      interaction.guild?.name
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Rosa, "about", errorId)],
    });
  }
};
