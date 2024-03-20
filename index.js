const { Client, MessageEmbed, MessageActionRow, MessageButton, TextInputComponent, Modal, MessageAttachment, Intents } = require('discord.js');
const client = new Client({
  intents: [32767, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  partials: ["MESSAGE", "CHANNEL", "REACTION", 'USER'],
});
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const path = require('path')
const fs = require('fs')
const { prefix } = require("./Configs/config.json");

const { request } = require('undici');

const { keep } = require('./keep');

client.on('ready', () => {
  client.user.setActivity("/help")
  console.log(`Logged in as ${client.user.tag}...`);
}).login(process.env.token).catch(err => console.error(err));













/*
////CMD LAUNCHER
if (interaction.commandName === "") {


await interaction.reply({ content: `Working` });

*/









client.on("ready", () => {
  const commands = [{
    name: "ping",
    description: "Bot responde time"
  },{
    name: "setup", 
    description: "setting up the ticket system", 
  },{
    name: 'buy',
    description: 'Choose Crypto to buy',
    options: [{
        name: 'item',
        description: 'Select option',
        type: 3,
        required: true,
        choices: [
            { name: 'Storm', value: 'storm' }/*,
            { name: 'Music', value: 'music' }*/
        ]
    },
    {
        name: 'amount',
        description: 'How much you will buy',
        type: 4,
        required: true
    }]
  },{
    name: 'wallet',
    description: 'Open your crypto`s wallet',
    options: [{
        name: 'crypto',
        description: 'Select an crypto',
        type: 3,
        required: true,
        choices: [
            { name: 'Storm', value: 'storm' }/*,
            { name: 'Music', value: 'music' }*/
        ]
    }]
  },{
    name: 'sell',
    description: 'Choose Crypto to sell',
    options: [{
        name: 'item',
        description: 'Select the item to sell',
        type: 3,
        required: true,
        choices: [
            { name: 'Storm', value: 'storm' }/*,
            { name: 'Music', value: 'music' }*/
        ]
    },
    {
        name: 'amount',
        description: 'How much you will sell',
        type: 4,
        required: true
    }]
  },{
    name: "profile",
    description: "Show ur profile or other user's profile",
    options: [{
      name: "mention",
      description: "Mention specific user",
      type: 6
    }]
  }]
  const rest = new REST({ version: '9' }).setToken(process.env.token);

  (async () => {
    try {
      await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: commands },
      );

      console.log('SlashCommand Working...');
    } catch (error) {
      console.error(error);
    }
  })();
})



client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
////PING
  if (interaction.commandName === "ping") {


    await interaction.reply({ content: `Ping: ${client.ws.ping}` });
  }
////SETUP
  // Inside your command handler
  if (interaction.commandName === "setup") {
    if (interaction.guildId !== '1202579489708711958') {
      return interaction.reply({ content: "This command can only be used in the support server.", ephemeral: true });
    }
    if (!interaction.member.permissions.has("ADMINISTRATOR")) {
      return interaction.reply({ content: "Only administrators can use this command.", ephemeral: true });
    }
    const embed = new MessageEmbed()
      .setColor("5865F2")
      .setDescription(`**To create a ticket, click the button below this embed**`)
      .setTitle("**Ticket System**");

    const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('ticket_open')
            .setLabel('Open Ticket')
            .setEmoji('🎫')
            .setStyle('PRIMARY'),
        );

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }

  // Handle button interactions
  client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'ticket_open') {
      const categoryId = '1219768184849170492';
      const supportRoleId = '1216872700975255632'
      
      // Create the channel
      try {
        const channel = await interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
            type: 'GUILD_TEXT',
            parent: categoryId,
            permissionOverwrites: [
              {
                id: interaction.user.id,
                allow: ['VIEW_CHANNEL'],
              },
              {
                id: supportRoleId,
                allow: ['VIEW_CHANNEL'],
              },
              {
                id: interaction.guild.roles.everyone,
                deny: ['VIEW_CHANNEL'],
              },
            ],
          });
        interaction.reply({ content: `**Ticket channel has been created: **${channel}`, ephemeral: true })
        const embed = new MessageEmbed()
      .setColor("5865F2")
      .setDescription(`**Welcome to your channel. Support will be with you as soon as possible**`)
      .setTitle("**Ticket System**");

    const row1 = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('ticket_channel')
            .setLabel('Close Ticket')
            .setEmoji('🔒')
            .setStyle('DANGER'),
        );

        const row2 = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('ticket_claim')
            .setLabel('Claim Ticket')
            .setEmoji('📩')
            .setStyle('SUCCESS'),
        );

        await channel.send({content: `**<@${interaction.user.id}>, <@&1216872700975255632>**`, embeds: [embed], components: [row1, row2]})
        
      } catch (error) {
        console.error('Error creating channel:', error);
    } 
      
       }
});
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

