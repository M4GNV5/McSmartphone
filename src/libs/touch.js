function phoneTouch(options)
{
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

		return this.addListener(selector, callback);
	}
	this.addRegionListener = function(x, y, sizeX, sizeY, callback, height)
	{
		var pos = Phone.Screen.getPosition(x, y);

		var attributes = {};
		attributes.x = pos.x;
		attributes.y = pos.y;
		attributes.z = pos.z;
		attributes.dx = sizeX - 1;
		attributes.dy = height || 3;
		attributes.dz = sizeY - 1;

		var selector = new Selector('a', attributes);

		return this.addListener(selector, callback);
	}
	this.addRelativeListener = function(relativeSelector, radius, callback, distanceY)
	{
		var pos1 = new Phone.Screen.position.clone();
		var pos2 = Phone.Screen.getPosition(Phone.Screen.size.x, Phone.Screen.size.y);
		pos1.y--;
		pos2.y--;
		command("fill "+pos1+" "+pos2+" "+Phone.blockType+" 0");

		var valueY = Phone.Screen.getPosition(0, 0).y;
		distanceY = distanceY || 2;

		var name = Naming.next("touch");
		var score = new Score(name, "trigger");

		score.enableTrigger(Selector.allPlayer());

		var timerFunc = function()
		{
			command("execute "+relativeSelector+" ~ ~ ~ execute @a[y="+valueY+",dy="+distanceY+",r="+radius+"] ~ ~ ~ detect ~ ~-2 ~ "+Phone.blockType+" 0 trigger "+name+" add 1");
			testfor(score.getSelector(1), function()
			{
				callback(new Player(score.getSelector(1)));
				score.set(score.getSelector(1), 0);
				score.enableTrigger(Selector.allPlayer());
			});
		};

		var timer = new Phone.Timer(timerFunc);

		return timer;
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

		var timer = new Phone.Timer(timerFunc);

		return timer;
	}
}