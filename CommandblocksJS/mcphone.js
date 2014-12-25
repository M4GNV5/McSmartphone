intializeStatic();
//
//Config variable setup
//
var preRenderPosition = new Phone.Vector3();
var phonePosition = new Phone.Vector3();
var screenSize = new Phone.Vector2();
var blockType;
var defaultColor;
var touchAcuracy;
//
//Configuration
//
blockType = "minecraft:wool"; //you can use stained_hardened_clay instead
defaultColor = Phone.Color.gray;

debugMode = true;

preRenderPosition.x = 1;
preRenderPosition.y = 10;
preRenderPosition.z = 16;

phonePosition.x = 1;
phonePosition.y = 15;
phonePosition.z = 16;

screenSize.x = 18;
screenSize.y = 32;

touchAcuracy = Math.round(screenSize.x / 10);

//
//Main Code
//
Phone.blockType = blockType;
Phone.defaultColor = defaultColor;

Phone.debugMode = debugMode;

Phone.compiletimeLog("Intializing Components");

intialize();

Phone.Renderer.nextpreRenderPos = preRenderPosition;
Phone.Screen.position = phonePosition;
Phone.Screen.size = screenSize;

Phone.compiletimeLog("Parsing App Code");

Phone.AppManager.intialize();

Phone.AppManager.start("Standby");

finalize();