if (interaction.customId === 'ticket_channel') {
    if (!interaction.member.roles.cache.some(role => role.id === '1216872700975255632')) {
      return interaction.reply({ content: "Only <@&1216872700975255632> can use this action", ephemeral: true });
    } else {
const channel = interaction.channel;
const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('ticket_delete')
            .setLabel('Close')
            .setEmoji('🔒')
            .setStyle('DANGER'),
        );

        await channel.send({content: `**Are you sure you want to do this?**`, components: [row], ephemeral: true })
  
      } 
}
});

  client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

  if (interaction.customId === 'ticket_delete') {

    if (!interaction.member.roles.cache.some(role => role.id === '1216872700975255632')) {
      return interaction.reply({ content: "Only <@&1216872700975255632> can use this action", ephemeral: true });
 } else {
      const channel = interaction.channel 
      await channel.delete();
 }
    
  }
  });

  client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

  if (interaction.customId === 'ticket_claim') {
const supportRoleId = '1216872700975255632'
    if (!interaction.member.roles.cache.some(role => role.id === '1216872700975255632')) {
      return interaction.reply({ content: "Only <@&1216872700975255632> can use this action", ephemeral: true });
 } else {

      await interaction.channel.setName(`claimed-${interaction.user.username}`);

      await interaction.channel.permissionOverwrites.edit(supportRoleId, { VIEW_CHANNEL: false });

    await interaction.channel.permissionOverwrites.edit(interaction.user.id, { VIEW_CHANNEL: true });
 
    if (interaction.channel.name. startsWith(`claimed-`)) {
      interaction.reply({ content: 'You`ve already claimed this ticket! ', ephemeral: true });
    
    
      
    } else {
      interaction.reply({ content: 'You have claimed this ticket.', ephemeral: true });
    }
    

      
      
 }
    
  }
  });

////WALLET
  if (interaction.commandName === "wallet") {

    const crypto = interaction. options.getString('crypto');

    if (crypto === 'storm'/* || item === 'music'*/) {
      
    //Gets user amount of specific crypto's from db
            
      await interaction.reply(`**\n
      > <@${interaction.user.id}>'s wallet: \n
      > Type: ${crypto}\n
      
      > Amount: \n
            **`);
      //Get the amount he has from db 
    }
   } 
////BUY
if (interaction.commandName === 'buy') {
        const item = interaction. options.getString('item');
        const amount = interaction. options.getInteger('amount');

        if (item === 'storm'/* || item === 'music'*/) {
    //Gets user data + item and  add it to db
      // item = coinName(Storm)
     // amount = amount of coins has buyed
            await interaction.reply(`**\n
      > Successfull Buying\n
      > Type: ${item}\n
      > Amount: ${amount}\n
            **`);
         } 
        }
  
////SELL
  if (interaction.commandName === 'sell') {
  const item = interaction. options.getString('item');
  const amount = interaction. options.getInteger('amount');

  // Handle the selected item
  if (item === 'storm'/* || item === 'music'*/) {
    //Gets user data + item and  add it to db
      // item = coinName(Storm)
     // amount = amount of coins has selled
      await interaction.reply(`**\n
      > Successfull Sell\n
      > Type: ${item}\n
      > Amount: ${amount}\n
        **`);
       } 
  }

////Profile
  const Canvas = require('@napi-rs/canvas');
  const { readFile } = require('fs/promises');
     if (interaction.commandName === "profile") {
      await interaction.deferReply();
      const userp = interaction.options.getMember("mention") || interaction.member
      if (interaction.user.bot) return;
      const guildp = userp.guild.iconURL()
      console.log(guildp)

      const canvas = Canvas.createCanvas(700, 700);
      const context = canvas.getContext('2d');
      context.strokeStyle = '#fffff';
      const { body } = await request(userp.displayAvatarURL({ format: "jpg" }))
  /*
      const { body } = await request(userp.guild.iconURL({ format: "jpg"}))
  */
      const backgroundFile = await readFile('./profile1.png');

  const background = new Canvas.Image();
      background.src = backgroundFile;
   context.drawImage(background, 0, 0, canvas.width, canvas.height);
      context.fillStyle = '#ffffff';
    
       context.font = 'bold 40px Tahoma';

      context.fillText(userp.displayName, 50 + 250, 55 + 120)
       
       const avatar = new Canvas.Image();

       avatar.src = Buffer.from(await body.arrayBuffer());

       context.beginPath();

       context.arc(145, 150, 100, 0, Math.PI * 2, true);

       context.strokeStyle = "#ffffff";
       context.lineWidth = 5;
       context.stroke();
       context.fillStyle = "#fffff";
       context.fill();

       context.beginPath();
       context.arc(145, 150, 100, 0, Math.PI * 2, true);
       context.stroke();
       context.closePath();
       context.clip(); 
       context.drawImage(avatar, 40, 40, 220, 220);
      const attachment = new MessageAttachment(canvas.toBuffer('image/png'), 'profile-image.png');
      await interaction.editReply({ files: [attachment] });
     }
})
