function phoneRenderer()
{
	this.structures = [];

	this.preRenderPos = [];
	this.nextpreRenderPos = {};

	this.delayRenderTime = true;

	this.registerStructure = function(structure)
	{
		if(this.structures.indexOf(structure) == -1)
			this.structures.push(structure);

		return this.structures.indexOf(structure);
	}
	this.preRender = function(id, delayRenderTime)
	{
		if(typeof this.preRenderPos[id] != 'undefined')
			return;

		var structure = this.structures[id];

		var renderLength = this.getPreRenderTime(id);

		if(delayRenderTime !== false && this.delayRenderTime !== false)
			delay(renderLength);

		var pos = this.nextpreRenderPos;
		this.preRenderPos[id] = new Phone.Vector3(pos.x, pos.y, pos.z);
		this.preRenderPos[id].xLength = structure.length;
		this.preRenderPos[id].zLength = structure[0].length;

		this.nextpreRenderPos.x += structure.length+1;

		callOnce(function()
		{
			var pos = Phone.Renderer.preRenderPos[id];
			var structure = Phone.Renderer.structures[id];

			var rBuilder = new Phone.Relative(pos);

			for(var x = 0; x < structure.length; x++)
			{
				for(var y = 0; y < structure[x].length; y++)
				{
					if(structure[x][y] > -1)
					{
						rBuilder.command("setblock ~"+y+" ~ ~"+x+" "+Phone.blockType+" "+structure[x][y]+" replace");
					}
				}
			}
			rBuilder.dispose();
		});

		return renderLength;
	}
	this.preRenderMultiple = function(ids, delayRenderTime)
	{
		var maxRenderLength = 0;
		for(var i = 0; i < ids.length; i++)
		{
			var renderLength = this.preRender(ids[i]);
			if(renderLength > maxRenderLength)
				maxRenderLength = renderLength;
		}

		if(delayRenderTime !== false && this.delayRenderTime !== false)
			delay(maxRenderLength - ids.length);
	}
	this.getPreRenderTime = function(id)
	{
		var structure = this.structures[id];

		var renderLength = 3;
		for(var x = 0; x < structure.length; x++)
		{
			for(var y = 0; y < structure[x].length; y++)
			{
				if(structure[x][y] > -1)
				{
					renderLength++;
				}
			}
		}

		return renderLength;
	}
	this.getMaxPreRenderTime = function(ids)
	{
		var maxTime = 0;
		for(var i = 0; i < ids.length; i++)
		{
			var time = this.getPreRenderTime(ids[i]);

			if(time > maxTime)
				maxTime = time;
		}
		return maxTime;
	}

	this.sortVector3 = function(edge1, edge2)
	{
		var final1 = new Phone.Vector3(
			(edge1.x < edge2.x) ? edge1.x : edge2.x,
			(edge1.y < edge2.y) ? edge1.y : edge2.y,
			(edge1.z < edge2.z) ? edge1.z : edge2.z
		);
		var final2 = new Phone.Vector3(
			(edge1.x > edge2.x) ? edge1.x : edge2.x,
			(edge1.y > edge2.y) ? edge1.y : edge2.y,
			(edge1.z > edge2.z) ? edge1.z : edge2.z
		);

		return [final1, final2];
	}

	this.getpreRenderPos = function(id)
	{
		if(typeof this.structures[id] == 'undefined')
			throw "Invalid Structure ID: "+id;

		var edge1 = this.preRenderPos[id];
		var edge2 = new Phone.Vector3(edge1.x, edge1.y, edge1.z);
		edge2.x += edge1.zLength - 1;
		edge2.z += edge1.xLength - 1;

		sorted = this.sortVector3(edge1, edge2);

		return sorted;
	}

	this.setColor = function(id, color, oldColor, placeRepeater)
	{
		if(typeof this.structures[id] == 'undefined')
			throw "Invalid Structure ID: "+id;

		color = color || Phone.defaultColor;
		oldColor = oldColor || '';

		var pos = this.getpreRenderPos(id);

		command("fill "+pos[0]+" "+pos[1]+" "+Phone.blockType+" "+color+" replace "+Phone.blockType+" "+oldColor, placeRepeater);
	}

	this.renderTo = function(id, x, y, options)
	{
		options = options || {};

		if(typeof this.structures[id] == 'undefined')
			throw "Invalid Structure ID: "+id;

		if(typeof this.preRenderPos[id] == 'undefined')
			Phone.Renderer.preRender(id);

		if(typeof options.color != 'undefined'  && options.color !== false)
			this.setColor(id, options.color, options.placeRepeater);

		var prepos = this.getpreRenderPos(id);

		var pos = Phone.Screen.getPosition(x, y);

		command("clone "+prepos[0]+" "+prepos[1]+" "+pos+" masked replace", options.placeRepeater);
	}
	this.renderAs = function(id, selector, options)
	{
		options = options || {};

		if(typeof this.structures[id] == 'undefined')
			throw "Invalid Structure ID: "+id;

		if(typeof selector == 'undefined')
			throw "Cannot renderAs without a selector!";

		if(typeof this.preRenderPos[id] == 'undefined')
			Phone.Renderer.preRender(id);

		if(typeof options.color != 'undefined')
			this.setColor(id, options.color, options.placeRepeater);

		var prepos = this.getpreRenderPos(id);

		command("execute "+selector+" ~ ~ ~ clone "+prepos[0]+" "+prepos[1]+" ~ ~ ~ masked replace", options.placeRepeater);
	}
}
