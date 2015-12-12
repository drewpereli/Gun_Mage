
function Tile(x, y){
	this.x = x;
	this.y = y;
	this.siblings = [false, false, false, false]; //Up, right, down, left. Will be set later
	this.terrain = "WALL";
	this.unit = false;
	this.item = false;
	this.spawnPoint = false; //Set to true if this is where the player is going to spawn
	this.message = false;

	this.destructable = true;
	this.blocksVision = true;
	this.blocksMovement = true;
	this.blocksNoise = true;
	this.forbidsMovement = true;//A lava tile for example won't block movement, but it will forbid it so the player/enemies can't walk into it.
	this.elevation = 1; //Can be 1 or 0. 

	this.light = "DARK"; //Dark, medium, bright
	this.isLightSource = false;

	this.noise = 0; //Represents the total noise at the tile

	this.seenByPlayer = false;//True if the tile has been seen by the player at some point

	//Tool variables. Not actual data or anything
	//this.changed = true; //Default to true
	this.propogated = false;
	//this.tempNoise = 0; No longer needed, because there will only be one source of noise per tick now.
	this.partOfLine = false; //Used for getting the tiles that fall within a line. For line of sight
	this.filled = false; //Only used when floodfilling during map generation.
	this.pathFound = false;//Used for pathfinding
	this.pathDistance = false;//Used for pathfinding

	this.lastLavaColors = [];
}



/*
Tile.prototype.propogateNoise = function(noise)
{
	if (noise <= 0)
	{
		return;
	}

	var pQ = []; //Propogate queue
	var setToPropogated = []; //So we can set them all back after
	var noiseDimension = this.noise.length;
	this.noise.push(noise);
	this.propogated = true;
	pQ.push(this);
	setToPropogated.push(this);
	while (pQ.length > 0)
	{
		var tile = pQ[0];
		var oldNoise = tile.noise[noiseDimension];
		if (oldNoise > 1){
			for (var i = 0 ; i < tile.siblings.length ; i++)
			{
				var sib = tile.siblings[i];
				if (sib.propogated === true)
				{
					continue;
				}
				if (sib.terrain === "WALL")
				{
					continue;
				}
				//If it hasn't been propogated
				var newNoise = tile.noise[noiseDimension] - 1;
				sib.noise[Number(noiseDimension)] = newNoise;
				//if (sib.noise > 100){console.log(sib.noise);}
				pQ.push(sib);
				sib.propogated = true;
				setToPropogated.push(sib);
			}
		}
		//Pop the tile
		pQ.splice(0, 1);
	}
	//Set propogated to false for all the tiles we propogated
	for (var i = 0 ; i < setToPropogated.length ; i++)
	{
		setToPropogated[i].propogated = false;
	}
}
*/

Tile.prototype.propogateNoise = function(noise)
{
	if (noise <= 0)
	{
		return;
	}

	this.noise = noise;
	var pQ = [this]; //Propogate queue
	//var setToPropogated = []; //So we can set them all back after
	//var noiseDimension = this.noise.length;
	//this.noise.push(noise);
	this.propogated = true;
	//setToPropogated.push(this);
	while (pQ.length > 0)
	{
		var tile = pQ[0];
		g.game.madeNoiseThisTick.push(tile); //Add to the game array that holds all the tiles that made noise this tick
		var oldNoise = tile.noise;
		if (oldNoise > 1)//If it's less than 1, new noise will be 0, which is the default noise anyway
		{
			for (var sibIndex = 0 ; sibIndex < 4 ; sibIndex++)
			{
				var sib = tile.siblings[sibIndex];
				if (sib.propogated === true)
				{
					continue;
				}
				if (sib.blocksNoise)
				{
					continue;
				}
				//If it hasn't been propogated
				sib.noise = oldNoise - 1;
				//if (sib.noise > 100){console.log(sib.noise);}
				pQ.push(sib);
				sib.propogated = true;
				//setToPropogated.push(sib);
			}
		}
		//Pop the tile
		pQ.splice(0, 1);
	}

	//Set propogated to false for all the tiles we propogated
	//Actually we'll do this in the tick method
	/*
	for (var i = 0 ; i < setToPropogated.length ; i++)
	{
		var t = setToPropogated[i];
		//var n = t.tempNoise;
		t.propogated = false;
		//t.noise += n
		//t.tempNoise = 0;
	}
	*/
}









//Sets or clears the unit from the tile
Tile.prototype.setUnit = function(unit)
{
	this.unit = unit;
	if (unit === false) this.setTerrain(this.terrain); //Simply reset the terrain to itself to restore the proper blocks movement, etc.
	else 
	{
		this.blocksMovement = true;
		this.forbidsMovement = true;
	}
}


Tile.prototype.setItem = function(item)
{
	this.item = item;
}



Tile.prototype.setMessage = function(message)
{
	this.message = message;
}


Tile.prototype.setElevation = function(el)
{
	this.elevation = el;
}




