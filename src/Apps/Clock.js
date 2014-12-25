var phoneApps = phoneApps || {};
phoneApps.Clock = function()
{
	this.currentTime = [];
	//this.operationInt;
	//this.rBuilder;

	this.resetStructure = [
		[Phone.defaultColor, Phone.defaultColor, Phone.defaultColor],
		[Phone.defaultColor, -1, Phone.defaultColor],
		[Phone.defaultColor, Phone.defaultColor, Phone.defaultColor],
		[Phone.defaultColor, -1, Phone.defaultColor],
		[Phone.defaultColor, Phone.defaultColor, Phone.defaultColor]
	];

	var clockTimer;

	var renderInt = function(integer, selector)
	{
		for(var i = 0; i < 11; i++)
		{
			var ii = (i == 10) ? 0 : i;

			delay();
			sidewards(function()
			{
				validateSync(integer.hasValue(i), false);
				Phone.Renderer.renderAs(Phone.Apps.Clock.resetStructure, selector, {placeRepeater: false});
				Phone.Renderer.renderAs(Phone.Structures["number"+ii], selector, {placeRepeater: false});
			});
		}
	}
	var renderSeconds = function()
	{
		renderInt(Phone.Apps.Clock.currentTime[3], "@e[name=clock3]");
		renderInt(Phone.Apps.Clock.currentTime[2], "@e[name=clock2]");
	}
	var renderMinutes = function()
	{
		renderInt(Phone.Apps.Clock.currentTime[1], "@e[name=clock1]");
		renderInt(Phone.Apps.Clock.currentTime[0], "@e[name=clock0]");
	}
	var clockTick = function()
	{
		var currentTime = Phone.Apps.Clock.currentTime;
		var rBuilder = Phone.Apps.Clock.rBuilder;

		currentTime[3].add(1);

		call(renderSeconds);

		validateSync(currentTime[3].isBetween(10));
		currentTime[2].add(1);
		currentTime[3].set(0);

		validateSync(currentTime[2].isBetween(6));
		currentTime[1].add(1);
		currentTime[2].set(0);

		call(renderMinutes);

		validateSync(currentTime[1].isBetween(10));
		currentTime[0].add(1);
		currentTime[1].set(0);

		validateSync(currentTime[0].isBetween(10));
		currentTime[0].set(0);
	}

	this.addRenderer = function(x, y, format)
	{
		var pos = Phone.Screen.getPosition(x, y);
		format = format || "0 1  2 3";

		var times = Phone.Apps.Clock.currentTime;

		for(var i = 0; i < format.length; i++)
		{
			if(typeof times[format[i]] != 'undefined')
			{
				var rBuilder = new Phone.Relative(pos, "clock"+format[i]);
				pos.x += 3;
			}
			else if(format[i] == " ")
			{
				pos.x += 1;
			}
		}

		call(renderSeconds);
		call(renderMinutes);
	}

	this.setBgColor = function(color)
	{
		color = color || Phone.Colors.black;
		Phone.Renderer.setColor(this.resetStructure, color);
	}

	this.removeRenderer = function()
	{
		command("kill @e[name=clock0]");
		command("kill @e[name=clock1]");
		command("kill @e[name=clock2]");
		command("kill @e[name=clock3]");
	}

	this.intialize = function()
	{
		this.currentTime[0] = new RuntimeInteger({startValue: 0});
		this.currentTime[1] = new RuntimeInteger({startValue: 0});
		this.currentTime[2] = new RuntimeInteger({startValue: 0});
		this.currentTime[3] = new RuntimeInteger({startValue: 0});

		this.resetStructure = Phone.Renderer.registerStructure(this.resetStructure);

		clockTimer = new Timer(clockTick, {time: 10, callAsync: true});

		var ids = [];
		for(var i = 0; i < 10; i++)
		{
			ids.push(Phone.Structures["number"+i]);
		}
		ids.push(this.resetStructure);

		Phone.Renderer.preRenderMultiple(ids);

		clockTimer.start();
	}
	this.start = function()
	{
	}
	this.stop = function()
	{
	}
}