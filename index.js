const Discord = require("discord.js");
const bot = new Discord.Client();
const config = require("./config.json");
const prefix = config.prefix;
const token = config.token;
const fs = require("fs");
const bdd = require("./bdd.json");


bot.on("ready", async () => {
    
    let statuts = bdd.stats
    setInterval(function() {
        let stats = statuts[Math.floor(Math.random()*statuts.length)];
        bot.user.setActivity(stats, {type: "STREAMING"})
    }, 2000)
    console.log("le bot es opérationnel") 
})



bot.on("guildMemberAdd", member => {
    bot.channels.cache.get("866672309484781598").send(`${member.user.username} a rejoint le serveur`)
})


bot.on("guildMemberRemove", member => {
    bot.channels.cache.get("866672309484781598").send(`${member.user.username} a quitté le serveur`)
})




bot.on("message", message => {
    if(message.content.startsWith(`!clear`)){
          message.delete();
        if(message.member.hasPermission("MANAGE_MESSAGES")){

            let args = message.content.trim().split(/ +/g);


            if(args[1]){
                if(!isNaN(args[1]) && args[1] >= 1 && args[1] <= 99){


                    message.channel.bulkDelete(args[1]);
                    message.channel.send(`✅ vous avez supprimé ${args[1]} message(s) ✅`)

                }
                else {
                    message.channel.send("vous devez indiquer un nombres en 1 et 99 !")
                }
            }
            else {
                message.channel.send("vous devez entrer un nombre de messages à supprimé !")
            }
            
        }
        else {
            message.channel.send("❌ vous n'avais pas la permission d'éxecuter cette commande ❌")
        }
    }
    if(message.content.startsWith(`!prefix`)){
        if(message.member.hasPermission("ADMINISTRATOR")){
            if(message.content.length > 6){
                prefix1 = message.content.slice(7)
                bdd["prefix"] = prefix1
                Savebdd();
            }
        }
    }
    if(message.content.startsWith("test")){
        message.channel.send(`le prefix : ${prefix}`);
    }
    if(message.content.startsWith("?help")){
        message.delete();
        const help = new Discord.MessageEmbed()
        
	    .setColor('#04009A')
	    .setTitle('les commandes')
	    .setURL('https://discord.js.org/')
	    .setAuthor(`${message.member} a utilisé ?help`, 'https://yt3.ggpht.com/VQQeU0zcqaadZWYjl5iR5yZJKYMmP_vsfjcJWz7dTI_HD0LWq0994m9XYGy3aEMsp1D2jtGMlX0=s88-c-k-c0x00ffffff-no-rj-mo', 'https://discord.js.org')
	    .setDescription('Cette commande est utilisable partout et par n\'importe qui !')
	    .setThumbnail('https://yt3.ggpht.com/VQQeU0zcqaadZWYjl5iR5yZJKYMmP_vsfjcJWz7dTI_HD0LWq0994m9XYGy3aEMsp1D2jtGMlX0=s88-c-k-c0x00ffffff-no-rj-mo')
	    .addFields(
		    { name: 'Le prefix', value: '?' },
		    { name: '\u200B', value: '\u200B' },
		    { name: 'Admin', value: 'ban kick warn clear ...', inline: true },
		    { name: 'Membre', value: 'help , report , ...', inline: true },
	    )
	    .addField('Inline field title', 'Some value here', true)
	    .setImage('https://yt3.ggpht.com/VQQeU0zcqaadZWYjl5iR5yZJKYMmP_vsfjcJWz7dTI_HD0LWq0994m9XYGy3aEMsp1D2jtGMlX0=s88-c-k-c0x00ffffff-no-rj-mo')
	    .setTimestamp(12 / 7 / 1988)
	    .setFooter('over genie ©️ 2021', 'https://yt3.ggpht.com/VQQeU0zcqaadZWYjl5iR5yZJKYMmP_vsfjcJWz7dTI_HD0LWq0994m9XYGy3aEMsp1D2jtGMlX0=s88-c-k-c0x00ffffff-no-rj-mo');

        message.member.send(help)

    }
})





function Savebdd() {
    fs.writeFile("./config.json", JSON.stringify(bdd, null, 4), (err) => {
        if(err) message.channel.send("Une erreur est survenue.");
    });
}




bot.commands = new Discord.Collection();
// bot.aliases = new Discord.Collection();
fs.readdir("./commands/", (err, files) => {

    if (err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js");

    if (jsfile.length <= 0) {
        return console.log("Impossible de trouver des commandes");
    }

    jsfile.forEach((f, i) => {
        let pull = require(`./commands/${f}`);

        bot.commands.set(pull.config.name, pull);

        // pull.config.aliases.forEach(alias => {

        //     bot.aliases.set(alias, pull.config.name)

        // });
    });
});
bot.on("message", async message => {

    if (message.author.bot || message.channel.type === "dm") return;
    
    let prefix = config.prefix;
    let messagearray = message.content.split(" ")
    let cmd = messagearray[0];
    let args = message.content.trim().split(/ +/g);

    if (!message.content.startsWith(prefix)) return;
    let commandfile = bot.commands.get(cmd.slice(prefix.length))
    if (commandfile) commandfile.run(bot, message, args, Savebdd);
});

bot.login(token);