Tile.prototype.setTerrain = function(terrain){
	if (terrain === "OPEN")
	{
		this.terrain = "OPEN";
		this.blocksMovement = false;
		this.blocksVision = false;
		this.blocksNoise = false;
		this.forbidsMovement = false;
	}
	else if (terrain === "WALL")
	{
		this.terrain = "WALL";
		this.blocksVision = true;
		this.blocksMovement = true;
		this.blocksNoise = true;
		this.forbidsMovement = true;
	}
	else if (terrain === "STAIRSUP")
	{
		this.terrain = "STAIRSUP";
		this.blocksMovement = false;
		this.blocksVision = true;
		this.blocksNoise = false;
		this.forbidsMovement = false;
	}
	else if (terrain === "STAIRSDOWN")
	{
		this.terrain = "STAIRSDOWN";
		this.blocksMovement = false;
		this.blocksVision = true;
		this.blocksNoise = false;
		this.forbidsMovement = false;
	}
	else if (terrain === "SPAWNPOINT")
	{
		this.spawnPoint = true;
		this.setTerrain("OPEN");
	}
	else if (terrain === 'ORB')
	{
		this.terrain = "ORB";
		this.blocksMovement = false;
		this.blocksVision = false;
		this.blocksNoise = false;
		this.forbidsMovement = false;
	}
	else if (terrain === 'INDESTRUCTIBLEWALL')
	{
		this.destructable = false;
	}
	else if (terrain === 'LAVA')
	{
		this.terrain = 'LAVA';
		this.blocksMovement = false;
		this.blocksVision = false;
		this.blocksNoise = false;
		this.forbidsMovement = true;

	}
}






Tile.prototype.getDistance = function(tile)
{
	var x1 = this.x;
	var y1 = this.y;
	var x2 = tile.x;
	var y2 = tile.y;
	var dY = y2 - y1;
	var dX = x2 - x1;
	var distance = dY * dY + dX * dX;
	return Math.sqrt(distance);
}


Tile.prototype.getRoundDistance = function(tile)
{
	return Math.round(this.getDistance(tile));
}



/*
Tile.prototype.rotateKeepWithinMap = function(axisTile, angle)
{
	var s = Math.sin(angle);
	var c = Math.cos(angle);

	var newX = c * (this.x - axisTile.x) - s * (this.y - axisTile.y) + axisTile.x;
	var newY = s * (this.x - axisTile.x) + c * (this.y - axisTile.y) + axisTile.y;
	newX = Math.round(newX);
	newY = Math.round(newY);
	if (newX >= g.game.level.width)
	{
		newX = g.game.level.width - 1;
	}
	else if (newX < 0)
	{
		newX = 0;
	}
	if (newY >= g.game.level.height)
	{
		newY = g.game.level.height - 1;
	}
	else if (newY < 0)
	{
		newY = 0;
	}

	
	if (isNaN(newX))
	{
		console.log(axisTile)
		console.log(angle)
		console.log(g.game.player.direction)
	}
	
	var returnTile = g.game.level.getTile(newX, newY);
	return returnTile;
}
*/



Tile.prototype.setSiblings = function(){
	for (var i = 0 ; i < 4 ; i++){
		var xDiff = 0;
		var yDiff = 0;
		switch (i)
		{
			case 0:
				yDiff = -1;
				break;
			case 1:
				xDiff = 1;
				break;
			case 2:
				yDiff = 1;
				break;
			case 3:
				xDiff = -1;
				break;
		}
		var sibling = g.game.level.getTile(this.x + xDiff, this.y + yDiff);
		this.siblings[i] = sibling; //getTile will return false if the sibling doesn't exist
	}
}





Tile.prototype.setLight = function(light)
{
	this.light = light;
}




Tile.prototype.setAsLightSource = function()
{
	this.isLightSource = true;
	this.light = 'BRIGHT';

	for (var x = this.x - g.mediumRadius ; x <= this.x + g.mediumRadius ; x++)
	{
		for (var y = this.y - g.mediumRadius ; y <= this.y + g.mediumRadius ; y++)
		{
			var canSeeTile = true;
			var t = g.game.level.getTile(x, y);
			if (t === false)
			{
				continue;
			}
			/*
			if (t.blocksVision === true)
			{
				continue;
			}
			*/
			var distance = this.getDistance(t);
			if (distance > g.mediumRadius) //If it's too far to be lit up anyway
			{
				continue;
			}
			//If it's a real tile that doesn't block vision
			tilesBetween = this.getTilesBetween(t);
			var E = tilesBetween.length;
			for (var i = 0 ; i < tilesBetween.length ; i++)
			{
				var tBetween = tilesBetween[i];
				if (tBetween === t)
				{
					continue;
				}
				if (tBetween.blocksVision === true)
				{
					canSeeTile = false;
					break;
				}
			}
			if (canSeeTile === false)
			{
				continue;
			}
			//If it's a tile within line of site of this tile, see how far it is. We know it's not farther than medium radius
			if (distance > g.brightRadius)
			{//Only set it if it's dark. We don't want to set a tile that's been set to 'BRIGHT' by another source to be set to medium
				if (t.light === 'DARK')
				{
					t.light = 'MEDIUM';
				}
			}
			else
			{
				t.light = 'BRIGHT';
			}
		}
	}
}






Tile.prototype.getTilesOnLine = function(angle, range)
{
	//console.log(angle);
	var sin;
	var cos;
	if (angle === Math.PI / 2)
	{
		cos = 0;
		sin = 1;
	}
	else if (angle === Math.PI)
	{
		sin = 0;
		cos = -1;	
	}
	else if (angle === -.5 * Math.PI)
	{
		sin = -1;
		cos = 0;
	}
	else
	{
		sin = Math.sin(angle);
		cos = Math.cos(angle);

		var roundingMultiplier = 1000000000;
		//Round them to 9 decimal points
		sin = Math.round(sin * roundingMultiplier) / roundingMultiplier;
		cos = Math.round(cos * roundingMultiplier) / roundingMultiplier;

	}
	var xDiff = cos * range;
	var yDiff = sin * range;
	var x2 = this.x + xDiff;
	var y2 = this.y + yDiff;
	if (range > 99999999)
	{
		x2 = Math.round(x2);
		y2 = Math.round(y2);
	}
	return this.getTilesBetweenXY(x2, y2, range);
}




