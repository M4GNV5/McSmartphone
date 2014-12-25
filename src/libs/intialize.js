var Phone;

function intializeStatic()
{
	Phone = {};

	Phone.finalize = [];

	Phone.Color = phoneColors;
	Phone.Relative = phoneRelative;
	Phone.Vector2 = phoneVector2;
	Phone.Vector3 = phoneVector3;
	Phone.Timer = phoneTimer;
	Phone.Deactivatable = phoneDeactivatable;

	Phone.AppManager = phoneAppManager;

	Phone.compiletimeLog = function(message)
	{
		if(Phone.debugMode !== false)
			api.log(message);
	}
	Phone.runtimeLog = function(message)
	{
		if(Phone.debugMode !== false)
			say(message);
	}
}
function intialize()
{
	Phone.Renderer = new phoneRenderer();
	Phone.Touch = new phoneTouch();
	Phone.Screen = new phoneScreen();
	Phone.Structures = new phoneStructures();

	Phone.Apps = {};
	for(var name in phoneApps)
	{
		Phone.Apps[name] = new phoneApps[name]();
	}
}

function finalize()
{
	for(var i = 0; i < Phone.finalize.length; i++)
	{
		Phone.finalize[i]();
	}
}
