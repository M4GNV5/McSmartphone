function phoneTimer(callback, name)
{
	if(phoneTimer.isFirst)
	{
		phoneTimer.timers = [];
		phoneTimer.isFirst = false;

		Phone.finalize.push(function()
		{
			var func = function()
			{
				for(var i = 0; i < phoneTimer.timers.length; i++)
				{
					var timer = phoneTimer.timers[i];
					timer.isEnabled(timer.callback);
				}
			}
			var timer = new Timer(func, {time: 1});
			callOnce(function()
			{
				timer.start();
			});
		});
	}

	phoneTimer.timers.push(this);

	var deac = new Phone.Deactivatable(name || Naming.next("phoneTimer"));
	Phone.Deactivatable.applyTo(this, deac);
	this.callback = callback;
}
phoneTimer.isFirst = true;
