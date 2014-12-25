function phoneVector2(x, y)
{
	this.x = x || 0;
	this.y = y || 0;

	this.toString = function(splitter)
	{
		splitter = splitter || ' ';
		return this.x+splitter+this.y;
	}
	this.clone = function()
	{
		return new phoneVector2(this.x, this.y);
	}
}