/*
//xParam and yParam can be out of the map. 
//Range can be false. It will simply go to the end of the map
Tile.prototype.getTilesBetweenXY2 = function(xParam, yParam, range)
{
	var x1 = this.x;
	var y1 = this.y;
	var x2 = xParam;
	var y2 = yParam;

	x1 += .5;
	y1 += .5;
	x2 += .5;
	y2 += .5;
	//Set our tile to visible
	this.partOfLine = true;
	tilesLookedAt = [];
	//If it's a vertical line
	if (x2 === x1)
	{
		var yIncrement = y2 - y1 > 0 ? 1 : -1 ;
		var done = false;
		var x = Math.floor(x1);
		for (var y = Math.floor(y1) ; done === false ; y += yIncrement)
		{
			var currTile = g.game.level.getTile(x, y);
			if (currTile === false) //If x and y are out of range
			{
				break;
			}
			if (range !== false)
			{
				var distance = this.getRoundDistance(currTile);
				if (distance > range)
				{
					break;
				}
			}
			
			if (currTile.partOfLine) //If we have looked at the tile already/if
			{
				continue;
			}
			tilesLookedAt.push(currTile);
			currTile.partOfLine = true;
		}
		//Reset visible to false
		var E = tilesLookedAt.length;
		for (var i = 0 ; i < E ; i++)
		{
			tilesLookedAt[i].partOfLine = false;
		}
		this.partOfLine = false;
		//if (g.game.state === "AIMING"){console.log(x1 + ', ' + y1 + ', ' + x2 + ', ' + y2);}
		return tilesLookedAt;
	}

	var m = (y2 - y1) / (x2 - x1);
			
	var b = y1 - m * x1;
	var aspectRatio = Math.abs(m);
	var increment;
	//increment = aspectRatio >= 1 ? .025 : .05; //Alternative increment strategy
	
	if (aspectRatio === 0)
	{
		increment = 1;
	}
	else
	{
		increment = 1 / (aspectRatio * 4);
	}
	if (increment > .25)
	{
		increment = .25;
	}

	
	increment *= x2 - x1 > 0 ? 1 : -1 ;
	var done = false; //If there's a range, done will be set to true once we exceed it. Else, done will be set to true once we've reached the end of the map.
	for (var x = x1 ; done === false ; x += increment)
	{
		var y = m * x + b;
		var currX = Math.floor(x);
		var currY = Math.floor(y);

		
		if (m === -1)
		{
			var xDiff = currX - this.x;
			var yDiff = currY - this.y;

			if (Math.abs(xDiff) !== Math.abs(yDiff))
			{
				continue;
			}
		}
		

		var currTile = g.game.level.getTile(currX, currY);

		if (currTile === false)
		{
			break;
		}

		if (range)
		{
			var distance = this.getDistance(currTile);
			if (distance > range)
			{
				break;
			}
		}
		
		if (currTile.partOfLine) //If we've already looked at it
		{
			continue;
		}
		tilesLookedAt.push(currTile);
		currTile.partOfLine = true;
	}
	//Reset visible to false
	var E = tilesLookedAt.length;
	for (var i = 0 ; i < E ; i++)
	{
		tilesLookedAt[i].partOfLine = false;
	}
	this.partOfLine = false;

	return tilesLookedAt;
}
*/





