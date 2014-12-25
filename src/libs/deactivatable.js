function phoneDeactivatable(name)
{
	var options = {};
	options.name = name || Naming.next("deactivatable");
	this.enabled = new RuntimeBoolean();

	this.enable = function()
	{
		this.enabled.set(true);
	}
	this.disable = function()
	{
		this.enabled.set(false);
	}
	this.isEnabled = function(callback)
	{
		var is = this.enabled.isTrue();

		if(typeof callback != 'undefined')
			validate(is, callback);

		return is;
	}
	this.isEnabledSync = function()
	{
		var is = this.isEnabled();
		validateSync(is);
	}
}
phoneDeactivatable.applyTo = function(obj, deactivatable)
{
	deactivatable = deactivatable || new Phone.Deactivatable();
	for(var child in deactivatable)
	{
		if(deactivatable.hasOwnProperty(child))
			obj[child] = deactivatable[child];
	}
}
