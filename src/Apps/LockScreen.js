var phoneApps = phoneApps || {};
phoneApps.LockScreen = function()
{
	var icon;
	var iconSize;
	var iconPos;
	var touchTimer;

	function touchListener()
	{
		Phone.runtimeLog("Phone unlocked");
		Phone.AppManager.start("HomeScreen");
	}

	this.intialize = function()
	{
		if(Phone.Screen.size.x / 2 == Math.floor(Phone.Screen.size.x / 2))
		{
			icon = [
				[-1, -1, Phone.Color.red, Phone.Color.red, Phone.Color.red, Phone.Color.red, -1, -1],
				[-1, Phone.Color.red, -1, -1, -1, -1, Phone.Color.red, -1],
				[Phone.Color.red, -1, -1, -1, -1, -1, -1, Phone.Color.red],
				[Phone.Color.red, -1, -1, -1, -1, -1, -1, Phone.Color.red],
				[Phone.Color.red, -1, -1, -1, -1, -1, -1, Phone.Color.red],
				[Phone.Color.red, -1, -1, -1, -1, -1, -1, Phone.Color.red],
				[-1, Phone.Color.red, -1, -1, -1, -1, Phone.Color.red, -1],
				[-1, -1, Phone.Color.red, Phone.Color.red, Phone.Color.red, Phone.Color.red, -1, -1],
			];
			iconSize = new Phone.Vector2(8, 8);
		}
		else
		{
			icon = [
				[-1, -1, Phone.Color.red, Phone.Color.red, Phone.Color.red, -1, -1],
				[-1, Phone.Color.red, -1, -1, -1, Phone.Color.red, -1],
				[Phone.Color.red, -1, -1, -1, -1, -1, Phone.Color.red],
				[Phone.Color.red, -1, -1, -1, -1, -1, Phone.Color.red],
				[Phone.Color.red, -1, -1, -1, -1, -1, Phone.Color.red],
				[-1, Phone.Color.red, -1, -1, -1, Phone.Color.red, -1],
				[-1, -1, Phone.Color.red, Phone.Color.red, Phone.Color.red, -1, -1],
			];
			iconSize = new Phone.Vector2(7, 7);
		}

		icon = Phone.Renderer.registerStructure(icon);

		Phone.Renderer.preRender(icon);

		var size = Phone.Screen.getSize();
		iconPos = new Phone.Vector2(Math.round(size.x/2-4), size.y - 7 - Math.floor(size.y/10));

		unlockTouchTimer = Phone.Touch.addRegionListener(iconPos.x, iconPos.y, iconSize.x, iconSize.y, touchListener);
	}
	this.start = function()
	{
		Phone.Screen.clearScreen(Phone.Color.black);
		Phone.Renderer.renderTo(icon, iconPos.x, iconPos.y);

		unlockTouchTimer.enable();

		Phone.Apps.Clock.setBgColor(Phone.Color.black);
		Phone.Apps.Clock.addRenderer(Math.floor((Phone.Screen.getSize().x-16)/2), 1);
	}
	this.stop = function()
	{
		Phone.Apps.Clock.removeRenderer();
		unlockTouchTimer.disable();
	}
}