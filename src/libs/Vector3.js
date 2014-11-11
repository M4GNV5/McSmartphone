function phoneVector3(x, y, z)
{
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;

	this.toString = function(splitter)
	{
		splitter = splitter || ' ';
		return this.x+splitter+this.y+splitter+this.z;
	}
}