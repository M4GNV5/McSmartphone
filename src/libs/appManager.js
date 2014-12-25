var phoneAppManager = new function()
{
	this.apps = [];
	this.currentApp;

	this.intialize = function()
	{
		this.currentApp = new RuntimeString();

		Phone.Renderer.delayRenderTime = false;
		for(var name in Phone.Apps)
		{
			var app = Phone.Apps[name];

			if(typeof app.intialize != 'function')
				throw "App '"+app+"' has no intialize function";
			else if(typeof app.start != 'function')
				throw "App '"+app+"' has no start function";
			else if(typeof app.stop != 'function')
				throw "App '"+app+"' has no stop function";

			app.intialize();
		}
		Phone.Renderer.delayRenderTime = true;

		var usedStructures = [];
		for(var i = 0; i < Phone.Renderer.structures.length; i++)
		{
			if(typeof Phone.Renderer.preRenderPos[i] != 'undefined')
				usedStructures.push(i);
		}

		var waitTime = Phone.Renderer.getMaxPreRenderTime(usedStructures) - Object.keys(Phone.Apps).length;
		if(waitTime > 0)
			delay(waitTime);
	}
	this.start = function(appName, stopCurrent, waitForStop)
	{
		Phone.runtimeLog("starting app "+appName);

		if(typeof Phone.Apps[appName] == 'undefined')
			throw "Cannot start App '"+appName+"' it does not exist!";


		var app = Phone.Apps[appName];

		call(function()
		{
			if(stopCurrent !== false && this.currentApp != 'undefined')
			{
				call(Phone.AppManager.stopCurrent);
				if(waitForStop !== false)
					delay(Object.keys(Phone.Apps).length+1);
			}

			Phone.AppManager.currentApp.set(appName);

			call(app.start);
		});
	}
	this.stopCurrent = function()
	{
		for(var name in Phone.Apps)
		{
			Phone.AppManager.currentApp.hasValue(name, function()
			{
				Phone.Apps[name].stop();
			});
		}
	}
}