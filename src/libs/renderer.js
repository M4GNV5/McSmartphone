function phoneRenderer()
{
	this.structures = [];

	this.prerenderPos = [];
	this.nextPrerenderPos = {};

	this.registerStructure = function(structure)
	{
		if(this.structures.indexOf(structure) == -1)
			this.structures.push(structure);

		return this.structures.indexOf(structure);
	}
	this.preRender = function(id, delayRenderTime)
	{
		if(typeof this.prerenderPos[id] != 'undefined')
			return;

		callOnce(function()
		{
			var pos = Phone.Renderer.prerenderPos[id];
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

		if(delayRenderTime !== false)
			delay(renderLength);

		var pos = this.nextPrerenderPos;
		this.prerenderPos[id] = new Phone.Vector3(pos.x, pos.y, pos.z);
		this.prerenderPos[id].xLength = structure.length;
		this.prerenderPos[id].zLength = structure[0].length;

		this.nextPrerenderPos.x += structure.length+1;

		return renderLength;
	}
	this.preRenderMultiple = function(ids)
	{
		var maxRenderLength = 0;
		for(var i = 0; i < ids.length; i++)
		{
			var renderLength = this.preRender(ids[i]);
			if(renderLength > maxRenderLength)
				maxRenderLength = renderLength;
		}

		delay(maxRenderLength - ids.length);
	}

	this.getPreRenderPos = function(id)
	{
		if(typeof this.structures[id] == 'undefined')
			throw "Invalid Structure ID: "+id;

		var edge1 = this.prerenderPos[id];
		var edge2 = new Phone.Vector3(edge1.x, edge1.y, edge1.z);
		edge2.x += edge1.zLength - 1;
		edge2.z += edge1.xLength - 1;

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

	this.setColor = function(id, color, oldColor)
	{
		if(typeof this.structures[id] == 'undefined')
			throw "Invalid Structure ID: "+id;

		color = color || Phone.defaultColor;
		oldColor = oldColor || '';

		var pos = this.getPreRenderPos(id);

		command("fill "+pos[0]+" "+pos[1]+" "+Phone.blockType+" "+color+" replace "+Phone.blockType+" "+oldColor);
	}

	this.renderTo = function(id, pos, color)
	{
		if(typeof this.structures[id] == 'undefined')
			throw "Invalid Structure ID: "+id;

		if(typeof this.prerenderPos[id] == 'undefined')
			Phone.Renderer.preRender(id);

		if(typeof color != 'undefined')
			this.setColor(id, color);

		var prepos = this.getPreRenderPos(id);

		command("clone "+prepos[0]+" "+prepos[1]+" "+pos+" masked replace");
	}
}