function getTilesBetweenCoords(x1st, y1st, x2nd, y2nd, range)
{
	
	var x1 = x1st;
	var y1 = y1st;
	var x2 = x2nd;
	var y2 = y2nd;


	x1 += .5;
	y1 += .5;
	x2 += .5;
	y2 += .5;
	//Set our tile to visible
	var start = g.game.level.getTile(Math.floor(x1), Math.floor(y1))
	start.partOfLine = true;
	tilesLookedAt = [];
	//If it's a vertical line
	if (x2 === x1)
	{
		var yIncrement = y2 - y1 > 0 ? 1 : -1 ;
		var done = false;
		var x = Math.floor(x1);
		for (var y = Math.floor(y1) ; done === false ; y += yIncrement)
		{
			var currTile = g.game.level.getTile(x, y);
			if (currTile === false) //If x and y are out of range
			{
				break;
			}
			if (range !== false)
			{
				var distance = getDistance(x1, y1, currX, currY);
				if (distance > range)
				{
					break;
				}
			}
			
			if (currTile.partOfLine) //If we have looked at the tile already/if
			{
				continue;
			}
			tilesLookedAt.push(currTile);
			currTile.partOfLine = true;
		}
		//Reset visible to false
		var E = tilesLookedAt.length;
		for (var i = 0 ; i < E ; i++)
		{
			tilesLookedAt[i].partOfLine = false;
		}
		start.partOfLine = false;
		//if (g.game.state === "AIMING"){console.log(x1 + ', ' + y1 + ', ' + x2 + ', ' + y2);}
		return tilesLookedAt;
	}


	var functionOfX = true; //True if we're doing the equation as a function of x
	var m = (y2 - y1) / (x2 - x1);
	
	if (x2 - x1 > 0 && y2 - y1 > 0)
	{
		
		return getTilesBetweenCoords(x2nd, y2nd, x1st, y1st, range).reverse();
		
	}
	
	
	var b;

	if (Math.abs(m) > 1)
	{
		functionOfX = false;
	}
			
	var b = y1 - m * x1;


	var increment = 1;
	if (functionOfX)
	{	
		
		increment *= x2 - x1 > 0 ? 1 : -1 ;
	}
	else
	{
		
		increment *= y2 - y1 > 0 ? 1 : -1 ;
	}

	var done = false; //If there's a range, done will be set to true once we exceed it. Else, done will be set to true once we've reached the end of the map.
	
	if (functionOfX === true)
	{
		for (var x = x1 ; done === false ; x += increment)
		{
			var y = m * x + b;
			var currX = Math.floor(x);
			var currY = Math.floor(y);
			/*
			if (m === -1)
			{
				var xDiff = currX - this.x;
				var yDiff = currY - this.y;

				if (Math.abs(xDiff) !== Math.abs(yDiff))
				{
					continue;
				}
			}
			*/

			var currTile = g.game.level.getTile(currX, currY);



			if (currTile === false)
			{
				break;
			}

			if (range)
			{
				var distance = getDistance(x1, y1, currX, currY);
				if (distance > range)
				{
					break;
				}
			}
			
			if (currTile.partOfLine) //If we've already looked at it
			{
				continue;
			}
			tilesLookedAt.push(currTile);
			currTile.partOfLine = true;
		}
	}
	else //If it's a function of y
	{
		for (var y = y1 ; done === false ; y += increment)
		{
			var x = (y - b) / m;
			var currY = Math.floor(y);
			var currX = Math.floor(x);

			/*
			if (m === -1)
			{
				var xDiff = currX - this.x;
				var yDiff = currY - this.y;

				if (Math.abs(xDiff) !== Math.abs(yDiff))
				{
					continue;
				}
			}
			*/

			/*
			if (isNaN(x))
			{
				console.log(y + ', ' + b + ', ' + m);
			}
			*/

			var currTile = g.game.level.getTile(currX, currY);

			if (currTile === false)
			{
				break;
			}

			if (range)
			{
				var distance = getDistance(x1, y1, currX, currY);
				if (distance > range)
				{
					break;
				}
			}
			
			if (currTile.partOfLine) //If we've already looked at it
			{
				continue;
			}
			tilesLookedAt.push(currTile);
			currTile.partOfLine = true;
		}
	}
	//Make sure this tile and the target tile are added
	/*
	var endTile = g.game.level.getTile(xParam, yParam);
	if (endTile && endTile.partOfLine === false)
	{
		tilesLookedAt.push(endTile);
	}
	*/
	//Reset visible to false
	var E = tilesLookedAt.length;
	for (var i = 0 ; i < E ; i++)
	{
		tilesLookedAt[i].partOfLine = false;
	}
	start.partOfLine = false;



	return tilesLookedAt;
}





/*
//Uses different functions depending on the slope to optimize it
//xParam and yParam can be out of the map. 
//Range can be false. It will simply go to the end of the map
Tile.prototype.getTilesBetweenXY99 = function(xParam, yParam, range)
{
	
	var x1 = this.x;
	var y1 = this.y;
	var x2 = Math.round(xParam);
	var y2 = Math.round(yParam);


	x1 += .5;
	y1 += .5;
	x2 += .5;
	y2 += .5;

	x1 = round(x1, 5);
	y1 = round(y1, 5);
	x2 = round(x2, 5);
	y2 = round(y2, 5);
	//Set our tile to visible
	this.partOfLine = true;
	tilesLookedAt = [];
	//If it's a vertical line
	if (x2 === x1)
	{
		var yIncrement = y2 - y1 > 0 ? 1 : -1 ;
		var done = false;
		var x = Math.floor(x1);
		for (var y = Math.floor(y1) ; done === false ; y += yIncrement)
		{
			var currTile = g.game.level.getTile(x, y);
			if (currTile === false) //If x and y are out of range
			{
				break;
			}
			if (range !== false)
			{
				var distance = this.getRoundDistance(currTile);
				if (distance > range)
				{
					break;
				}
			}
			
			if (currTile.partOfLine) //If we have looked at the tile already/if
			{
				continue;
			}
			tilesLookedAt.push(currTile);
			currTile.partOfLine = true;
		}
		//Reset visible to false
		var E = tilesLookedAt.length;
		for (var i = 0 ; i < E ; i++)
		{
			tilesLookedAt[i].partOfLine = false;
		}
		this.partOfLine = false;
		//if (g.game.state === "AIMING"){console.log(x1 + ', ' + y1 + ', ' + x2 + ', ' + y2);}
		return tilesLookedAt;
	}


	var functionOfX = true; //True if we're doing the equation as a function of x
	var m = (y2 - y1) / (x2 - x1);
	m = round(m, 5);
	

	
	
	var b;

	if (Math.abs(m) > 1)
	{
		functionOfX = false;
	}
			
	var b = y1 - m * x1;


	var increment = 1;
	if (functionOfX)
	{	
		
		increment *= x2 - x1 > 0 ? 1 : -1 ;
	}
	else
	{
		
		increment *= y2 - y1 > 0 ? 1 : -1 ;
	}

	var done = false; //If there's a range, done will be set to true once we exceed it. Else, done will be set to true once we've reached the end of the map.
	
	if (functionOfX === true)
	{
		
		
		for (var x = x1 ; done === false ; x += increment)
		{
			var y = (m * x) + b;

			var currX = Math.floor(x);
			var currY;

			if (m < 0)
			{
				currY = Math.ceil(y - 1);
			}
			else
			{
				currY = Math.floor(y);
			}
			

			var currTile = g.game.level.getTile(currX, currY);



			if (currTile === false)
			{
				break;
			}

			if (range)
			{
				var distance = this.getDistance(currTile);
				if (distance > range)
				{
					break;
				}
			}
			
			if (currTile.partOfLine) //If we've already looked at it
			{
				continue;
			}
			tilesLookedAt.push(currTile);
			currTile.partOfLine = true;
		}
	}
	else //If it's a function of y
	{
		for (var y = y1 ; done === false ; y += increment)
		{
			var x = (y - b) / m;
			var currY = Math.floor(y);
			var currX = Math.floor(x);

			if (m < 0)
			{
				currX = Math.ceil(x - 1);
			}
			else
			{
				currX = Math.floor(x);
			}

			

			

			var currTile = g.game.level.getTile(currX, currY);

			if (currTile === false)
			{
				break;
			}

			if (range)
			{
				var distance = this.getDistance(currTile);
				if (distance > range)
				{
					break;
				}
			}
			
			if (currTile.partOfLine) //If we've already looked at it
			{
				continue;
			}
			tilesLookedAt.push(currTile);
			currTile.partOfLine = true;
		}
	}
	//Make sure this tile and the target tile are added
	var endTile = g.game.level.getTile(xParam, yParam);
	if (endTile && endTile.partOfLine === false)
	{
		tilesLookedAt.push(endTile);
	}
	//Reset visible to false
	var E = tilesLookedAt.length;
	for (var i = 0 ; i < E ; i++)
	{
		tilesLookedAt[i].partOfLine = false;
	}
	this.partOfLine = false;

	return tilesLookedAt;
}

*/








