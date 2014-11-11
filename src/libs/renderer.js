function phoneRenderer()
{
	this.structures = [];
	this.functions = [];

	this.prerenderPos = [];
	this.nextPrerenderPos = {};

	this.registerStructure = function(structure)
	{
		if(this.structures.indexOf(structure) == -1)
			this.structures.push(structure);

		return this.structures.indexOf(structure);
	}
	this.prerender = function(id)
	{
		var structure = this.structures[id];
		var pos = this.nextPrerenderPos;

		callOnce(function()
		{
			var rBuilder = new Phone.Relative(pos);

			for(var x = 0; x < structure.length; x++)
			{
				for(var y = 0; y < structure[x].length; y++)
				{
					if(structure[x][y] > -1)
					{
						rBuilder.command("setblock ~-"+x+" ~ ~"+y+" minecraft:stained_hardened_clay "+structure[x][y]+" replace");
					}
				}
			}
		});

		pos.xLength = structure.length;
		pos.zLength = structure[0].length;
		this.prerenderPos[id] = pos;

		this.nextPrerenderPos.x += structure.length+1;
	}

	this.renderTo = function(id, pos)
	{
		if(typeof this.structures[id] == 'undefined')
			throw "Invalid Structure ID: "+id;

		if(typeof this.prerenderPos[id] == 'undefined')
			Phone.Renderer.prerender(id);

		var edge1 = this.prerenderPos[id];
		var edge2 = new Phone.Vector3(edge1.x, edge1.y, edge1.z);
		edge2.x -= edge1.xLength - 1;
		edge2.z += edge1.zLength - 1;

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

		command("clone "+final1+" "+final2+" "+pos+" masked");
	}
}
