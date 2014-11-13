function phoneStructures()
{
	var num = [];

	num[0] = [
		[Phone.defaultColor, Phone.defaultColor, Phone.defaultColor],
		[Phone.defaultColor, -1, Phone.defaultColor],
		[Phone.defaultColor, -1, Phone.defaultColor],
		[Phone.defaultColor, -1, Phone.defaultColor],
		[Phone.defaultColor, Phone.defaultColor, Phone.defaultColor]
	];
	num[1] = [
		[-1, -1, Phone.defaultColor],
		[-1, -1, Phone.defaultColor],
		[-1, -1, Phone.defaultColor],
		[-1, -1, Phone.defaultColor],
		[-1, -1, Phone.defaultColor]
	];
	num[2] = [
		[Phone.defaultColor, Phone.defaultColor, Phone.defaultColor],
		[-1, -1, Phone.defaultColor],
		[Phone.defaultColor, Phone.defaultColor, Phone.defaultColor],
		[Phone.defaultColor, -1, -1],
		[Phone.defaultColor, Phone.defaultColor, Phone.defaultColor]
	];
	num[3] = [
		[Phone.defaultColor, Phone.defaultColor, Phone.defaultColor],
		[-1, -1, Phone.defaultColor],
		[Phone.defaultColor, Phone.defaultColor, Phone.defaultColor],
		[-1, -1, Phone.defaultColor],
		[Phone.defaultColor, Phone.defaultColor, Phone.defaultColor]
	];
	num[4] = [
		[Phone.defaultColor, -1, Phone.defaultColor],
		[Phone.defaultColor, -1, Phone.defaultColor],
		[Phone.defaultColor, Phone.defaultColor, Phone.defaultColor],
		[-1, -1, Phone.defaultColor],
		[-1, -1, Phone.defaultColor]
	];
	num[5] = [
		[Phone.defaultColor, Phone.defaultColor, Phone.defaultColor],
		[Phone.defaultColor, -1, -1],
		[Phone.defaultColor, Phone.defaultColor, Phone.defaultColor],
		[-1, -1, Phone.defaultColor],
		[Phone.defaultColor, Phone.defaultColor, Phone.defaultColor]
	];
	num[6] = [
		[Phone.defaultColor, Phone.defaultColor, Phone.defaultColor],
		[Phone.defaultColor, -1, -1],
		[Phone.defaultColor, Phone.defaultColor, Phone.defaultColor],
		[Phone.defaultColor, -1, Phone.defaultColor],
		[Phone.defaultColor, Phone.defaultColor, Phone.defaultColor]
	];
	num[7] = [
		[Phone.defaultColor, Phone.defaultColor, Phone.defaultColor],
		[-1, -1, Phone.defaultColor],
		[-1, -1, Phone.defaultColor],
		[-1, -1, Phone.defaultColor],
		[-1, -1, Phone.defaultColor]
	];
	num[8] = [
		[Phone.defaultColor, Phone.defaultColor, Phone.defaultColor],
		[Phone.defaultColor, -1, Phone.defaultColor],
		[Phone.defaultColor, Phone.defaultColor, Phone.defaultColor],
		[Phone.defaultColor, -1, Phone.defaultColor],
		[Phone.defaultColor, Phone.defaultColor, Phone.defaultColor]
	];
	num[9] = [
		[Phone.defaultColor, Phone.defaultColor, Phone.defaultColor],
		[Phone.defaultColor, -1, Phone.defaultColor],
		[Phone.defaultColor, Phone.defaultColor, Phone.defaultColor],
		[-1, -1, Phone.defaultColor],
		[Phone.defaultColor, Phone.defaultColor, Phone.defaultColor]
	];

	this.number0 = Phone.Renderer.registerStructure(num[0]);
	this.number1 = Phone.Renderer.registerStructure(num[1]);
	this.number2 = Phone.Renderer.registerStructure(num[2]);
	this.number3 = Phone.Renderer.registerStructure(num[3]);
	this.number4 = Phone.Renderer.registerStructure(num[4]);
	this.number5 = Phone.Renderer.registerStructure(num[5]);
	this.number6 = Phone.Renderer.registerStructure(num[6]);
	this.number7 = Phone.Renderer.registerStructure(num[7]);
	this.number8 = Phone.Renderer.registerStructure(num[8]);
	this.number9 = Phone.Renderer.registerStructure(num[9]);
}