Tile.prototype.getTilesBetweenXY = function(xParam, yParam, range)
{
	var x1 = Math.round(xParam);
	var y1 = Math.round(yParam);
	var x0 = this.x;
	var y0 = this.y;

	var dx = Math.abs(x1-x0);
	var dy = Math.abs(y1-y0);
	var sx = (x0 < x1) ? 1 : -1;
	var sy = (y0 < y1) ? 1 : -1;
	var err = dx-dy;

	var returnArray = [];	

	while(true){

		var t = g.game.level.getTile(x0, y0);
		if (t === false){break;}
		if (this.getDistance(t) > range){break;}

		returnArray.push(t);

	 	if ((x0==x1) && (y0==y1)){ break;}
	 	var e2 = 2*err;
	 	if (e2 >-dy)
	 	{ 
	 		err -= dy; 
	 		x0 += sx; 
	 	}
	 	if (e2 < dx)
	 	{ 
	 		err += dx; 
	 		y0 += sy; 
	 	}
	}

	return returnArray;
}





/*
//This one uses rotation
//xParam and yParam can be out of the map. 
//Range can be false. It will simply go to the end of the map
Tile.prototype.getTilesBetweenXY5 = function(xParam, yParam, range)
{
	
	var x1 = this.x;
	var y1 = this.y;
	var x2 = xParam;
	var y2 = yParam;


	x1 += .5;
	y1 += .5;
	x2 += .5;
	y2 += .5;

	x1 = round(x1, 5);
	y1 = round(y1, 5);
	x2 = round(x2, 5);
	y2 = round(y2, 5);

	//See if we need to rotate it
	

	//If it's a vertical line
	if (x2 === x1)
	{
		this.partOfLine = true;
		var tilesLookedAt = [];
		var yIncrement = y2 - y1 > 0 ? 1 : -1 ;
		var done = false;
		var x = Math.floor(x1);
		for (var y = Math.floor(y1) ; done === false ; y += yIncrement)
		{
			var currTile = g.game.level.getTile(x, y);
			if (currTile === false) //If x and y are out of range
			{
				break;
			}
			if (range !== false)
			{
				var distance = this.getRoundDistance(currTile);
				if (distance > range)
				{
					break;
				}
			}

			if (currTile.partOfLine) //If we have looked at the tile already/if
			{
				continue;
			}
			tilesLookedAt.push(currTile);
			currTile.partOfLine = true;
		}
		//Reset visible to false
		var E = tilesLookedAt.length;
		for (var i = 0 ; i < E ; i++)
		{
			tilesLookedAt[i].partOfLine = false;
		}
		this.partOfLine = false;
		//if (g.game.state === "AIMING"){console.log(x1 + ', ' + y1 + ', ' + x2 + ', ' + y2);}
		return tilesLookedAt;
	}


	var xDiff = x2 - x1;
	var yDiff = y2 - y1;
	var quadrant = 'BOTTOMRIGHT';
	if (xDiff >= 0 && yDiff < 0) //If it's the top right quadrant
	{
		y2 += 2 * Math.abs(yDiff);
		quadrant = 'TOPRIGHT';
	}
	else if (xDiff < 0 && yDiff < 0) //If it's the top left quadrant
	{
		x2 += 2 * Math.abs(xDiff);
		y2 += 2 * Math.abs(yDiff);
		quadrant = 'TOPLEFT';
	}
	else if (xDiff < 0 && yDiff >= 0) //If it's the bottom left quadrant
	{
		x2 += 2 * Math.abs(xDiff);
		rotateAngle = Math.PI / 2;
		quadrant = 'BOTTOMLEFT';
	}
	

	var coordsLookedAt = [];




	var functionOfX = true; //True if we're doing the equation as a function of x
	var m = (y2 - y1) / (x2 - x1);
	m = round(m, 5);
	
	
	
	var b;

	if (Math.abs(m) > 1)
	{
		functionOfX = false;
	}
			
	var b = y1 - m * x1;


	var increment = 1;
	if (functionOfX)
	{	
		increment *= x2 - x1 > 0 ? 1 : -1 ;
	}
	else
	{
		increment *= y2 - y1 > 0 ? 1 : -1 ;
	}

	var done = false; //If there's a range, done will be set to true once we exceed it. Else, done will be set to true once we've reached the end of the map.
	
	if (functionOfX === true)
	{
		
		
		for (var x = x1 ; done === false ; x += increment)
		{
			var y = (m * x) + b;

			var currX = Math.floor(x);
			var currY = Math.floor(y);
			var currCoord = {x: currX, y: currY};

			if (range)
			{
				var distance = getDistance(this.x, this.y, currX, currY);
				//distance = Math.round(distance);
				if (distance > range)
				{
					break;
				}
			}
			
			if (coordsLookedAt.indexOf(currCoord) !== -1) //If we've already looked at it
			{
				continue;
			}
			coordsLookedAt.push(currCoord);
		}
	}
	else //If it's a function of y
	{
		for (var y = y1 ; done === false ; y += increment)
		{
			var x = (y - b) / m;
			var currY = Math.floor(y);
			var currX = Math.floor(x);
			var currCoord = {x: currX, y: currY};

			if (range)
			{
				var distance = getDistance(this.x, this.y, currX, currY);
				//distance = Math.round(distance);
				if (distance > range)
				{
					break;
				}
			}
			
			if (coordsLookedAt.indexOf(currCoord) !== -1) //If we've already looked at it
			{
				continue;
			}
			coordsLookedAt.push(currCoord);
		}
	}
	//Make sure this tile and the target tile are added

	var tilesLookedAt = [];
	for (var i = 0 ; i < coordsLookedAt.length ; i++)
	{
		var coord = coordsLookedAt[i];
		
		var x = coord.x;
		var y = coord.y;
		var newYDiff = y - this.y;
		var newXDiff = x - this.x;

		
		if (quadrant === 'TOPRIGHT')
		{
			y -= 2 * Math.abs(newYDiff);
		}
		else if (quadrant === 'TOPLEFT')
		{
			x -= 2* Math.abs(newXDiff);
			y -= 2 * Math.abs(newYDiff);
		}
		else if (quadrant === 'BOTTOMLEFT')
		{
			x -= 2* Math.abs(newXDiff);
		}
		
		
		var tile = g.game.level.getTile(x, y);
		if (tile === false)
		{
			break;
		}

		tilesLookedAt.push(tile);
	}

	//Add the end tile if it's not part of it already
	var end = g.game.level.getTile(Math.round(xParam), Math.round(yParam));
	if (end !== false && tilesLookedAt.indexOf(end) === -1)
	{
		tilesLookedAt.push(end);
	}
	//Remove the start tile
	if (tilesLookedAt.indexOf(this) !== -1)
	{
		var index = tilesLookedAt.indexOf(this);
		tilesLookedAt.splice(index, 1);
	}

	return tilesLookedAt;
}

*/













