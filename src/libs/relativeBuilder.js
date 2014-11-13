function phoneRelative(pos)
{
	this.name = Naming.next("relative");

	pos = pos || new Phone.Vector3();
	pos.x = pos.x || '~';
	pos.y = pos.y || '~';
	pos.z = pos.z || '~';

	this.selector = '@e[name='+this.name+']';

	command('summon ArmorStand '+pos+' {CustomName:"'+this.name+'",NoGravity:true}');

	this.moveTo = function(newPos, placeRepeater)
	{
		command('tp '+this.selector+' '+newPos, placeRepeater);
	}
	this.move = function(amount, placeRepeater)
	{
		command('execute '+this.selector+' ~ ~ ~ tp '+this.selector+' ~'+amount.x+' ~'+amount.y+' ~'+amount.z, placeRepeater);
	}
	this.command = function(cmd, placeRepeater)
	{
		command('execute '+this.selector+' ~ ~ ~ '+cmd, placeRepeater);
	}
	this.dispose = function()
	{
		command('kill '+this.selector);
	}
}