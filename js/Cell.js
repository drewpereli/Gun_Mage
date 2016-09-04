

function Cell(x, y){
	this.x = x;
	this.y = y;
	this.xPx = this.x * g.view.cellLength;
	this.yPx = this.y * g.view.cellLength;

	this.cellLength;

	this.ctxs = {
		//This gets filled in 'initialize'
	}

	this.clear = {//One element for each canvas. If this cell at a canvas is clear (i/e/ there is nothing drawn in it), it will be set to true at that canvas's element, so we don't waste power by clearing it again.
		//This gets filled in 'initialize' too.
	}

	this.lavaSquareLength = 8;
	
}




Cell.prototype.fillRect = function(color, ctxName)
{
	this.clear[ctxName] = false;
	var ctx = this.ctxs[ctxName];
	ctx.fillStyle = color;
	ctx.fillRect(this.xPx, this.yPx, this.cellLength, this.cellLength);
}



Cell.prototype.fillText = function(character, color, ctxName)
{
	this.clear[ctxName] = false;
	var ctx = this.ctxs[ctxName];
	ctx.fillStyle = color;
	ctx.fillText(character, this.xPx + this.cellLength / 2, this.yPx + this.cellLength / 2);
}




Cell.prototype.strokeRect = function(color, ctxName)
{
	this.clear[ctxName] = false;
	var ctx = this.ctxs[ctxName];
	ctx.strokeStyle = color;
	ctx.strokeRect(this.xPx + 1, this.yPx + 1, this.cellLength - 2, this.cellLength - 2);
}

Cell.prototype.strokeThickRect = function(color, ctxName)
{
	this.clear[ctxName] = false;
	var ctx = this.ctxs[ctxName];
	ctx.strokeStyle = color;
	var thickness = 2;
	for (var i = 1 ; i <= thickness ; i++)
	{
		ctx.strokeRect(this.xPx + i, this.yPx + i, this.cellLength - 2 * i, this.cellLength - 2 * i);
	}
}



//Experimental cool looking lava
Cell.prototype.fillLava = function()
{
	this.clear[ctxName] = false;
	var squareLength = this.lavaSquareLength;
	var ctx = this.ctxs.terrain;

	var tile = g.view.getTileFromCell(this);
	tile.lastLavaColors = [];
	for (var xPx = this.xPx ; xPx <= this.xPx + this.cellLength - squareLength ; xPx += squareLength)
	{
		var currLastColors = [];
		for (var yPx = this.yPx ; yPx <= this.yPx + this.cellLength - squareLength ; yPx += squareLength)
		{
			var color = 'rgb(' +  g.rand.nextInt(200, 256) + ', 50, 0)';
			ctx.fillStyle = color;
			ctx.fillRect(xPx, yPx, squareLength, squareLength);
			currLastColors.push(color);
		}
		tile.lastLavaColors.push(currLastColors);
	}
}


Cell.prototype.fillLavaLastSeen = function()
{
	this.clear[ctxName] = false;
	var tile = g.view.getTileFromCell(this);
	if (tile.lastLavaColors === false)
	{
		this.fillLava();
	}
	var squareLength = this.lavaSquareLength;
	var ctx = this.ctxs.terrain;

	var x = 0;
	for (var xPx = this.xPx ; xPx <= this.xPx + this.cellLength - squareLength ; xPx += squareLength)
	{
		var y = 0;
		for (var yPx = this.yPx ; yPx <= this.yPx + this.cellLength - squareLength ; yPx += squareLength)
		{
			var color = tile.lastLavaColors[x][y];
			ctx.fillStyle = color;
			ctx.fillRect(xPx, yPx, squareLength, squareLength);
			y++;
		}
		x++;
	}

}



Cell.prototype.clearRect = function(ctxName)
{
	if (this.clear[ctxName] === true)
		return;
	
	var ctx = this.ctxs[ctxName];
	ctx.clearRect(this.xPx, this.yPx, this.cellLength, this.cellLength);
	this.clear[ctxName] = true;
}


Cell.prototype.fullClear = function()
{
	for (var name in this.ctxs)
	{
		if (name === "terrain")
		{
			continue; //Don't clear the terrain canvas. WE're going to try just moving that around instead of fully clearing it unless we have to
		}
		this.clearRect(name);
	}
}




Cell.prototype.initialize = function()
{
	for (name in g.view.canvases)
	{
		var canvas = g.view.canvases[name];
		this.ctxs[name] = canvas.getContext('2d');
		this.clear[name] = false;
		//this.ctxs[name].font = g.fontSize + 'pt ' + g.fontFamily;
	}
	this.cellLength = g.view.cellLength;
}