//Returns an array of the tiles between the unit tile and the tile passed as a paramater
Tile.prototype.getTilesBetween = function(tile)
{
	return this.getTilesBetweenXY(tile.x, tile.y, this.getRoundDistance(tile));
}













/*
//Returns all the tiles within the cone facing direction, within angle, and coser than range
//DirectionFaced can be UP, RIGHT, DOWN, and LEFT as well as an angle. 
Tile.prototype.getTilesWithinCone1 = function(directionFaced, spreadAngle, range)
{
	//Set directionAngle to a number of directionFaced is up, down, left, or right
	var rotationAngle;
	var additionalAngle = 0;
	if (directionFaced === 'UP')
	{
		rotationAngle = 3 * Math.PI / 2;
	}
	else if (directionFaced === 'RIGHT')
	{
		rotationAngle = 0;
	}
	else if (directionFaced === 'DOWN')
	{
		rotationAngle = Math.PI / 2;
	}
	else if (directionFaced === 'LEFT')
	{
		rotationAngle = Math.PI;
	}
	else
	{
		rotationAngle = directionFaced;
	}
	//Assume direction is 1 (right), then rotate if necessary
	var coneUnrotated = [];
	for (var x = this.x - range ; x <= this.x + range ; x++)
	{
		for (var y = this.y - range ; y <=this.y + range ; y++)
		{
			var distance = getDistance(this.x, this.y, x, y);
			distance = Math.round(distance);
			if (distance > range)
			{
				continue;
			}
			//If the tile is within range
			var tileAngle = this.getAngle(x, y);
			if (tileAngle > spreadAngle / 2 + additionalAngle || tileAngle < spreadAngle / -2 + additionalAngle)
			{
				continue;
			}
			//Else, add the coordinates to the cone
			coneUnrotated.push({x:x, y:y});
		}
	}
	//Rotate the cone accordingly
	
	var cone = [];
	for (var i = 0 ; i < coneUnrotated.length ; i++)
	{
		var coord = coneUnrotated[i];
		coord = rotateKeepWithinMap(coord.x, coord.y, this.x, this.y, rotationAngle);
		var t = g.game.level.getTile(coord.x, coord.y);
		if (cone.indexOf(t) === -1)
		{
			cone.push(t);
		}
	}
	//The rotation gets fucked up if it's not a cardinal direction
	//Quick fix. Go through the square of possible tiles. If the tile has three siblings that are cone, add it
	//We only need to do this if we didn't give a cardinal direction
	if (typeof directionFaced === 'number')
	{

		for (var x = this.x - range ; x <= this.x + range ; x++)
		{
			for (var y = this.y - range ; y <=this.y + range ; y++)
			{
				var tile = g.game.level.getTile(x, y);
				if (tile === false)
				{
					continue;
				}
				if (cone.indexOf(tile) !== -1)
				{
					continue;
				}
				//If it's a legit tile that's not already in the cone
				var numberOfSibsInCone = 0; //If there are three sibs 
				for (var i = 0 ; i < tile.siblings.length ; i++)
				{
					var sib = tile.siblings[i];
					if (cone.indexOf(sib) !== -1)
					{
						numberOfSibsInCone++;
					}
				}
				if (numberOfSibsInCone >= 3)
				{
					cone.push(tile);
				}
			}
		}
	}

	return cone;
}
*/




