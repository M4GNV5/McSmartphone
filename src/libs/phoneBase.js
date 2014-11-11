var Phone;

function intialize()
{
	Phone = {};
	Phone.Relative = phoneRelative;
	Phone.Renderer = new phoneRenderer();
	Phone.Screen = new phoneScreen();
	Phone.Structures = new phoneStructures();

	Phone.Vector2 = phoneVector2;
	Phone.Vector3 = phoneVector3;
}
