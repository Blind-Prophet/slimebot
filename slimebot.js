//Slimebot

//Requires
var Discord = require('discord.io');
var fs = require('fs');
var os = require('os');

//get bot token from file
var tk = fs.readFileSync('token.secret').toString().trim();

//Create Slimebot
var bot = new Discord.Client({
	token: tk,
	autorun: true
});

//Ready Slimebot
bot.on('ready', function(){
	console.log('Logged in as %s - %s\n', bot.username, bot.id);
});

//Message Received
bot.on('message', function(user, userID, channelID, message, event){

    //Don't do anything if the message is coming from slimebot himself
    if(userID==bot.id) return;

    

    //Lastly, repond to any keywords
    check_keywords(message,user,channelID);
});

//Check keywords
function check_keywords(msg,user,cid){
    var data = JSON.parse(fs.readFileSync('keywords.json').toString());

    //hardcoded text to speech check
    var tts=false
    if ((msg.toUpperCase().startsWith("CAN I GET A"))) {
        var newMsg = msg.substr(11);
        tts=true;
        bot.sendMessage({
            to: cid,
            message: newMsg,
            tts: true
        });
    }

    //check each key
    data.forEach(d => {
        //by default
        var contains = true; 

        //check each keyword for the same response
        d.keys.forEach(k =>{
            //if it doesnt contain every keyword, it'll be set to false
            if(!m_cont(msg,k)) contains=false;
        })

        if(d.starts){
            contains = ((message.toUpperCase().startsWith(d.starts.toUpperCase())));
        }

        //if its still true, send out the response
        if(contains){
            
            //if there is a message, send it
            if(d.msg){
                bot.sendMessage({
                    to: cid,
                    message: u_replace(d.msg,user),
                    tts: tts
                 });
            }

            //if there is a file, upload it
            if(d.file){
                bot.uploadFile({
                    to: cid,
                    file: d.file
                });
            }
        }
    });
}

//Custom contains method
function m_cont(message,keyword){
	return message.toUpperCase().includes(keyword.toUpperCase());
}

//Replace [user] with the given user
function u_replace(message,user){
    return message.replace("[user]",user);
}