//Angles are in radians
Tile.prototype.getTilesWithinCone = function(directionFaced, spreadAngle, range)
{
		//Set directionAngle to a number of directionFaced is up, down, left, or right
	var directionAngle;
	if (directionFaced === 'UP')
	{
		directionAngle = -1 * Math.PI / 2;
	}
	else if (directionFaced === 'RIGHT')
	{
		directionAngle = 0;
	}
	else if (directionFaced === 'DOWN')
	{
		directionAngle = Math.PI / 2;
	}
	else if (directionFaced === 'LEFT')
	{
		directionAngle = Math.PI;
	}
	else
	{
		directionAngle = directionFaced;
	}

	//If spread angle is 0, return a line approximation
	//Just assume for now that we're looking at selected tile
	if (spreadAngle === 0)
	{
		var tilesInBetween = this.getTilesOnLine(directionFaced, range);
		return tilesInBetween;
	}

	var halfSpreadAngle = spreadAngle / 2;
	var maxAngle;//The min angle that a tile must be to be relative to this tile within the cone
	var minAngle;//The max angle that a tile must be to be within the cone
	//Set default isInCone function
	var isInCone = function(ang)//Function, returns whether or not the tile is in the cone or not
	{
		if (ang >= minAngle && ang <= maxAngle)
		{
			return true;
		}
		return false;
	} 

	if (directionAngle - halfSpreadAngle < -1 * Math.PI)
	{
		var angleDiff = (directionAngle - halfSpreadAngle) - -1 * Math.PI;
		minAngle = Math.PI - Math.abs(angleDiff);
		maxAngle = directionAngle + halfSpreadAngle;
		isInCone = function(ang)
		{
			if (ang >= minAngle)//In this case, as long as ang is between min angle and 180 we know it's good. Since ang cant be greater than 180, we only have to check if it's greater than min ang
			{
				return true;
			}
			if (ang <= maxAngle)
			{
				return true;
			}
			return false;
		}

	}
	else
	{
		minAngle = directionAngle - halfSpreadAngle;
		//Condition will be different depending on max angle situation
	}

	if (directionAngle + halfSpreadAngle > Math.PI)
	{
		var angleDiff = (directionAngle + halfSpreadAngle) - Math.PI;
		maxAngle = -1 * Math.PI + angleDiff;
		//Min angle is already set
		isInCone = function(ang)
		{
			if (ang >= minAngle)//In this case, as long as ang is between min angle and 180 we know it's good. Since ang cant be greater than 180, we only have to check if it's greater than min ang
			{
				return true;
			}
			if (ang <= maxAngle)
			{
				return true;
			}
			return false;
		}
	}
	else
	{
		maxAngle = directionAngle + halfSpreadAngle;
	}

	var cone = [];
	for (var x = this.x - Math.ceil(range)  ; x <= this.x + Math.ceil(range) ; x++)
	{
		for (var y = this.y - Math.ceil(range) ; y <= this.y + Math.ceil(range) ; y++)
		{
			var tile = g.game.level.getTile(x, y);
			if (tile === false)//If x or y is out of range and it's not a real tile, continue;
			{
				continue;
			}

			var distance = this.getDistance(tile);
			//distance = Math.round(distance);
			if (distance > range)//If the tile is out of range
			{
				continue;
			}

			//Check each corner of the tile. If any of the angle are within the range, add it
			for (var angInd = 0 ; angInd < 9 ; angInd++)
			{
				var xAdd = 0;
				var yAdd = 0;

				switch (angInd)
				{
					case 0:
						xAdd = -.5;
						yAdd = -.5;
						break;
					case 1:
						xAdd = .5;
						yAdd = -.5;
						break;
					case 2:
						xAdd = -.5;
						yAdd = .5;
						break;
					case 3:
						xAdd = .5;
						yAdd = .5;
						break;
					case 4:
						xAdd = -.5;
						yAdd = 0;
						break;
					case 5:
						xAdd = .5;
						yAdd = 0;
						break;
					case 6:
						xAdd = 0;
						yAdd = -.5;
						break;
					case 7:
						xAdd = 0;
						yAdd = .5;
						break;
					case 8:
						break;
				}

				var xTest = tile.x + xAdd;
				var yTest = tile.y + yAdd;

				var tileAng = this.getAngle(xTest, yTest);
				if (isInCone(tileAng))
				{
					cone.push(tile);
					break;
				}
			}

			/*
			var tileAng = this.getAngleFromTile(tile);
			if (isInCone(tileAng) === false)//If it's not in the cone
			{
				continue;
			}
			cone.push(tile);
			*/
		}
	}
	
	//console.log(radiansToDegrees())

	return cone;
}




