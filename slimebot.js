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

    //get message as array of arguments
    var arguments = tokenize(message);
    

    //Check if slimebot was tagged
	if(getid(arguments[0])==bot.id){
        //default response
        var response = "What?"

        //check first argument for top level command
        if(compare(arguments[1],"help")){
            response=help();
        }
        else if(compare(arguments[1],"hi")){
            response=hi();
        }
        else if(compare(arguments[1],"hey")){
            response=hi();
        }
        else if(compare(arguments[1],"hello")){
            response=hi();
        }
        else if(compare(arguments[1],"howdy")){
            response=hi();
        }
        else if((compare(arguments[1],"fuck")) && (compare(arguments[2],"you"))){
            response=sadcat();
        }
        else if((compare(arguments[1],"i")) && (compare(arguments[2],"love")) && (compare(arguments[3],"you")))
		{
			response="I love you too!";
        }
        else if((compare(arguments[1],"i")) && (compare(arguments[2],"miss")) && (compare(arguments[3],"you")))
        {
            response="I am here, do not worry.";
        }
        else if((compare(arguments[1],"thank")) && (compare(arguments[2],"you"))){
            response="You're welcome!";
        }
        else if(compare(arguments[1],"roll")){
            response = dice(user,arguments);
        }

        //send response
        bot.sendMessage({
            to: channelID,
            message: response
		});
    }

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

//divides message into array based on spaces, unless its in quotes
//example: data='Hello world, "how are you"' returns ["hello","world,","how are you"]
function tokenize(data){
	return data.match(/[^\s"]+|"([^"]*)"/g);
}

//returns the numerical id of a tag, with or without the preceading <@!>
function getid(id){
	return id.replace(/[<@!>]/g, '');
}

//removes everything besides alphanumeric text then compares to the key
function compare(data,key){
	return data!=null && data.replace(/[^A-Za-z0-9\s]/g,"").toUpperCase()==(key.toUpperCase());
}

//=================================================
//THE FOLLOWING FUNCTIONS ARE FOR SLIMEBOT COMMANDS
//=================================================

//Multiple Line Response Functions
function help(){
	var str="Slimebot X: Help Interface";
	str+="\nhelp: displays this message";
	str+="\nroll <number>: rolls a dice. default is d20";
	return str;
}

//returns a random sad cat
function sadcat(){
    var x = Math.floor((Math.random() * 24) + 1);
	number = x % 6;
    if(number==0){return "<:sadcat:232666680113758219>"}
    else if(number==1){return "<:sadcat2:232685351766982666>"}
    else if(number==2){return "<:sadcat3:235935648748535808>"}
    else if(number==3){return "<:sadcat4:238477095095762944>"}
    else if(number==4){return "<:sadcat5:317825362933317642>"}
    else{return "<:sadcat6:317823721215754250>"}
}

//say hi back
function hi(){
    var x = Math.floor((Math.random() * 20) + 1);
    if(x<=5){return "Hello!"}
    else if(x<=10){return "Hey!"}
    else if(x<=15){return "Hi!"}
    else{return "Howdy!"}
}

//roll a dice
function dice(u,args){
    //empty dice by default
    var dice=0;
            
    //if no number given for size, default to 20
    if(isNaN(args[2]) || args[2]==''){
        dice=20;
    }else{
        dice=args[2];
    }
    
    //response is a random number between 1 and the dice size
    return u+" rolled a "+ Math.floor((Math.random() * dice) + 1);
}
