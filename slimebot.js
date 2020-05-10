//Slimebot

//Requires
var Discord = require('discord.io');
var fs = require('fs');
var os = require('os');
var schedule = require('node-schedule');

//get bot token from file
var tk = fs.readFileSync('token.secret').toString().trim();

//Create Slimebot
var bot = new Discord.Client({
	token: tk,
	autorun: true
});

bot.on('disconnect', function(erMsg, code) {
    console.log('----- Bot disconnected from Discord with code', code, 'for reason:', erMsg, '-----');
    bot.connect();
});

//Ready Slimebot
bot.on('ready', function(){
	console.log('Logged in as %s - %s\n', bot.username, bot.id);
});

bdaySetup();

//Message Received
bot.on('message', function(user, userID, channelID, message, event){
    
//   if(message=="iomaguire123"){
//        bot.sendMessage({
//            to:"309471997585391618",
//            message:"Mention Test 1.2 <@223924377639583744> <@211986939455209472> <@214396662783672323>"
//        });
//   }
    
    //Don't do anything if the message is coming from slimebot himself
    if(userID==bot.id) return;

    //get message as array of arguments
    var arguments = tokenize(message);


    //no empty messages
    if(arguments.length == 0) return;
    

    //Check if slimebot was tagged
	if(getid(arguments[0])==bot.id){
        var response = ""

        //check first argument for top level command
        if(compare(arguments[1],"help"))
        {
            response=help();
        }
        else if((compare(arguments[1],"hi"))||(compare(arguments[1],"hey"))||(compare(arguments[1],"hello"))||(compare(arguments[1],"howdy")))
        {
            response=hi();
        }
        else if((compare(arguments[1],"fuck")) && (compare(arguments[2],"you")))
        {
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
        else if((compare(arguments[1],"thank")) && (compare(arguments[2],"you")))
        {
            response="You're welcome!";
        }
        else if(compare(arguments[1],"roll"))
        {
            response = dice(user,arguments);
        }else if(compare(arguments[1],"delete")){
            var mid = event.d.id;
            bot.deleteMessage({
                channelID: channelID,
                messageID: mid
            });
            return;
        }
        else if((compare(arguments[1],"attributes"))||(compare(arguments[1],"attr")))
        {
            //Import character data
            var rpd = JSON.parse(fs.readFileSync('data/roleplay.json').toString());

            //check the second level command
            if(compare(arguments[2],"create"))
            {
                //Create subcommand needs 10 arguments
                if(arguments.length == 10)
                {
                    //STRENGTH
                    var strength = 0;
                    if(isNaN(arguments[3]))
                    {
                        response="Attribute STRENGTH was not a number.";
                    }
                    else
                    {
                        strength = parseInt(arguments[3]);
                        if(strength<1 || strength>30){
                            response="Attribute STRENGTH must be between 1 and 30.";
                        }
                    }

                    //PERCEPTION
                    var perception = 0;
                    if(isNaN(arguments[4]))
                    {
                        response="Attribute PERCEPTION/WISDOM was not a number.";
                    }
                    else
                    {
                        perception = parseInt(arguments[4]);
                        if(perception<1 || perception>30){
                            response="Attribute PERCEPTION/WISDOM must be between 1 and 30.";
                        }
                    }

                    //ENDURANCE
                    var endurance = 0;
                    if(isNaN(arguments[5]))
                    {
                        response="Attribute ENDURANCE/CONSTITUTION was not a number.";
                    }
                    else
                    {
                        endurance = parseInt(arguments[5]);
                        if(endurance<1 || endurance>30){
                            response="Attribute ENDURANCE/CONSTITUTION must be between 1 and 30.";
                        }
                    }

                    //CHARISMA
                    var charisma = 0;
                    if(isNaN(arguments[6]))
                    {
                        response="Attribute CHARISMA was not a number.";
                    }
                    else
                    {
                        charisma = parseInt(arguments[6]);
                        if(charisma<1 || charisma>30){
                            response="Attribute CHARISMA must be between 1 and 30.";
                        }
                    }

                    //INTELLIGENCE
                    var intelligence = 0;
                    if(isNaN(arguments[7]))
                    {
                        response="Attribute INTELLIGENCE was not a number.";
                    }
                    else
                    {
                        intelligence = parseInt(arguments[7]);
                        if(intelligence<1 || intelligence>30){
                            response="Attribute INTELLIGENCE must be between 1 and 30.";
                        }
                    }

                    //AGILITY
                    var agility = 0;
                    if(isNaN(arguments[8]))
                    {
                        response="Attribute AGILITY/DEXTERITY was not a number.";
                    }
                    else
                    {
                        agility = parseInt(arguments[8]);
                        if(agility<1 || agility>30){
                            response="Attribute AGILITY/DEXTERITY must be between 1 and 30.";
                        }
                    }

                    //MAGIC
                    var magic = 0;
                    if(isNaN(arguments[9]))
                    {
                        response="Attribute MAGIC was not a number.";
                    }
                    else
                    {
                        magic = parseInt(arguments[9]);
                        if(magic<1 || magic>30){
                            response="Attribute MAGIC must be between 1 and 30.";
                        }
                    }

                    if(response==""){
                        //no errors so far

                        if(strength+perception+endurance+charisma+intelligence+agility+magic != 74)
                        {
                            response="All attributes must add up to 74.";
                        }
                        else
                        {
                            var attr = new Object;
                            attr.str = strength;
                            attr.per = perception;
                            attr.end = endurance;
                            attr.cha = charisma;
                            attr.int = intelligence;
                            attr.agi = agility;
                            attr.mag = magic;
                            if(rpd[userID]==null){ rpd[userID] = new Object; }
                            rpd[userID].attributes = attr;
                            response = "Attributes successfully created.";
                        }
                    }
                }
                else
                {
                    response = "Use 'attributes create [str] [wis/per] [end/con] [cha] [int] [dex/agl] [mag]' to create your attributes. Each attribute may have no more than 30 points and no less than 1 point. Your total attributes must add up to 74."
                }
            }
            else if(compare(arguments[2],"list"))
            {
                //default id is user who sent message
                var id = userID;
                //if message contains user to check attr of
                if(arguments[3]!=null && arguments[3]!='')
                {
                    id = getid(arguments[3]);
                }
                //check if the user has an entry in the file
                if(rpd[id]!=null)
                {
                    //check if user has attributes
                    if(rpd[id].attributes!=null){
                        response="Strength: "+rpd[id].attributes.str;
						response += "\nWisdom/Perception: "+rpd[id].attributes.per;
					    response += "\nEndurance/Constitution: "+rpd[id].attributes.end;
					    response += "\nCharisma: "+rpd[id].attributes.cha;
					    response += "\nIntelligence: "+rpd[id].attributes.int;
					    response += "\nDexterity/Agility: "+rpd[id].attributes.agi;
					    response += "\nMagic: "+rpd[id].attributes.mag;
                    }else{
                        response="No attributes found for given user. Sorry :(";
                    }
                }
                else
                {
                    response="No data found for given user. Sorry :(";
                }
            }
            else
            {
                response = "There are 7 attributes: Strength, Wisdom/Perception, Endurance/Constitution, Charisma, Intelligence, Dexterity/Agility, and Magic.";
                response += "\nUse 'attributes create' to set up your own attributes.";
                response += "\nUse 'attributes list <user>' to see your current attributes.";
                response += "\nUse 'check [attr] <number>' to run an skill check based on your own attributes.";
            }

            fs.writeFileSync('data/roleplay.json',JSON.stringify(rpd));
        }//214396662783672323
        else if(compare(arguments[1],"check"))
        {
            var rpd = JSON.parse(fs.readFileSync('data/roleplay.json').toString());

            if(arguments.length > 2){
				if(rpd[userID]!=null){
					if(rpd[userID].attributes!=null){
						var level=0;
						var modifier=0;
						if(arguments[2].toUpperCase()=="STRENGTH" || arguments[2].toUpperCase()=="STR" ){
							level = rpd[userID].attributes.str;
						}else if(arguments[2].toUpperCase()=="WISDOM" || arguments[2].toUpperCase()=="PERCEPTION" || arguments[2].toUpperCase()=="WIS" || arguments[2].toUpperCase()=="PER"){
							level =  rpd[userID].attributes.per;
						}else if(arguments[2].toUpperCase()=="ENDURANCE" || arguments[2].toUpperCase()=="CONSTITUTION" || arguments[2].toUpperCase()=="END" || arguments[2].toUpperCase()=="CON"){
							level =  rpd[userID].attributes.end;
						}else if(arguments[2].toUpperCase()=="CHARISMA" || arguments[2].toUpperCase()=="CHA"){
							level =  rpd[userID].attributes.cha;
						}else if(arguments[2].toUpperCase()=="INTELLIGENCE" || arguments[2].toUpperCase()=="INT"){
							level =  rpd[userID].attributes.int;
						}else if(arguments[2].toUpperCase()=="AGILITY" || arguments[2].toUpperCase()=="DEXTERITY" || arguments[2].toUpperCase()=="AGI" || arguments[2].toUpperCase()=="DEX"){
							level =  rpd[userID].attributes.agi;
						}else if(arguments[2].toUpperCase()=="MAGIC" || arguments[2].toUpperCase()=="MAG"){
							level =  rpd[userID].attributes.mag;
						}else{
							response = "Unkown attribute '"+arguments[2]+"' sorry :(";
						}

						if(response==""){
							modifier = (Math.floor(parseInt(level)/2)) - 5;
							var roll = Math.floor((Math.random() * 20) + 1);
							var total = roll + modifier;
							response = user+" rolled a "+roll;
							response += "\nTheir "+arguments[2]+" modifier is ("+modifier+")";
							response += "\nFor a total of "+total;
							if(arguments.length>3 && !isNaN(arguments[3])){
								if(total>=parseInt(arguments[3])){
									response+= '\n'+user +" passed the "+arguments[2]+" "+arguments[3]+" check.";
								}else{
									response+= '\n'+user +" failed the "+arguments[2]+" "+arguments[3]+" check.";
								}
							}
						}
					}else{
						response="I could not find your attributes. Sorry :(";
					}
				}else{
					response="I could not find your user data. Sorry :(";
				}
			}else{
				response = "Use 'check [attribute] <number>' to roll a d20 with modifiers."
			}
        }
        else if((compare(arguments[1],"inventory"))||(compare(arguments[1],"inv")))
        {
            //Import character data
            var rpd = JSON.parse(fs.readFileSync('data/roleplay.json').toString());

            //check the second level command
            if(compare(arguments[2],"list"))
            {
                 //default id is user who sent message
                 var id = userID;
                 //if message contains user to check attr of
                 if(arguments[3]!=null && arguments[3]!='')
                 {
                     id = getid(arguments[3]);
                 }

                 let inv = [];
                 //check if the user has an entry in the file
                 if(rpd[id]!=null)
                 {
                     if(rpd[id].inventory!=null){
                         inv = rpd[id].inventory;
                     }
                     else{
                         rpd[id].inventory = [];
                     }
                 }
                 else
                 {
                     let temp = {}
                     temp.inventory = [];
                     rpd[id] = temp;
                 }

                 response = "Current Inventory ["+inv.length+"/10]";
                 for(var i=0;i<inv.length;i++){
                     response+="\n["+i+"] "+inv[i];
                 }
            }
            else if(compare(arguments[2],"add"))
            {
                if(arguments[3]!=null && arguments[3]!='')
                {
                    let item = arguments[3].replace(/^"|"$/g, '');
                    if(isInt(item)){
                        response = "The [item] cannot be an integer value. Sorry :("
                    }
                    else if(item.length > 100)
                    {
                        response ="The [item] cannot be longer than 100 characters. Sorry :("
                    }else if(item.replace(/\s/g,'') == ""){
                        response = "The [item] cannot only be blank characters. Sorry :("
                    }
                    else{
                        //only user can add items
                        var id = userID;
                        //check if the user has an entry in the file
                        let inv = [];
                        if(rpd[id]!=null)
                        {
                            if(rpd[id].inventory!=null){
                                inv = rpd[id].inventory;
                            }
                            else
                            {
                                rpd[id].inventory = [];
                            }
                        }
                        else
                        {
                            let temp = {}
                            temp.inventory = [];
                            rpd[id] = temp;
                        }

                        if(inv.length>=10){
                            response = "You're inventory is full.";
                        }else{
                            inv.push(item);
                            rpd[id].inventory = inv;
                            fs.writeFileSync('data/roleplay.json',JSON.stringify(rpd));
                            response = "\""+item+"\" successfully added to your inventory.";
                        }

                    }
                }
                else
                {
                    response = "Use 'inventory add [item]' to add an item to your inventory."
                }
            }
            else if((compare(arguments[2],"rem"))||(compare(arguments[2],"remove")))
            {
                if(arguments[3]!=null && arguments[3]!='')
                {
                    //only user can remove items
                    var id = userID;
                    //check if the user has an entry in the file
                    let inv = [];
                    if(rpd[id]!=null)
                    {
                        if(rpd[id].inventory!=null){
                            inv = rpd[id].inventory;
                        }
                        else
                        {
                            rpd[id].inventory = [];
                        }
                    }
                    else
                    {
                        let temp = {}
                        temp.inventory = [];
                        rpd[id] = temp;
                    }

                    if(isInt(arguments[3])){
                        //argument is the ID
                        let remID = parseInt(arguments[3]);
                        if(remID>=inv.length || remID<0){
                            response = "No item found at ["+remID+"] in your inventory."
                        }else{
                            inv.splice(remID,1);
                            rpd[id].inventory = inv;
                            fs.writeFileSync('data/roleplay.json',JSON.stringify(rpd));
                            response = "["+remID+"] successfully removed from your inventory.";
                        }
                    }else{
                        let item = arguments[3].replace(/^"|"$/g, '');
                        if(inv.includes(item)){
                            let remID = inv.indexOf(item);
                            inv.splice(remID,1);
                            rpd[id].inventory = inv;
                            fs.writeFileSync('data/roleplay.json',JSON.stringify(rpd));
                            response = "\""+item+"\" successfully removed from your inventory.";
                        }else{
                            response = "No item \""+item+"\" found in your inventory."
                        }
                    }
                }
                else
                {
                    response = "Use 'inventory rem [item|id]' to remove an item from your inventory.";
                }
            }
            else if(compare(arguments[2],"purge")){
                //only user can purge items
                var id = userID;
                //check if the user has an entry in the file
                if(rpd[id]!=null)
                {
                    rpd[id].inventory = [];
                }
                else
                {
                    let temp = {}
                    temp.inventory = [];
                    rpd[id] = temp;
                }
                fs.writeFileSync('data/roleplay.json',JSON.stringify(rpd));
                response = "All items removed from your inventroy."
            }
            else
            {
                response = "Use 'inventory list <user>' to view your inventory.";
                response += "\nUse 'inventory add [item]' to add an item to your inventory.";
                response += "\nUse 'inventory rem [item|id]' to remove an item from your inventory.";
                response += "\nUse 'inventory purge' to remove all items from your inventory";
            }
        }

        //default response
        if(response==""){response="What?"}

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
	var str="**__Slimebot - Help Interface__**";
	str+="\n**help:** displays this message";
    str+="\n**roll <number>:** rolls a dice. default is d20";
	str+="\n**attributes:** setup and view your attributes";
    str+="\n**check [attr] <number>:** test your attributes against a dice roll";
    str+="\n**inventory:** add and remove items from your inventroy";
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

function bdaySetup(){
    let blindprophet = birthday("blindprophet");
    let greatkate = birthday("greatkate");
    let money7968 = birthday("renegade");
    let mcrekna1 = birthday("mcrekna1");
    let melody = birthday("melody");
    let beeves = birthday("beeves");
    let unispoon = birthday("unispoon");
    let punslinger = birthday("punslinger");

    var b_bp = schedule.scheduleJob(blindprophet, function(){
        bot.sendMessage({
            to:"224250143577210881",
            message:"Happy Birthday <@214396662783672323>"
        });
    });
    var b_gk = schedule.scheduleJob(greatkate, function(){
        bot.sendMessage({
            to:"224250143577210881",
            message:"Happy Birthday <@211986939455209472>"
        });
    });
    var b_7968 = schedule.scheduleJob(money7968, function(){
        bot.sendMessage({
            to:"224250143577210881",
            message:"Happy Birthday <@223924377639583744>"
        });
    });
    var b_rekna = schedule.scheduleJob(mcrekna1, function(){
        bot.sendMessage({
            to:"224250143577210881",
            message:"Happy Birthday <@121851008954531843>"
        });
    });
    var b_mel = schedule.scheduleJob(melody, function(){
        bot.sendMessage({
            to:"224250143577210881",
            message:"Happy Birthday <@192910368513720320>"
        });
    });
    var b_eeves = schedule.scheduleJob(beeves, function(){
        bot.sendMessage({
            to:"224250143577210881",
            message:"Happy Birthday <@175010295599595521>"
        });
    });
    var b_oon = schedule.scheduleJob(unispoon, function(){
        bot.sendMessage({
            to:"224250143577210881",
            message:"Happy Birthday <@304136210190827521>"
        });
    });
    var b_un = schedule.scheduleJob(punslinger, function(){
        bot.sendMessage({
            to:"224250143577210881",
            message:"Happy Birthday <@239502236944826379>"
        });
    });
}

function birthday(persona){
    var rule = new schedule.RecurrenceRule();
    rule.tz = "America/Los_Angeles";
    rule.hour = 0;
    rule.minute = 0;
    switch(persona){
        case "blindprophet":
            rule.date = 30;
            rule.month = 4;
            break;
        case "greatkate":
            rule.date = 3;
            rule.month = 3;
            break;
        case "renegade":
            rule.date = 27;
            rule.month = 4;
            break;
        case "mcrekna1":
            rule.date = 16;
            rule.month = 6;
            break;
        case "melody":
            rule.date = 11;
            rule.month = 10;
            break;
        case "beeves":
            rule.date = 14;
            rule.month = 2;
            break;
        case "unispoon":
            rule.date = 18;
            rule.month = 7;
            break;
        case "punslinger":
            rule.date = 24;
            rule.month = 0;
            break;
    }
    return rule;
}

function isInt(value) {
    if (isNaN(value)) {
      return false;
    }
    var x = parseFloat(value);
    return (x | 0) === x;
  }