Tile.prototype.getCoordsOnConeEdge = function(directionFaced, spreadAngle, range)
{
		//Set directionAngle to a number of directionFaced is up, down, left, or right
	var directionAngle;
	if (directionFaced === 'UP')
	{
		directionAngle = -1 * Math.PI / 2;
	}
	else if (directionFaced === 'RIGHT')
	{
		directionAngle = 0;
	}
	else if (directionFaced === 'DOWN')
	{
		directionAngle = Math.PI / 2;
	}
	else if (directionFaced === 'LEFT')
	{
		directionAngle = Math.PI;
	}
	else
	{
		directionAngle = directionFaced;
	}

	//If spread angle is 0, return a line approximation
	//Just assume for now that we're looking at selected tile
	/*
	if (spreadAngle === 0)
	{
		var tilesInBetween = this.getTilesOnLine(directionFaced, range);
		return tilesInBetween;
	}
	*/

	var halfSpreadAngle = spreadAngle / 2;
	var maxAngle;//The min angle that a tile must be to be relative to this tile within the cone
	var minAngle;//The max angle that a tile must be to be within the cone
	//Set default isInCone function
	var isInCone = function(ang)//Function, returns whether or not the tile is in the cone or not
	{
		if (ang >= minAngle && ang <= maxAngle)
		{
			return true;
		}
		return false;
	} 

	if (directionAngle - halfSpreadAngle < -1 * Math.PI)
	{
		var angleDiff = (directionAngle - halfSpreadAngle) - -1 * Math.PI;
		minAngle = Math.PI - Math.abs(angleDiff);
		maxAngle = directionAngle + halfSpreadAngle;
		isInCone = function(ang)
		{
			if (ang >= minAngle)//In this case, as long as ang is between min angle and 180 we know it's good. Since ang cant be greater than 180, we only have to check if it's greater than min ang
			{
				return true;
			}
			if (ang <= maxAngle)
			{
				return true;
			}
			return false;
		}

	}
	else
	{
		minAngle = directionAngle - halfSpreadAngle;
		//Condition will be different depending on max angle situation
	}

	if (directionAngle + halfSpreadAngle > Math.PI)
	{
		var angleDiff = (directionAngle + halfSpreadAngle) - Math.PI;
		maxAngle = -1 * Math.PI + angleDiff;
		//Min angle is already set
		isInCone = function(ang)
		{
			if (ang >= minAngle)//In this case, as long as ang is between min angle and 180 we know it's good. Since ang cant be greater than 180, we only have to check if it's greater than min ang
			{
				return true;
			}
			if (ang <= maxAngle)
			{
				return true;
			}
			return false;
		}
	}
	else
	{
		maxAngle = directionAngle + halfSpreadAngle;
	}




	var cone = [];
	for (var x = this.x - range  ; x <= this.x + range ; x++)
	{
		for (var y = this.y - range ; y <= this.y + range ; y++)
		{
			var coord = {x: x, y: y};
			var distance = getDistance(this.x, this.y, coord.x, coord.y);
			if (Math.round(distance) !== Math.round(range))//If the tile is out of range
			{
				continue;
			}

			//Check each corner of the tile. If any of the angle are within the range, add it
			
			for (var angInd = 0 ; angInd < 1 ; angInd++)
			{
				var xAdd = 0;
				var yAdd = 0;


				switch (angInd)
				{
					case 0:
						xAdd = -.5;
						yAdd = -.5;
						break;
					case 1:
						xAdd = .5;
						yAdd = -.5;
						break;
					case 2:
						xAdd = -.5;
						yAdd = .5;
						break;
					case 3:
						xAdd = .5;
						yAdd = .5;
						break;
					case 4:
						xAdd = -.5;
						yAdd = 0;
						break;
					case 5:
						xAdd = .5;
						yAdd = 0;
						break;
					case 6:
						xAdd = 0;
						yAdd = -.5;
						break;
					case 7:
						xAdd = 0;
						yAdd = .5;
						break;
					case 8:
						break;
				}
				

				var xTest = coord.x;// + xAdd;
				var yTest = coord.y;// + yAdd;

				var tileAng = this.getAngle(xTest, yTest);
				if (isInCone(tileAng))
				{
					cone.push(coord);
					break;
				}
			}

			/*
			var tileAng = this.getAngleFromTile(tile);
			if (isInCone(tileAng) === false)//If it's not in the cone
			{
				continue;
			}
			cone.push(tile);
			*/
		}
	}
	
	//console.log(radiansToDegrees())

	return cone;
}








//Returns the angle of tile relative to this tile. Between Pi and -Pi
Tile.prototype.getAngleFromTile = function(tile)
{
	var xDiff = tile.x - this.x;
	var yDiff = tile.y - this.y;
	return Math.atan2(yDiff, xDiff);
}


//Gets the angle of of the line betwen tile and (x, y) relative to a horizontal line
Tile.prototype.getAngle = function(x, y)
{
	var xDiff = x - this.x;
	var yDiff = y - this.y;
	return Math.atan2(yDiff, xDiff);
}







