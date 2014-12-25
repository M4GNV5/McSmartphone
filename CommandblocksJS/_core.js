 
﻿//region core classes 
var OutputHandler = new function() 
{ 
	this.output = []; 
	this.functions = []; 
	this.current = 0; 
	this.output[0] = ''; 
	this.functions[0] = function() { }; 
	this.addFunction = function(func) 
	{ 
		if (this.functions.indexOf(func) == -1) 
		{ 
			this.functions.push(func); 
			var id = this.functions.indexOf(func); 
			this.output[id] = ''; 
			var last = this.current; 
			this.current = id; 
			wire(2); 
			command("setblock ~-3 ~ ~ minecraft:air 0 replace"); 
			func(); 
			this.current = last; 
			return id; 
		} 
		return this.functions.indexOf(func); 
	} 
	this.removeFunction = function(func) 
	{ 
		var id = this.functions.indexOf(func); 
		if (id == -1) 
			return; 
		if (id == this.current) 
			throw "Cant remove current Function!"; 
		this.functions.splice(id, 1); 
		this.output.splice(id, 1); 
	} 
	this.addToCurrent = function(code) 
	{ 
		this.output[this.current] += code; 
	} 
} 
//endregion 
//region core functions 
var direction = 1; 
function block(id, data) 
{ 
	id = id || 1; 
	data = data || 0; 
	OutputHandler.addToCurrent('b' + id + '_' + data + ';'); 
} 
function command(text, placeRepeater) 
{ 
	text = text || "say CommandBlocksJS error invalid call 'command();'"; 
	if (placeRepeater !== false) 
		delay(); 
	OutputHandler.addToCurrent('c' + text + ';'); 
} 
function queryCommand(text, placeRepeater) 
{ 
	text = text || "say CommandBlocksJS error invalid call 'command();'"; 
	if (placeRepeater !== false) 
		delay(); 
	OutputHandler.addToCurrent('q' + text + ';'); 
} 
function sidewards(func) 
{ 
	direction++; 
	var code = 's'; 
	var oldManager = OutputHandler; 
	var newManager = new function() 
	{ 
		this.addToCurrent = function(data) { code += data.replace(/;/g, '|'); } 
		this.addFunction = function(func) 
		{ 
			direction--; 
			OutputHandler = oldManager; 
			var id = OutputHandler.addFunction(func); 
			OutputHandler = newManager; 
			direction++; 
			return id; 
		} 
	} 
	OutputHandler = newManager; 
	func(); 
	OutputHandler = oldManager; 
	OutputHandler.addToCurrent(code + ';'); 
	direction--; 
} 
function call(func, placeRepeater) 
{ 
	var funcId = OutputHandler.addFunction(func); 
	if (placeRepeater !== false) 
		delay(); 
	OutputHandler.addToCurrent('e' + funcId + ';'); 
} 
function sign(text1, text2, text3, text4, direc) 
{ 
	text1 = text1 || ""; 
	text2 = text2 || ""; 
	text3 = text3 || ""; 
	text4 = text4 || ""; 
	direc = direc || direction * 4; 
	text2 = text2 ? "_" + text2 : ""; 
	text3 = text3 ? "_" + text3 : ""; 
	text4 = text4 ? "_" + text4 : ""; 
	OutputHandler.addToCurrent('n' + text1 + text2 + text3 + text4 + '_' + direc + ';'); 
} 
//enregion 
//region wrapper functions 
function wire(length) 
{ 
	length = length || 1; 
	for (var i = 0; i < length; i++) 
		block(55); 
} 
function torch(activated) 
{ 
	activated = activated || true; 
	var data = (direction == 4) ? direction + 1 : 1; 
	if (activated == false) 
		block(75, data); 
	else 
		block(76, data); 
} 
function delay(time) 
{ 
	time = time || 0; 
	while (time >= 0) 
	{ 
		var delay = (time > 3) ? 3 : (time == 0) ? 0 : time - 1; 
		var data = delay * 4 + direction; 
		block(93, data); 
		time -= (time > 3) ? delay + 1 : delay + 2; 
	} 
} 
function comparator(activated) 
{ 
	activated = activated || false; 
	if (activated == false) 
		block(149, direction); 
	else 
		block(150, direction); 
} 
function invert(blockId, placeRepeater) 
{ 
	blockId = blockId || 1; 
	if (placeRepeater !== false) 
		delay(); 
	block(blockId); 
	torch(); 
} 
//endregion 
//region main code 
block(143, 5); 
wire(1); 
function cbjsWorker(schematic) 
{ 
	/*while(OutputHandler.current < OutputHandler.functions.length) 
	{ 
		OutputHandler.functions[OutputHandler.current](); 
		OutputHandler.current++; 
		if(OutputHandler.current < OutputHandler.functions.length) 
		{ 
			wire(2); 
			command("setblock ~-3 ~ ~ minecraft:air 0 replace"); 
		} 
	}*/ 
	OutputParser.start(schematic); 
	api.log("Successfully executed " + OutputHandler.functions.length + " functions!"); 
} 
//endregion 
//region internal helper classes 
var Naming = new function() 
{ 
	this.names = {}; 
	this.next = function(name) 
	{ 
		this.names[name] = this.names[name] || 0; 
		this.names[name]++; 
		return name + this.names[name]; 
	} 
} 
function Vector3(x, y, z) 
{ 
	this.x = x || 0; 
	this.y = y || 0; 
	this.z = z || 0; 
	this.toString = function(splitter) 
	{ 
		splitter = splitter || ' '; 
		return this.x + splitter + this.y + splitter + this.z; 
	} 
	this.clone = function() 
	{ 
		return new Vector3(this.x, this.y, this.z); 
	} 
} 
//endredion 
﻿//region events.js 
function Event(name) 
{ 
	name = name || Naming.next("event"); 
	this.name = name.toLowerCase(); 
	this.listener = false; 
	this.setListener = function(func) 
	{ 
		if (typeof func == 'undefined') 
			throw "Cannot add Listener to Event '" + name + "' Listener is undefined!"; 
		this.listener = func; 
	} 
	this.dispatch = function(arg) 
	{ 
		if (this.listener) 
			this.listener(arg); 
	} 
} 
var EventHandler = new function() 
{ 
	this.events = {}; 
	this.events['onmove'] = new ScoreChangeEvent('onmove', 'stat.walkOneCm'); 
	this.events['oncrouch'] = new ScoreChangeEvent('oncrouch', 'stat.crouchOneCm'); 
	this.events['onswim'] = new ScoreChangeEvent('onswim', 'stat.swimOneCm'); 
	this.events['onsprint'] = new ScoreChangeEvent('onsprint', 'stat.sprintOneCm'); 
	this.events['ondeath'] = new ScoreChangeEvent('ondeath', 'deathCount', { "resetScore": false }); 
	this.events['onkill'] = new ScoreChangeEvent('onkill', 'playerKillCount', { "resetScore": false }); 
	this.events['onentitykill'] = new ScoreChangeEvent('onentitykill', 'totalKillCount', { "resetScore": false }); 
	this.setEventListener = function(name, listener) 
	{ 
		name = name.toLowerCase(); 
		if (typeof EventHandler.events[name] == 'undefined') 
			throw "Cannot add Listener to Event '" + name + "' it does not exist!"; 
		EventHandler.events[name].setListener(listener); 
	} 
	this.dispatch = function(name, arg) 
	{ 
		name = name.toLowerCase(); 
		if (typeof this.events[name] == 'undefined') 
			throw "Cannot dispatch Event '" + name + "' it does not exist!"; 
		this.events[name].dispatch(arg); 
	} 
} 
function ScoreChangeEvent(name, objectiveType, options) 
{ 
	name = name || Naming.next("scoreEvent"); 
	Event.call(this, name); 
	objectiveType = objectiveType || "dummy"; 
	options = options || {}; 
	options.triggerOnValue = options.triggerOnValue || 1; 
	options.refreshTimer = options.refreshTimer || 9; 
	options.removeFromScore = options.removeFromScore || 1; 
	var objective = new Score(this.name + "E"); 
	var player; 
	this.checkForChange = function() 
	{ 
		var reference = objective.getSelector(options.triggerOnValue); 
		player.addPlayer(reference); 
		var resetScore = options.resetScore; 
		var removeFromScore = options.removeFromScore; 
		testfor(reference, function() 
		{ 
			if (resetScore == false) 
				objective.remove(reference, removeFromScore); 
			else 
				objective.set(reference, 0); 
			EventHandler.dispatch(name, player); 
		}); 
	} 
	this.getSelector = function() 
	{ 
		return objective.getSelector(options.triggerOnValue); 
	} 
	this.setListener = function(func) 
	{ 
		var oldListener = this.listener; 
		this.listener = function(player) 
		{ 
			func(player); 
			player.removePlayer(); 
		}; 
		if (!oldListener) 
		{ 
			if (options.createObjective !== false) 
				objective = new Score(this.name + "E", objectiveType); 
			player = new PlayerArray(this.name); 
			timer(options.refreshTimer, this.checkForChange); 
		} 
	} 
} 
ScoreChangeEvent.prototype = Object.create(Event.prototype); 
function DayLightEvent(name, triggerAt) 
{ 
	Event.call(this, name); 
	this.prototype = new Event(name); 
	OutputHandler.addFunction(function() 
	{ 
		block(151); 
		wire(triggerAt); 
		this.dispatch(triggerAt); 
	}); 
} 
DayLightEvent.prototype = Object.create(Event.prototype); 
//endregion 
var OutputParser = new function() 
{ 
	var position; 
	var direction = 1; 
	var functionPositions = {}; 
	this.start = function() 
	{ 
		position = startPosition; 
		var functions = OutputHandler.output; 
		for (var i = 0; i < functions.length; i++) 
		{ 
			functionPositions[i] = position.clone(); 
			var sidewards = getMaxSidewards(functions[i]); 
			updatePosition(function() { position.z -= sidewards }, function() { position.z += sidewards }, function() { position.z -= sidewards }, function() { position.z += sidewards }); 
		} 
		for (var i = 0; i < functions.length; i++) 
		{ 
			var source = functions[i]; 
			position = functionPositions[i].clone(); 
			parseFunction(source); 
		} 
		api.save(); 
	} 
	function getMaxSidewards(source) 
	{ 
		var sidewards = 2; 
		var splitted = source.split(';'); 
		for (var i = 0; i < splitted.length; i++) 
		{ 
			var splittedCall = splitted[i].split('|'); 
			if (splittedCall.length > sidewards) 
			{ 
				sidewards = splittedCall.length; 
			} 
		} 
		return sidewards; 
	} 
	function parseFunction(source) 
	{ 
		if (source == '') 
			return; 
		var calls = source.split(';'); 
		for (var i = 0; i < calls.length; i++) 
		{ 
			var _call = calls[i].trim(); 
			if (_call == '') 
				continue; 
			parseCall(_call); 
			updatePosition(function() { position.x-- }, function() { position.x++ }, function() { position.z-- }, function() { position.z++ }); 
		} 
	} 
	function parseCall(source) 
	{ 
		if (source.length < 1) 
			return; 
		switch (source[0]) 
		{ 
			case 'c': //c for C ommandblock 
				var command = source.substring(1); 
				api.placeCommandBlock(command, position.x, position.y, position.z); 
				break; 
			case 'q': //q for Q uery command 
				var qCommand = source.substring(1); 
				api.placeCommandBlock(qCommand, position.x, position.y, position.z); 
				var torchPos = new Vector3(position.x, position.y + 1, position.z); 
				api.placeBlock(75, 5, torchPos.x, torchPos.y, torchPos.z); 
				var resetCbPos = new Vector3(position.x, position.y + 2, position.z); 
				var escapedCommand = qCommand.replace("\"", "\\\""); 
				var resetCommand = "setblock ~ ~-2 ~ minecraft:command_block 0 replace {Command:\"%cmd%\"}".replace("%cmd%", escapedCommand); 
				api.placeCommandBlock(resetCommand, resetCbPos.x, resetCbPos.y, resetCbPos.z); 
				break; 
			case 'b': //b for B lock 
				var blockInfo = source.substring(1).split('_'); 
				api.placeBlock(blockInfo[0], blockInfo[1], position.x, position.y, position.z); 
				break; 
			case 's': //s for S idewards 
				var calls = source.substring(1).split('|'); 
				var oldPos = position.clone(); 
				direction++; 
				for (var i = 0; i < calls.length; i++) 
				{ 
					parseCall(calls[i].trim()); 
					updatePosition(function() { position.x-- }, function() { position.x++ }, function() { position.z-- }, function() { position.z++ }); 
				} 
				direction--; 
				position = oldPos; 
				break; 
			case 'e': //e for E xecute 
				var ePosition = functionPositions[source.substring(1)]; 
				var offX = ePosition.x - position.x; 
				var offY = ePosition.y - position.y; 
				var offZ = ePosition.z - position.z; 
				var eCommand = "setblock ~" + offX + " ~" + offY + " ~" + offZ + " minecraft:redstone_block 0 replace"; 
				api.placeCommandBlock(eCommand, position.x, position.y, position.z); 
				break; 
			case 'n': //n for N ote (sign) 
				var lines = source.substring(1).split('_'); 
				var signDirection = lines[lines.length - 1]; 
				lines[lines.length - 1] = ''; 
				api.placeSign(lines, signDirection, position.x, position.y, position.z); 
				break; 
			default: 
				api.log("Unknown Source: '" + source + "'"); 
				break; 
		} 
	} 
	function updatePosition(xMinus, xPlus, zMinus, zPlus) 
	{ 
		switch (direction) 
		{ 
			case 0: 
				zMinus(); 
				break; 
			case 1: 
				xPlus(); 
				break; 
			case 2: 
				zPlus(); 
				break; 
			case 3: 
				xMinus(); 
				break; 
		} 
	} 
} 
﻿//region player.js 
function Player(selector) 
{ 
	selector = selector || Selector.allPlayer(); 
	this.selector = Selector.parse(selector); 
	this.setGameMode = function(mode) 
	{ 
		command("gamemode " + mode + " " + this.selector); 
	} 
	this.teleport = function(dest) 
	{ 
		if (typeof dest == 'string') 
		{ 
			command("tp " + this.selector + " " + dest); 
		} 
		else 
		{ 
			if (typeof dest.yrot == 'undefined' || typeof dest.xrot != 'undefined') 
				command("tp " + this.selector + " " + dest.x + " " + dest.y + " " + dest.z); 
			else 
				command("tp " + this.selector + " " + dest.x + " " + dest.y + " " + dest.z + " " + dest.yrot + " " + dest.xrot); 
		} 
	} 
	this.clear = function(item, data, maxCount, dataTag) 
	{ 
		item = item || ''; 
		data = data || ''; 
		maxCount = maxCount || ''; 
		dataTag = dataTag || ''; 
		command("clear " + this.selector + " " + item + " " + data + " " + maxCount + " " + dataTag); 
	} 
	this.tell = function(text) 
	{ 
		command("tell " + this.selector + " " + text); 
	} 
	this.tellraw = function(param) 
	{ 
		if (typeof param == 'object') 
		{ 
			param.tell(this.selector); 
		} 
		else 
		{ 
			tellraw(this.selector, param); 
		} 
	} 
	this.setTeam = function(team) 
	{ 
		if (typeof team == 'object') 
		{ 
			team.join(this.selector); 
		} 
		else 
		{ 
			command("scoreboard teams join " + team + " " + this.selector); 
		} 
	} 
	this.setScore = function(score, value) 
	{ 
		if (typeof score == 'object') 
		{ 
			score.set(this.selector, value); 
		} 
		else 
		{ 
			command("scoreboard players set " + this.selector + " " + team + " " + value); 
		} 
	} 
	this.addScore = function(score, value) 
	{ 
		if (typeof score == 'object') 
		{ 
			score.add(this.selector, value); 
		} 
		else 
		{ 
			command("scoreboard players add " + this.selector + " " + team + " " + value); 
		} 
	} 
	this.removeScore = function(score, value) 
	{ 
		if (typeof score == 'object') 
		{ 
			score.remove(this.selector, value); 
		} 
		else 
		{ 
			command("scoreboard players remove " + this.selector + " " + team + " " + value); 
		} 
	} 
	this.getSelector = function() 
	{ 
		return this.selector; 
	} 
	this.toString = function() 
	{ 
		return this.selector; 
	} 
} 
function PlayerArray(name, selector, createObjective) 
{ 
	name = name || Naming.next('array'); 
	this.name = name; 
	var arrayScore; 
	if (createObjective !== false) 
		arrayScore = new Score(name, "dummy"); 
	else 
		arrayScore = new Score(name); 
	if (typeof selector != 'undefined') 
		arrayScore.set(selector, 1); 
	Player.call(this, arrayScore.getSelector(1)); 
	this.addPlayer = function(selector) 
	{ 
		arrayScore.set(selector, 1); 
	} 
	this.removePlayer = function(selector) 
	{ 
		selector = selector || this.getSelector(); 
		arrayScore.set(selector, 0); 
	} 
	this.getScore = function() 
	{ 
		return arrayScore; 
	} 
	this.toTeam = function(teamname) 
	{ 
		teamname = teamname || this.name; 
		var team = new Team(teamname, true); 
		team.addPlayer(this.selector); 
		return team; 
	} 
} 
PlayerArray.prototype = Object.create(Player.prototype); 
var Selector = function(selectorChar, attributes) 
{ 
	this.selectorChar = selectorChar || 'a'; 
	this.attributes = attributes || {}; 
	this.setAttribute = function(name, value) 
	{ 
		this.attributes[name] = value; 
	} 
	this.setAttributes = function(newAttributes) 
	{ 
		for (var name in newAttributes) 
			this.setAttribute(name, newAttributes[name]); 
	} 
	this.removeAttribute = function(name) 
	{ 
		delete this.attributes[name]; 
	} 
	this.clone = function() 
	{ 
		var atts = {}; 
		for (var key in this.attributes) 
			if (this.attributes.hasOwnProperty(key)) 
				atts[key] = this.attributes[key]; 
		return new Selector(this.selectorChar, atts); 
	} 
	this.toString = function() 
	{ 
		return Selector.buildSelector(this.selectorChar, this.attributes); 
	} 
} 
Selector.parse = function(stringSelector) 
{ 
	stringSelector = stringSelector.toString() || "@a[]"; 
	var selectorChar = stringSelector[1]; 
	var attributes = {}; 
	var attributeString = stringSelector.substring(3, stringSelector.length - 1); 
	var attributeArray = attributeString.split(','); 
	for (var i = 0; i < attributeArray.length; i++) 
	{ 
		var attributeSplit = attributeArray[i].split('='); 
		attributes[attributeSplit[0]] = attributeSplit[1]; 
	} 
	return new Selector(selectorChar, attributes); 
} 
Selector.buildSelector = function(selectorChar, attributes) 
{ 
	attributes = attributes || {}; 
	var sel = "@" + selectorChar; 
	if (Object.keys(attributes).length < 1) 
		return sel; 
	sel += "["; 
	for (var key in attributes) 
	{ 
		sel += key + "=" + attributes[key] + ","; 
	} 
	sel = sel.substring(0, sel.length - 1); 
	sel += "]"; 
	return sel; 
} 
Selector.player = function(attributes) 
{ 
	return Selector.buildSelector('p', attributes); 
} 
Selector.randomPlayer = function(attributes) 
{ 
	return Selector.buildSelector('r', attributes); 
} 
Selector.allPlayer = function(attributes) 
{ 
	return Selector.buildSelector('a', attributes); 
} 
Selector.entities = function(attributes) 
{ 
	return Selector.buildSelector('e', attributes); 
} 
//endregion 
function RuntimeInteger(options) 
{ 
	if(typeof RuntimeInteger.score == 'undefined') 
	{ 
		RuntimeInteger.score = new Score("std.values", "dummy"); 
	} 
	options = options || {}; 
	this.name = options.name || Naming.next("int"); 
	options.startValue = options.startValue || 0; 
	RuntimeInteger.score.set(this.name, options.startValue); 
	this.set = function(value) 
	{ 
		RuntimeInteger.score.set(this.name, value); 
	} 
	this.add = function(value) 
	{ 
		RuntimeInteger.score.add(this.name, value); 
	} 
	this.remove = function(value) 
	{ 
		RuntimeInteger.score.remove(this.name, value); 
	} 
	this.reset = function() 
	{ 
		RuntimeInteger.score.reset(this.name); 
	} 
	this.test = function(callback, min, max) 
	{ 
		RuntimeInteger.score.test(this.name, callback, min, max); 
	} 
	this.operation = function(operation, other, otherPlayer) 
	{ 
		RuntimeInteger.score.operation(this.name, operation, otherPlayer, other); 
	} 
	this.hasValue = function(value, callback) 
	{ 
		return this.isBetween(value, value, callback); 
	} 
	this.isBetween = function(min, max, callback) 
	{ 
		max = (typeof max == 'undefined') ? "" : max; 
		var command ="scoreboard players test "+this.name+" "+RuntimeInteger.score.name+" "+min+" "+max; 
		if(typeof callback !== 'undefined') 
			validate(command, callback); 
		return command; 
	} 
	this.asTellrawExtra = function() 
	{ 
		var extra = 
		{ 
			obj: 
			{ 
				score: 
				{ 
					name: "", 
					objective: "" 
				} 
			} 
		}; 
		extra.obj.score.name = this.name; 
		extra.obj.score.objective = RuntimeInteger.score.name; 
		return extra; 
	} 
} 
function RuntimeBoolean() 
{ 
	this.base = new RuntimeInteger(); 
	this.set = function(value) 
	{ 
		if(value) 
			this.base.set(1); 
		else 
			this.base.set(0); 
	} 
	this.hasValue = function(value, callback) 
	{ 
		if(value) 
			return this.base.hasValue(1, callback); 
		else 
			return this.base.hasValue(0, callback); 
	} 
	this.isTrue = function(callback) 
	{ 
		return this.hasValue(true, callback); 
	} 
	this.isFalse = function(callback) 
	{ 
		return this.hasValue(false, callback); 
	} 
	this.asTellrawExtra = function() 
	{ 
		return this.base.asTellrawExtra(); 
	} 
} 
function RuntimeString(value) 
{ 
	if(!RuntimeString.lastIndex || !RuntimeString.indexScore) 
	{ 
		RuntimeString.lastIndex = 0; 
		RuntimeString.indexScore = new Score("strings", "dummy"); 
	} 
	RuntimeString.lastIndex++; 
	this.selector = Selector.parse("@e[score_strings_min="+RuntimeString.lastIndex+",score_strings="+RuntimeString.lastIndex+"]"); 
	value = value || Naming.next("string"); 
	callOnce(function() 
	{ 
		command('summon Chicken ~ ~1 ~ {CustomName:"'+value+'",NoAI:true}'); 
		RuntimeString.indexScore.set('@e[name='+value+']', RuntimeString.lastIndex); 
	}); 
	delay(4); 
	this.set = function(value) 
	{ 
		command('entitydata '+this.selector+' {CustomName:"'+value+'"}'); 
	} 
	this.hasValue = function(value, callback) 
	{ 
		var hasValueSelector = this.selector.clone(); 
		hasValueSelector.setAttribute("name", value); 
		if(typeof callback != 'undefined') 
		{ 
			testfor(hasValueSelector, callback); 
		} 
		return hasValueSelector; 
	} 
	this.asTellrawExtra = function() 
	{ 
		var extra = 
		{ 
			obj: 
			{ 
				selector: "" 
			} 
		}; 
		extra.obj.selector = this.selector.toString(); 
		return extra; 
	} 
} 
RuntimeString.lastIndex = false; 
RuntimeString.indexScore = false; 
﻿//region tellraw.js 
function tellraw(selector, message, isJson) 
{ 
	selector = selector || Selector.allPlayer(); 
	message = message || "No Message defined!"; 
	var t = new Tellraw(); 
	if (isJson == true) 
		t.addExtra(message); 
	else 
		t.addText(message); 
	t.tell(selector); 
} 
function Tellraw() 
{ 
	this.extras = []; 
	this.addText = function(text) 
	{ 
		this.extras.push({ "text": text.toString() }); 
	} 
	this.addScore = function(selector, objective) 
	{ 
		this.extras.push({ "score": { "name": selector.toString(), "objective": objective.toString() } }); 
	} 
	this.addSelector = function(selector) 
	{ 
		this.extras.push({ "selector": selector.toString() }); 
	} 
	this.addExtra = function(extra) 
	{ 
		this.extras.push(extra.obj); 
	} 
	this.tell = function(selector) 
	{ 
		selector = selector || Selector.allPlayer(); 
		var extrasArray = JSON.stringify(this.extras); 
		command('tellraw ' + selector + ' {"text":"",extra:' + extrasArray + '}'); 
	} 
} 
function TellrawExtra(text) 
{ 
	text = text || ""; 
	this.obj = { "text": text }; 
	this.setText = function(newText) 
	{ 
		this.setOption("text", newText); 
	} 
	this.setClickEvent = function(action, value) 
	{ 
		this.setOption("clickEvent", { "action": action, "value": value }); 
	} 
	this.setHoverEvent = function(action, value) 
	{ 
		this.setOption("clickEvent", { "action": action, "value": value }); 
	} 
	this.setColor = function(color) 
	{ 
		this.setOption("color", color); 
	} 
	this.setOption = function(name, value) 
	{ 
		this.obj[name] = value; 
	} 
} 
function TellrawClickableExtra(callback, text, options) 
{ 
	TellrawExtra.call(this, text); 
	if (typeof callback == 'undefined') 
		throw "Cannot create TellrawClickableExtra without callback"; 
	options = options || {}; 
	options.name = options.name || Naming.next("clickExtra").toLowerCase(); 
	this.setClickEvent("run_command", "/trigger " + options.name + "E add 1"); 
	var scoreEvent = new ScoreChangeEvent(options.name, "trigger", options); 
	EventHandler.events[scoreEvent.name] = scoreEvent; 
	var score = new Score(options.name + "E", "trigger", false, false); 
	scoreEvent.setListener(function(player) 
	{ 
		if (options.multipleClicks !== false) 
			score.enableTrigger(Selector.allPlayer()); 
		callback(player); 
	}); 
	score.enableTrigger(Selector.allPlayer()); 
	this.setClickEvent = function() 
	{ 
		throw "setting the click event command is not supported using TellrawClickableExtra"; 
	} 
} 
TellrawClickableExtra.prototype = Object.create(TellrawExtra.prototype); 
//endregion 
﻿var TileName = new function() 
{ 
	this.data = 
	[ 
		"AIR", 
		"STONE", 
		"GRASS", 
		"DIRT", 
		"COBBLESTONE", 
		"PLANKS", 
		"SAPLING", 
		"BEDROCK", 
		"FLOWING_WATER", 
		"WATER", 
		"FLOWING_LAVA", 
		"LAVA", 
		"SAND", 
		"GRAVEL", 
		"GOLD_ORE", 
		"IRON_ORE", 
		"COAL_ORE", 
		"LOG", 
		"LEAVES", 
		"SPONGE", 
		"GLASS", 
		"LAPIS_ORE", 
		"LAPIS_BLOCK", 
		"DISPENSER", 
		"SANDSTONE", 
		"NOTEBLOCK", 
		"BED", 
		"GOLDEN_RAIL", 
		"DETECTOR_RAIL", 
		"STICKY_PISTON", 
		"WEB", 
		"TALLGRASS", 
		"DEADBUSH", 
		"PISTON", 
		"PISTON_HEAD", 
		"WOOL", 
		"PISTON_MOVING", 
		"YELLOW_FLOWER", 
		"RED_FLOWER", 
		"BROWN_MUSHROOM", 
		"RED_MUSHROOM", 
		"GOLD_BLOCK", 
		"IRON_BLOCK", 
		"DOUBLE_STONE_SLAB", 
		"STONE_SLAB", 
		"BRICK_BLOCK", 
		"TNT", 
		"BOOKSHELF", 
		"MOSSY_COBBLESTONE", 
		"OBSIDIAN", 
		"TORCH", 
		"FIRE", 
		"MOB_SPAWNER", 
		"OAK_STAIRS", 
		"CHEST", 
		"REDSTONE_WIRE", 
		"DIAMOND_ORE", 
		"DIAMOND_BLOCK", 
		"CRAFTING_TABLE", 
		"WHEAT", 
		"FARMLAND", 
		"FURNACE", 
		"LIT_FURNACE", 
		"STANDING_SIGN", 
		"WOODEN_DOOR", 
		"LADDER", 
		"RAIL", 
		"STONE_STAIRS", 
		"WALL_SIGN", 
		"LEVER", 
		"STONE_PRESSURE_PLATE", 
		"IRON_DOOR", 
		"WOODEN_PRESSURE_PLATE", 
		"REDSTONE_ORE", 
		"LIT_REDSTONE_ORE", 
		"UNLIT_REDSTONE_TORCH", 
		"REDSTONE_TORCH", 
		"STONE_BUTTON", 
		"SNOW_LAYER", 
		"ICE", 
		"SNOW", 
		"CACTUS", 
		"CLAY", 
		"REEDS", 
		"JUKEBOX", 
		"FENCE", 
		"PUMPKIN", 
		"NETHERRACK", 
		"SOUL_SAND", 
		"GLOWSTONE", 
		"PORTAL", 
		"LIT_PUMPKIN", 
		"CAKE", 
		"UNPOWERED_REPEATER", 
		"POWERED_REPEATER", 
		"STAINED_GLASS", 
		"TRAPDOOR", 
		"MONSTER_EGG", 
		"STONE_BRICK", 
		"HUGE_RED_MUSHROOM", 
		"HUGE_BROWN_MUSHROOM", 
		"IRON_BARS", 
		"GLASS_PANE", 
		"MELON_BLOCK", 
		"PUMPKIN_STEM", 
		"MELON_STEM", 
		"VINE", 
		"FENCE_GATE", 
		"BRICK_STAIRS", 
		"STONE_BRICK_STAIRS", 
		"MYCELIUM", 
		"WATERLILY", 
		"NETHER_BRICK", 
		"NETHER_BRICK_FENCE", 
		"NETHER_BRICK_STAIRS", 
		"NETHER_WART", 
		"ENCHANTING_TABLE", 
		"BREWING_STAND", 
		"CAULDRON", 
		"END_PORTAL", 
		"END_PORTAL_FRAME", 
		"END_STONE", 
		"DRAGON_EGG", 
		"REDSTONE_LAMP", 
		"LIT_REDSTONE_LAMP", 
		"DOUBLE_WOODEN_SLAB", 
		"WOODEN_SLAB", 
		"COCOA", 
		"SANDSTONE_STAIRS", 
		"EMERALD_ORE", 
		"ENDER_CHEST", 
		"TRIPWIRE_HOOK", 
		"TRIPWIRE", 
		"EMERALD_BLOCK", 
		"SPRUCE_STAIRS", 
		"BIRCH_STAIRS", 
		"JUNGLE_STAIRS", 
		"COMMAND_BLOCK", 
		"BEACON", 
		"COBBLESTONE_WALL", 
		"FLOWER_POT", 
		"CARROTS", 
		"POTATOES", 
		"WOODEN_BUTTON", 
		"SKULL", 
		"ANVIL", 
		"TRAPPED_CHEST", 
		"LIGHT_WEIGHTED_PRESSURE_PLATE", 
		"HEAVY_WEIGHTED_PRESSURE_PLATE", 
		"UNPOWERED_COMPARATOR", 
		"POWERED_COMPARATOR", 
		"DAYLIGHT_SENSOR", 
		"REDSTONE_BLOCK", 
		"QUARTZ_ORE", 
		"HOPPER", 
		"QUARTZ_BLOCK", 
		"QUARTZ_STAIRS", 
		"ACTIVATOR_RAIL", 
		"DROPPER", 
		"STAINED_HARDENED_CLA" 
	]; 
	for (var i = 0; i < this.data.length; i++) 
	{ 
		this[this.data[i]] = i; 
	} 
	this.byId = function(id) 
	{ 
		return this.data[id].toLowerCase(); 
	} 
	this.byName = function(name) 
	{ 
		name = name.toUpperCase(); 
		return this[name]; 
	} 
} 
﻿//region utility functions 
function callOnce(callback, placeRepeater) 
{ 
	call(function() 
	{ 
		command("setblock ~-3 ~ ~ minecraft:air 0 replace", true); 
		callback(); 
	}, placeRepeater); 
} 
function validate(cmd, callback, placeRepeater) 
{ 
	if (placeRepeater !== false) 
		delay(); 
	sidewards(function() 
	{ 
		queryCommand(cmd, false); 
		comparator(); 
		call(callback, false); 
	}); 
} 
function validateSync(cmd, placeRepeater) 
{ 
	cmd = cmd || 'say CommandBlocksJS error invalid call "validateSync();"'; 
	queryCommand(cmd, placeRepeater); 
	comparator(); 
} 
function testfor(statement, callback, placeRepeater) 
{ 
	validate('testfor ' + statement, callback, placeRepeater); 
} 
function testforSync(statement, placeRepeater) 
{ 
	validateSync('testfor ' + statement, placeRepeater); 
} 
function testfornot(statement, callback, placeRepeater) 
{ 
	if (placeRepeater !== false) 
		delay(); 
	sidewards(function() 
	{ 
		queryCommand("testfor " + statement, false); 
		comparator(); 
		block(1); 
	}); 
	delay(); 
	sidewards(function() 
	{ 
		command("setblock ~-1 ~ ~2 minecraft:unpowered_repeater 1", false); 
		delay(); 
		delay(); 
		call(callback, false); 
	}); 
} 
//endregion 
//region timer 
function timer(time, callback) 
{ 
	var t = new Timer(callback, { time: time }); 
	t.start(); 
	return t; 
} 
function Timer(callback, options) 
{ 
	if (typeof callback == 'undefined') 
		throw "Cannot create timer without callback!"; 
	options = options || {}; 
	options.time = options.time || 10; 
	options.useScoreboard = options.useScoreboard || (options.time >= 40) ? true : false; 
	options.hardTickLength = options.hardTickLength || 10; 
	options.callAsync = options.callAsync || false; 
	options.scoreName = options.scoreName || Naming.next("timer"); 
	var timerVar; 
	var isRunning; 
	var scoreTicks; 
	if (options.useScoreboard !== false) 
	{ 
		scoreTicks = ((options.time / options.hardTickLength) < 1) ? 1 : (options.time / options.hardTickLength); 
		options.time = options.hardTickLength; 
		var varOptions = {}; 
		varOptions.name = options.scoreName; 
		timerVar = new RuntimeInteger(varOptions); 
		var isRunningOptions = {} 
		isRunningOptions.name = varOptions.name + "R"; 
		isRunning = new RuntimeInteger(isRunningOptions); 
		isRunning.set(-1); 
		callOnce(function() { timerVar.set(-1); }); 
		delay(3); 
		options.time = (options.time - 5 > 0) ? options.time - 5 : 1; 
	} 
	var timerFunc = function() 
	{ 
		if (options.useScoreboard == false) 
		{ 
			if (options.callAsync) 
				call(callback); 
			else 
				callback(); 
		} 
		else 
		{ 
			testforSync(isRunning.hasValue(1)); 
			timerVar.add(1); 
			testfor(timerVar.isBetween(scoreTicks), function() 
			{ 
				timerVar.set(0); 
				callback(); 
			}); 
		} 
		delay(options.time); 
		call(timerFunc); 
	} 
	this.start = function() 
	{ 
		if (options.useScoreboard) 
		{ 
			testfor(isRunning.hasValue(-1), timerFunc); 
			isRunning.set(1); 
		} 
		else 
		{ 
			call(timerFunc); 
		} 
	} 
	this.stop = function() 
	{ 
		if (options.useScoreboard == false) 
			throw "Cannot stop timer that doesnt use the Scoreboard"; 
		isRunning.set(-1); 
	} 
} 
//endregion 
﻿//region chat 
function say(message) 
{ 
	message = message || "CommandBlocksJS error invalid call 'say()'"; 
	command("say " + message); 
} 
var Formatting = new function() 
{ 
	this.black = '§0'; 
	this.darkBlue = '§1'; 
	this.darkGreen = '§2'; 
	this.darkAqua = '§3'; 
	this.darkRed = '§4'; 
	this.darkPurple = '§5'; 
	this.gold = '§6'; 
	this.gray = '§7'; 
	this.darkGray = '§8'; 
	this.blue = '§9'; 
	this.green = '§a'; 
	this.aqua = '§b'; 
	this.red = '§c'; 
	this.lightPurple = '§d'; 
	this.yellow = '§e'; 
	this.white = '§f'; 
	this.obfuscated = '§k'; 
	this.bold = '§l'; 
	this.strikethrough = '§m'; 
	this.underlined = '§n'; 
	this.reset = '§r'; 
} 
String.prototype.format = function(formatting) 
{ 
	return formatText(this, formatting); 
}; 
function formatText(text, formatting) 
{ 
	text = text || "CommandblockJS Error: No text given to formatText function!"; 
	formatting = ' ' + formatting || '§c'; 
	var words = text.split(' '); 
	text = ''; 
	for (var i = 0; i < words.length; i++) 
	{ 
		text += formatting + words[i]; 
	} 
	return text.trim(); 
} 
//endregion 
//region title 
function title(target, text, isSubtitle) 
{ 
	target = target || Selector.allPlayer(); 
	text = text || "No Text defined!"; 
	var t = new Title(text, isSubtitle); 
	t.show(target); 
} 
function Title(text, isSubtitle) 
{ 
	TellrawExtra.call(this, text); 
	var titleType = isSubtitle ? "subtitle" : "title"; 
	this.show = function(player) 
	{ 
		player = player || Selector.allPlayer(); 
		var json = JSON.stringify(this.obj); 
		command("title " + player + " " + titleType + " " + json); 
	} 
	var notSupported = function() { throw "Setting events is not supported for titles"; }; 
	this.setClickEvent = notSupported; 
	this.setHoverEvent = notSupported; 
} 
Title.prototype = Object.create(TellrawExtra.prototype); 
Title.setTime = function(player, fadeIn, stay, fadeOut) 
{ 
	player = player || Selector.allPlayer(); 
	command("title " + player + " times " + fadeIn + " " + stay + " " + fadeOut); 
} 
Title.reset = function(player) 
{ 
	player = player || Selector.allPlayer(); 
	command("title " + player + " reset"); 
} 
Title.clear = function(player) 
{ 
	player = player || Selector.allPlayer(); 
	command("title " + player + " clear"); 
} 
//endregion title 
//region scoreboard 
function Score(name, type, displayName, addObjective) 
{ 
	name = name || Naming.next("score"); 
	if (name.length > 16) 
		throw "Cannot create Score with name '" + name + "' maximum name length is 16"; 
	displayName = displayName || name; 
	if (typeof type != 'undefined' && addObjective !== false) 
		command("scoreboard objectives add " + name + " " + type + " " + displayName); 
	this.name = name; 
	this.type = type; 
	this.displayName = displayName; 
	this.set = function(player, value) 
	{ 
		command("scoreboard players set " + player + " " + name + " " + value); 
	} 
	this.add = function(player, value) 
	{ 
		command("scoreboard players add " + player + " " + name + " " + value); 
	} 
	this.remove = function(player, value) 
	{ 
		command("scoreboard players remove " + player + " " + name + " " + value); 
	} 
	this.reset = function(player) 
	{ 
		command("scoreboard players reset " + player + " " + name); 
	} 
	this.setDisplay = function(slot) 
	{ 
		command("scoreboard objectives setdisplay " + slot + " " + name); 
	} 
	this.enableTrigger = function(player) 
	{ 
		if (this.type != 'trigger') 
			throw "Cannot enable trigger for non Trigger objective '" + name + "'"; 
		command("scoreboard players enable " + player + " " + name); 
	} 
	this.test = function(player, callback, min, max) 
	{ 
		min = min || 1; 
		max = max || ''; 
		var cmd = "scoreboard players test " + player + " " + name + " " + min + " " + max; 
		validate(cmd, callback); 
	} 
	this.operation = function(player, operation, otherPlayer, otherObjective) 
	{ 
		command("scoreboard players operation " + player + " " + name + " " + operation + " " + otherPlayer + " " + otherObjective); 
	} 
	this.getSelector = function(min, max) 
	{ 
		var minKey = "score_" + name + "_min"; 
		var maxKey = "score_" + name; 
		var attributes = {}; 
		attributes[minKey] = min; 
		if (typeof max != 'undefined') 
			attributes[maxKey] = max; 
		return new Selector("a", attributes); 
	} 
	this.getPlayer = function(min, max) 
	{ 
		var reference = this.getSelector(min, max); 
		return new PlayerArray(name, reference); 
	} 
} 
function Team(name, addTeam) 
{ 
	name = name || Naming.next("team"); 
	addTeam = addTeam || true; 
	if (addTeam !== false) 
		command("scoreboard teams add " + name); 
	this.name = name; 
	this.empty = function() 
	{ 
		command("scoreboard teams empty " + name); 
	} 
	this.join = function(player) 
	{ 
		command("scoreboard teams join " + name + " " + player); 
	} 
	this.leave = function(player) 
	{ 
		command("scoreboard teams leave " + name + " " + player); 
	} 
	this.setOption = function(option, value) 
	{ 
		command("scoreboard teams option " + name + " " + option + " " + value); 
	} 
	this.getSelector = function() 
	{ 
		return new Selector("a", { team: name }); 
	} 
	this.getPlayer = function() 
	{ 
		var reference = this.getSelector(); 
		return new PlayerArray(name, reference); 
	} 
} 
//endregion 
