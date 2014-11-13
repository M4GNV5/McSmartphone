var Phone;

function intializeStatic()
{
	Phone = {};

	Phone.Color = phoneColors;
	Phone.Relative = phoneRelative;
	Phone.Vector2 = phoneVector2;
	Phone.Vector3 = phoneVector3;
}
function intialize()
{
	Phone.Renderer = new phoneRenderer();
	Phone.Touch = new phoneTouch();
	Phone.Screen = new phoneScreen();
	Phone.Structures = new phoneStructures();
}
