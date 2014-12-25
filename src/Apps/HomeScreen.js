var phoneApps = phoneApps || {};
phoneApps.HomeScreen = function()
{
	var shownApps = [];
	var appIcons = {};

	var defaultIcon = [
		[Phone.defaultColor, Phone.defaultColor, Phone.defaultColor],
		[Phone.defaultColor, -1, Phone.defaultColor],
		[Phone.defaultColor, Phone.defaultColor, Phone.defaultColor]
	];

	this.intialize = function()
	{
		defaultIcon = Phone.Renderer.registerStructure(defaultIcon);
		for(var name in Phone.Apps)
		{
			var app = Phone.Apps[name];

			if(app.showInHomeScreen)
			{
				var icon = app.homeScreenIcon || defaultIcon;
				shownApps.push(app);
				appIcons[app] = icon;
			}
		}
	}
	this.start = function()
	{
		Phone.Screen.clearScreen(Phone.Color.white);

		var pos = new Phone.Vector2(1, 1);
		for(var app in appIcons)
		{
			drawIcon(pos, app);

			pos = getNextIconPos(pos);
		}
	}
	this.stop = function()
	{
	}

	function drawIcon(pos, app)
	{
		Phone.Renderer.renderTo(appIcons[app], pos.x, pos.y);
	}
	function getNextIconPos(last)
	{
		var next = last.clone();
		next.x += 4;
		if(next.x > Phone.Screen.size.x)
		{
			next.x = 1;
			next.y += 4;
		}
		return next;
	}
}