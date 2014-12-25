var phoneApps = phoneApps || {};
phoneApps.Standby = function()
{
	var aliveLed = [[14]];
	aliveLed = Phone.Renderer.registerStructure(aliveLed);

	var knock;
	var knockTouch;

	function knockTouchListener()
	{
		knock.add(5);
		say("knock");
		validateSync(knock.isBetween(6));
		Phone.AppManager.start("LockScreen");
	}

	function blinkAliveLed()
	{
		blinkTimer.enabled.base.set(2);
		delay(30);

		knock.isBetween(0, false, function() { knock.remove(1); });

		Phone.Renderer.renderTo(aliveLed, Phone.Screen.size.x-1, 0, {color: Phone.Color.red});
		delay(10);
		Phone.Renderer.renderTo(aliveLed, Phone.Screen.size.x-1, 0, {color: Phone.Color.black});

		var canContinue = blinkTimer.enabled.base.hasValue(2);
		validateSync(canContinue);
		blinkTimer.enable();
	}

	var blinkTimer;

	this.intialize = function()
	{
		knock = new RuntimeInteger();
		knockTouch = Phone.Touch.addRegionListener(0, 0, Phone.Screen.size.x, Phone.Screen.size.y, knockTouchListener);

		Phone.Renderer.preRender(aliveLed);

		blinkTimer = new Phone.Timer(blinkAliveLed);
	}
	this.start = function()
	{
		Phone.Screen.clearScreen(Phone.Color.black);

		blinkTimer.enable();
		knockTouch.enable();
	}
	this.stop = function()
	{
		blinkTimer.disable();
		knockTouch.disable();
	}
}