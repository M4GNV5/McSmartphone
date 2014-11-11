function phoneScreen()
{
	this.position = {};
	this.position.x = 0;
	this.position.y = 0;
	this.position.z = 0;

	this.size = {};
	this.size.x = 9;
	this.size.y = 21;

	this.getPosition = function(x, y)
	{
		if(x > this.size.x || x < 0 || y > this.size.y || y < 0)
			throw "Invalid Position: x="+x+", y="+y;

		var output = new Phone.Vector3();
		output.x = this.position.x+x;
		output.y = this.position.y;
		output.z = this.position.z+y;

		return output;
	}
}