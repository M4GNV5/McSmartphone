function phoneTouch()
{
	this.listener = {};

	this.addLocationListener = function(x, y, radius, callback)
	{
		radius = radius || 1;

		var pos = Phone.Screen.getPosition(x, y);

		var attributes = {};
		attributes.x = pos.x;
		attributes.y = pos.y + 1;
		attributes.z = pos.z;
		attributes.r = radius;

		var selector = new Selector('a', attributes);

		this.addListener(selector, callback);
	}
	this.addRegionListener = function(x, y, sizeX, sizeY, callback)
	{
		var pos = Phone.Screen.getPosition(x, y);

		var attributes = {};
		attributes.x = pos.x;
		attributes.y = pos.y;
		attributes.z = pos.z;
		attributes.dx = sizeX - 1;
		attributes.dy = 3;
		attributes.dz = sizeY - 1;

		var selector = new Selector('a', attributes);

		this.addListener(selector, callback);
	}
	this.addRelativeListener = function(relativeSelector, radius, callback)
	{
		var name = Naming.next("touch");

		var score = new Score(name, "trigger");

		score.enableTrigger(Selector.allPlayer());

		var timerFunc = function()
		{
			command("execute "+relativeSelector+" ~ ~ ~ execute @a[r="+radius+"] ~ ~ ~ detect ~ ~-2 ~ "+Phone.blockType+" 0 trigger "+name+" add 1");
			testfor(score.getSelector(1), function()
			{
				callback(new Player(score.getSelector(1)));
				score.set(score.getSelector(1), 0);
				score.enableTrigger(Selector.allPlayer());
			});
		};

		var timer = new Timer(timerFunc, {useScoreboard: true, time: 1, hardTickLength: 1});
		timer.start();

		this.listener[callback] = timer;
	}
	this.addListener = function(selector, callback)
	{
		var name = Naming.next("touch");

		var timerFunc = function()
		{
			command("testfor "+selector);
			comparator();
			callback(new Player(selector));
		}

		var timer = new Timer(timerFunc, {useScoreboard: true, time: 1, hardTickLength: 1});
		timer.start();

		this.listener[callback] = timer;
	}

	this.removeListener = function(callback)
	{
		if(typeof this.listener[callback] == 'undefined')
			throw "Cannot remove touch listener for unregistered function '"+callback+"'";

		this.listener[callback].stop();
	}
	this.removeAllListener = function()
	{
		for(var callback in this.listener)
			this.removeListener(callback);
	}
}