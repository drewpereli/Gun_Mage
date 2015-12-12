
function Level(width, height, depth){
	
	this.width = width;
	this.height = height;

	this.tiles = [];

	this.numberOfLightSources;

	this.items = [];
	this.guns = [];
	this.initialEnemies = [];
	this.numberOfEnemies;
	this.percentOfEnemiesSleeping = 1; //The percentage of enemies sleeping when the level is generated


	this.numberOfGuns = 0;
	this.numberOfHelmets = 0;
	this.numberOfArmors = 0;

	this.currentDepth = depth;

	//this.roomCenters = [];

	this.spawnTile = false;

	//TEST
	//this.TESTTABLE = document.createElement('table');
	//TEST
}




Level.prototype.setNumberOfLightSources = function()
{
	var min = (this.width + this.height) / 10;
	min = Math.round(min);
	var max = (this.width + this.height) / 5;
	max = Math.round(max);
	this.numberOfLightSources = g.rand.nextInt(min, max);
}



Level.prototype.setNumberOfEnemies = function()
{
	if (g.game.DEBUG.numberOfEnemies !== false)
	{
		this.numberOfEnemies = g.game.DEBUG.numberOfEnemies;
		return;
	}
	if (this.currentDepth === 1)
	{
		this.numberOfEnemies = 0;
		return;
	}
	var multiplier = this.currentDepth + g.rand.next(1, (this.currentDepth + 2) / 2);
	var numberOfEnemies = Math.pow(multiplier, 1.5);
	numberOfEnemies = Math.round(numberOfEnemies)
	this.numberOfEnemies = numberOfEnemies;

	//Not really necessary, good for debugging though
	//return this.numberOfEnemies;
}

Level.prototype.setNumberOfItems = function()
{
	var guns;
	var helmets;
	var armors;
	if (this.currentDepth === 1)
	{
		guns = g.rand.nextInt(3, 4);
		helmets = g.rand.nextInt(3, 4);
		armors = g.rand.nextInt(3, 4)
	}
	else
	{
		guns = g.rand.nextInt(0, 4);
		helmets = g.rand.nextInt(0, 4);
		armors = g.rand.nextInt(0, 4)
	}


	this.numberOfGuns = guns;
	this.numberOfHelmets = helmets;
	this.numberOfArmors = armors;
}





Level.prototype.generateBlankDungeon = function()
{

	for (var x = 0 ; x < this.width ; x++)
		{
			for (var y = 0 ; y < this.height ; y++)
			{
				var t = this.getTile(x, y);
				if (x === 0 || y === 0 || x === this.width - 1 || y === this.height - 1)
				{
					t.setTerrain('WALL');
				}
				else 
				{
					t.setTerrain('OPEN');
				}
			}
		}
		//Set a random spanw tile
		var start = this.getRandomOpenTile();
		start.setTerrain("SPAWNPOINT");
		this.spawnTile = start;

		if (g.game.DEBUG.enemiesInBlankDungeon)
		{
			var numberOfEnemies = g.game.DEBUG.enemiesInBlankDungeon;
			for (var i = 0 ; i < numberOfEnemies ; i++)
			{
				var tile = this.getRandomUnoccupiedOpenTile();
				//
				//ENEMY GOES HERE
				//
				//
				var currEnemy = new g.constructors.Zombie();
				//
				//
				//
				//
				var behavior = g.rand.next(0, 1) < this.percentOfEnemiesSleeping ? 'SLEEPING' : 'WANDERING';
				g.game.spawnUnit(currEnemy, tile, behavior);
			}
		}
}


/*
Level.prototype.generate1 = function(){
	//If we're using the debugger to make a blank dungeon
	if (g.game.DEBUG.blankDungeon === true)
	{
		for (var x = 0 ; x < this.width ; x++)
		{
			for (var y = 0 ; y < this.height ; y++)
			{
				var t = this.getTile(x, y);
				if (x === 0 || y === 0 || x === this.width - 1 || y === this.height - 1)
				{
					t.setTerrain('WALL');
				}
				else 
				{
					t.setTerrain('OPEN');
				}
			}
		}
		//Set a random spanw tile
		var start = this.getTile(g.rand.nextInt(1, this.width), g.rand.nextInt(1, this.height));
		start.setTerrain("SPAWNPOINT");
		this.spawnTile = start;

		if (g.game.DEBUG.enemiesInBlankDungeon)
		{
			var numberOfEnemies = g.game.DEBUG.enemiesInBlankDungeon;
			for (var i = 0 ; i < numberOfEnemies ; i++)
			{
				var tile = this.getRandomUnoccupiedTile();
				//
				//ENEMY GOES HERE
				//
				//
				var currEnemy = new g.constructors.Zombie();
				//
				//
				//
				//
				var behavior = g.rand.next(0, 1) < this.percentOfEnemiesSleeping ? 'SLEEPING' : 'WANDERING';
				g.game.spawnUnit(currEnemy, tile, behavior);
			}
		}


		return;
	}



	//
	//
	//get number of enemies
	


	var widthHeightMean = Math.round((this.width + this.height) / 2);

	var numberOfBigRooms = 6;
	var bigRoomLengthMin = Math.round(widthHeightMean / 7.5);
	var bigRoomLengthMax = Math.round(widthHeightMean / 4.5);
	var bigRoomSeperationMin = 10; //Minimum amount of distance between two big rooms

	var numberOfSmallRooms = 100;
	var smallRoomLengthMin = 3;
	var smallRoomLengthMax = Math.round(widthHeightMean / 9);
	var smallRoomSeperationMin = 0; //Minimum amount of distance between two small rooms

	var minOpenTileProportion = .2; //Minimum ratio of flood-filled open tiles to total tiles
	var minimumStairDistance = Math.round(widthHeightMean / 1.7); //Minimum distance between to the two staircases
	var redoDungeon = false; //Set to true if we need to start over
	var dungeonAttempts = 0;
	do
	{
		redoDungeon = false;
		dungeonAttempts++
		if (dungeonAttempts >= 20)
		{
			console.log('weve already tries 10 times');
			break;
		}
		//Generate the rooms
		for (var bigOrSmall = 0 ; bigOrSmall < 2 ; bigOrSmall++)
		{
			//BigOrSmall === 0 ? Big rooms : Small rooms;
			var numberOfRooms = bigOrSmall === 0 ? numberOfBigRooms : numberOfSmallRooms;
			var roomLengthMin = bigOrSmall === 0 ? bigRoomLengthMin : smallRoomLengthMin;
			var roomLengthMax = bigOrSmall === 0 ? bigRoomLengthMax : smallRoomLengthMax;
			roomSeperationMin = bigOrSmall === 0 ? bigRoomSeperationMin : smallRoomSeperationMin;
			for (var roomNumber = 0 ; roomNumber < numberOfRooms ; roomNumber++){
				var roomWidth = g.rand.nextInt(roomLengthMin, roomLengthMax);
				var roomHeight = g.rand.nextInt(roomLengthMin, roomLengthMax);
				//Find a place to put it where it won't intersect with any other rooms, or be directly next to one
				var x;//X of the top left corner of the room
				var y;//Y of the top left corner of the room
				var foundPlacement = false;
				var attempts = 0; //Number of times we've tried to place the room
				while (foundPlacement === false){
					attempts++;
					if (attempts > 100){
						break;
					}
					var tryAgain = false;

					var xTest = g.rand.nextInt(1, this.width - roomWidth - 1); //Start at 1 to ensure there's a border of walls around the entire level
					var yTest = g.rand.nextInt(1, this.height - roomHeight - 1);
					//Check to see if there are any open tiles where the room will be placed
					for (var i = xTest - roomSeperationMin ; i < xTest + roomWidth + roomSeperationMin ; i++)
					{
						for (var j = yTest - roomSeperationMin ; j < yTest + roomHeight + roomSeperationMin ; j++)
						{
							//If the cordinates are out of range, it's because of the room sepeartion minimum making i or j go over.
							//In that case, continue
							if (i < 0 || i >= this.width || j < 0 || j >= this.height){
								continue;
							}
							var currTile = this.getTile(i, j);
							//If there's an open tile in the way, break and try again
							if (currTile.terrain === "OPEN"){
								tryAgain = true;
								break;
							}
						}
						if (tryAgain == true){
							break;
						}
					}
					if (tryAgain === true){
						continue;
					}
					//else we can place the room
					foundPlacement = true;
					for (var i = xTest ; i < xTest + roomWidth ; i++)
					{
						for (var j = yTest ; j < yTest + roomHeight ; j++)
						{
							var currTile = this.getTile(i, j);
							currTile.setTerrain("OPEN");
						}
					}
				}
				//Room placed
			}
		}
		var dungeonLargeEnough = false; //Set to true once we flood fill if there are enough flood-filled tiles
		var attempts = 0;
		do
		{	
			attempts++;
			if (attempts > 10)
			{
				redoDungeon = true;
				this.reinitialize();
				break;
			}
			//Flood fill from a random tile, get fill in everything that isn't flood filled.
			var randomStartingTile;
			do
			{
				var randX = g.rand.nextInt(0, this.width);
				var randY = g.rand.nextInt(0, this.height);
				randomStartingTile = this.getTile(randX, randY);
			}
			while(randomStartingTile.terrain !== "OPEN")

			var filled = this.floodFillFromTile(randomStartingTile);
			var openTileProportion = filled.length / (this.width * this.height);
			if (openTileProportion >= minOpenTileProportion)
			{
				dungeonLargeEnough = true;
			}
			else {
				//Unfill all the filled tiles
				for (var i = 0 ; i < filled.length ; i++)
				{
					filled[i].filled = false;
				}
			}
		}
		while (dungeonLargeEnough === false)
		//Continue if we need to redo the dungeon
		if (redoDungeon === true){
			continue;
		}
		//Clear all the unfilled tiles, and set the edge walls to indestructable 
		for (var x = 0 ; x < this.width ; x++)
		{
			for (var y = 0 ; y < this.height ; y++)
			{
				var currTile = this.getTile(x, y);
				if (currTile.filled === false)
				{
					currTile.setTerrain("WALL");
					if (currTile.siblings.indexOf(false) !== -1)//If the wall has at least one false sibling, we know it's an edge wall
					{
						currTile.destructable = false;
					}
				}
			}
		}

		//Place the stairs
		/*
		var stairsUp;
		var stairsDown;
		var foundStairs = false;
		var stairsAttempts = 0;
		do
		{
			stairsAttempts++;
			if (stairsAttempts > 10)
			{
				redoDungeon = true;
				break;
			}
			stairsDown = this.getRandomOpenTile();
			var foundStairsUp = false;
			var stairsUpAttempts = 0;
			//If it's the first level, no need to make stairsUp
			do
			{
				stairsUpAttempts++;
				if (stairsUpAttempts > 10)
				{
					break;
				}
				stairsUp = this.getRandomOpenTile();
				var distance = stairsUp.getDistance(stairsDown);
				if (distance >= minimumStairDistance)
				{
					foundStairsUp = true;
					foundStairs = true;
				}
			}
			while(foundStairsUp === false)
		}
		while(foundStairs === false)

		stairsDown.setTerrain("STAIRSDOWN");
		stairsUp.setTerrain("SPAWNPOINT");
		this.spawnTile = stairsUp;
		*/
	/*
	}
	while(redoDungeon === true)

}

*/











//var PRINTED = false;
//Alternative dungeon generation
Level.prototype.generate = function()
{
	//var numberOfRooms = g.rand.nextInt(10, 16);
	var numberOfRooms = Math.pow(this.height * this.width, .35) - g.rand.nextInt(0, 3);
	numberOfRooms = Math.round(numberOfRooms);
	var minNumberOfRoomProportion = 1; //this x numberOfRooms = threshold for dungeon failure
	var actualRoomsPlaced = 0;
	var roomLengthMin = 4;
	var roomLengthMax = Math.pow(this.height * this.width, .3);
	roomLengthMax = Math.round(roomLengthMax);
	if (roomLengthMax < 5){roomLengthMax = 5;}
	
	/*
	if (PRINTED === false)
	{
		console.log("rooms: " + numberOfRooms);
		console.log("length: " + roomLengthMax);
		PRINTED = true;
	}
	*/

	var roomBuffer = 2; //Minimum distance between rooms

	var roomCenters = [];

	for (var roomIndex = 0 ; roomIndex < numberOfRooms ; roomIndex++)
	{
		roomBuffer = g.rand.nextInt(1, 4);
		var roomPlaced = false;
		var attemptsToPlaceRoom = 0;
		var maxAttemptsToPlaceRoom = 50;
		do
		{
			var height = g.rand.nextInt(roomLengthMin, roomLengthMax);
			var width = g.rand.nextInt(roomLengthMin, roomLengthMax);
			var roomTiles = []; //Array of tiles that the room occupies
			//Find a place to put the room
			var startingX = g.rand.nextInt(0, this.width); 
			var startingY = g.rand.nextInt(0, this.height);
			for (var xInd = startingX ; xInd < startingX + this.width ; xInd++)
			{
				for (var yInd = startingY ; yInd < startingY + this.height ; yInd++)
				{
					var x = xInd % this.width;
					var y = yInd % this.height;

					//If the tile is too close to the edges, continue.
					if (x < roomBuffer || y < roomBuffer)
					{
						continue;
					}
					if (x >= this.width - roomBuffer - width || y >= this.height - roomBuffer - height)
					{
						continue;
					}


					var couldNotPlaceRoom = false;
					//Try to place the room here
					for (var currX = x - roomBuffer ; currX < x + width + roomBuffer ; currX++)
					{
						for (var currY = y - roomBuffer ; currY < y + height + roomBuffer ; currY++)
						{
							var currTile = this.getTile(currX, currY);

							if (currTile.terrain === 'OPEN')
							{
								couldNotPlaceRoom = true;
								roomTiles = [];
								break;
							}

							if (currX < x || currX >= x + width)
							{
								continue;
							}
							if (currY < y || currY >= y + height)
							{
								continue;
							}
							//If we're here, the tile is viable
							roomTiles.push(currTile);
						}

						if (couldNotPlaceRoom)
						{
							break;
						}
					}

					if (couldNotPlaceRoom)
					{
						continue;
					}

					//If we're here, the room can be placed
					//Place the room
					for (var roomTileIndex = 0 ; roomTileIndex < roomTiles.length ; roomTileIndex++)
					{
						var roomTile = roomTiles[roomTileIndex];
						roomTile.setTerrain('OPEN');
					}

					//Random chance to add some features to the room
					if (g.rand.next(0, 1) < .7)
					{

						for (var cAInd = 0 ; cAInd < g.rand.nextInt(3, 5) ; cAInd++)
						{
							for (var roomTileIndex = 0 ; roomTileIndex < roomTiles.length ; roomTileIndex++)
							{
								var roomTile = roomTiles[roomTileIndex];
								//Look at the 8x8 square around the tile. If 4 or more are walls, give it a chance to beceom a wall
								var numberOfWalls = 0;
								var numberOfOpenTiles = 0;
								for (var tSX = roomTile.x - 1 ; tSX <= roomTile.x + 1 ; tSX++) //tileSquareX
								{
									for (var tSY = roomTile.y - 1 ; tSY <= roomTile.y + 1 ; tSY++)
									{
										var sibTile = g.game.level.getTile(tSX, tSY);
										if (sibTile.terrain === 'WALL')
										{
											numberOfWalls++;
										}
										else
										{
											numberOfOpenTiles++;
										}
									}
								}

								if (numberOfOpenTiles >= 4)
								{
									if (g.rand.next(0, 1) < .5)
									{
										roomTile.setTerrain('OPEN');
									}
								}
								if (numberOfWalls >= 4)
								{
									if (g.rand.next(0, 1) < .5)
									{
										roomTile.setTerrain('WALL');
									}
								}
							}
						}
					}


					roomCenters.push(
							{
								x: Math.round(x + width / 2),
								y: Math.round(y + height / 2),
							}
						)
					roomPlaced = true;
					actualRoomsPlaced++;
					break;
					
				}

				if (roomPlaced)
				{
					break;
				}
			}

			attemptsToPlaceRoom++;
		}
		while (roomPlaced === false && attemptsToPlaceRoom < maxAttemptsToPlaceRoom)

	}

	if (actualRoomsPlaced < minNumberOfRoomProportion * numberOfRooms) //If we didn't generate at least 3/4s of the desired rooms, return false
	{
		return false;
	}


	for (var i = 0 ; i < roomCenters.length ; i++)
	{
		var center1 = roomCenters[i];
		var center2;
		var center3;

		
		if (i === roomCenters.length - 1)
		{
			center2 = roomCenters[0];
			center3 = roomCenters[1];
		}
		else if (i === roomCenters.length - 2)
		{
			center3 = roomCenters[0];
		}
		else
		{
			center2 = roomCenters[i + 1];
			center3 = roomCenters[i + 2];
		}
		



		if (g.rand.next(0, 1) < .9)
		{
			this.connectPoints(center1, center2);
		}
		else
		{
			this.drunkConnectPoints(center1, center2);
		}
		if (g.rand.next(0, 1) < .0)
		{
			if (g.rand.next(0, 1) < .9)
			{
				this.connectPoints(center1, center3);
			}
			else
			{
				this.drunkConnectPoints(center1, center3);
			}
		}
	}

	var fill = this.floodFillFromTile(this.getTile(roomCenters[0].x, roomCenters[0].y));
	var allTiles = this.getTiles();

	for (var i = 0 ; i < allTiles.length ; i++)
	{
		var t = allTiles[i];
		if (fill.indexOf(t) === -1)
		{
			t.setTerrain('WALL');
		}
	}

	
	//Use voronoi diagrams thing to set some of the cells to lava
	//First, get 10 lava cells. Then get 10 wall cells
	var walls = [];
	var lavaTiles = [];
	var numberOfWallTiles = 10;
	var numberOfLavaTiles = this.currentDepth;
	for (var i = 0 ; i < numberOfWallTiles ; i++)
	{
		var wall;
		do
		{
			wall = this.getRandomWallTile();
		}
		while (walls.indexOf(wall) !== -1 && wall.destructable === true)

		walls.push(wall);
	}

	for (var i = 0 ; i < numberOfLavaTiles ; i++)
	{
		var lava;
		do
		{
			lava = this.getRandomWallTile();
		}
		while (lavaTiles.indexOf(lava) !== -1 || walls.indexOf(lava) !== -1)

		lavaTiles.push(lava);
		lava.setTerrain('LAVA');
	}

	var vTiles = walls.concat(lavaTiles);
	//Go through all the tiles. See which tile out of 
	var allTiles = this.getTiles();
	for (var i in allTiles)
	{
		var t = allTiles[i];
		if (t.terrain !== 'WALL' || t.destructable === false)
		{
			continue;
		}

		//See which tile in vTiles it's closest to
		var minDistance = 9999999999;
		var minDistanceIndex;

		for (var j in vTiles)
		{
			var vTile = vTiles[j];
			var d = vTile.getDistance(t);
			if (d < minDistance)
			{
				minDistance = d;
				minDistanceIndex = j;
			}
		}

		var closestVTile = vTiles[minDistanceIndex];
		t.setTerrain(closestVTile.terrain);

	}


	//Place some pits using CA
	var startingPits = 20;

	for (var i = 0 ; i < startingPits ; i++)
	{
		var t;
		var foundTile = false;
		findAppropriateTile: do
		{
			t = this.getRandomOpenTile();
			for (var j = 0 ; j < 4 ; j++)
			{
				var s = t.siblings[j];
				if (s.terrain === 'LAVA')
				{
					continue findAppropriateTile;
				}
			}

			break; //If we get down here, we know the tile is goooood 
		}
		while (true)

		t.setElevation(0);
	}



	//Do the CA
	var cAIterations = 4;
	var pitChance = .1;
	var tiles = this.getTiles();
	for (var i = 0 ; i < 4 ; i++)
	{
		//go through all the tiles
		for (var j in tiles)
		{
			var t = tiles[j];
			if (t.terrain !== 'OPEN') continue;
			if (t.elevation === 0) continue;

			for (var s in t.siblings)
			{
				var sT = t.siblings[s];
				if (sT.terrain !== 'OPEN') continue;
				if (sT.elevation === 0)
				{
					if (g.rand.next(0, 1) < pitChance)
					{
						t.setElevation(0);
						break;
					}
				}
			}
		}
	}


	return true;

}




Level.prototype.generateTutorialLevel = function(depth)
{
	this['generateTutorialLevel' + depth]();
}



Level.prototype.generateTutorialLevel1 = function()
{
	//Assume 50 x 50 dungeon
	var rooms = [
			{x1: 2, y1: 2, x2: 6, y2: 6},
			{x1: 9, y1: 2, x2: 15, y2: 6},
			{x1: 9, y1: 10, x2: 17, y2: 14},
			{x1: 23, y1: 12, x2: 30, y2: 20},
			{x1: 21, y1: 25, x2: 28, y2: 30},
			{x1: 15, y1: 26, x2: 18, y2: 30},
			{x1: 16, y1: 34, x2: 20, y2: 40},
			{x1: 25, y1: 33, x2: 30, y2: 38},
				];
			
			
		
	var startPoint = this.getTile(4, 4);

	for (var i = 0 ; i < rooms.length ; i++)
	{
		var room = rooms[i];
		this.carveRect(room.x1, room.y1, room.x2, room.y2);

		if (i !== rooms.length - 1) //If it's not the last room, connect it to the room in front of it
		{
			var room2 = rooms[i+1];
			var center1 = {x: Math.round((room.x1 + room.x2) / 2), y: Math.round((room.y1 + room.y2) / 2)};
			var center2 = {x: Math.round((room2.x1 + room2.x2) / 2), y: Math.round((room2.y1 + room2.y2) / 2)};
			this.connectPointsDeterministic(center1, center2);
		}
	}

	var stairsDown = this.getTile(27, 35);
	stairsDown.setTerrain("STAIRSDOWN");
	
	var messageTiles = [
			this.getTile(7, 4),
			this.getTile(13, 6),
			this.getTile(17, 12),
			this.getTile(22, 12),
			this.getTile(25, 22),
			this.getTile(20, 28),
			this.getTile(18, 33),
			this.getTile(21, 37),
	]

	var messages = [];
	for (var i = 0 ; i < g.TUTORIALMESSAGES[this.currentDepth].length ; i++) //8 total
	{
		var message = g.TUTORIALMESSAGES[this.currentDepth][i];
		messages.push(message);
	}	

	for (var i = 0 ; i < messageTiles.length ; i++)
	{
		var mT = messageTiles[i];
		var message = messages[i];
		mT.setMessage(message);
		if (i === 6)
		{
			mT.setTerrain("ORB");
		}
	}	

	startPoint.setTerrain("SPAWNPOINT");	
	this.spawnTile = startPoint;	
	
}



Level.prototype.generateTutorialLevel2 = function()
{
	var rooms = [
			{x1: 37, y1: 4, x2: 41, y2: 9},
			{x1: 37, y1: 15, x2: 40, y2: 20},
			{x1: 33, y1: 27, x2: 36, y2: 31},
			{x1: 26, y1: 27, x2: 31, y2: 31},
			{x1: 15, y1: 18, x2: 20, y2: 24},
			{x1: 12, y1: 35, x2: 16, y2: 40},
			{x1: 27, y1: 39, x2: 33, y2: 43},
			{x1: 38, y1: 43, x2: 45, y2: 47},
				];


	var startPoint = this.getTile(39, 6);
	startPoint.setTerrain("SPAWNPOINT");	
	this.spawnTile = startPoint;	


	for (var i = 0 ; i < rooms.length ; i++)
	{
		var room = rooms[i];
		this.carveRect(room.x1, room.y1, room.x2, room.y2);

		if (i !== rooms.length - 1) //If it's not the last room, connect it to the room in front of it
		{
			var room2 = rooms[i+1];
			var center1 = {x: Math.round((room.x1 + room.x2) / 2), y: Math.round((room.y1 + room.y2) / 2)};
			var center2 = {x: Math.round((room2.x1 + room2.x2) / 2), y: Math.round((room2.y1 + room2.y2) / 2)};
			this.connectPointsDeterministic(center1, center2);
		}
	}

	var gunTile = this.getTile(39, 12);
	var gun = new TutorialPistol();
	gun.initialize(gunTile);

	//9 messages
	var messageTiles = 	[
			this.getTile(39, 10),
			this.getTile(39, 13),
			this.getTile(36, 18),
			this.getTile(35, 25),
			this.getTile(31, 29),
			this.getTile(21, 29),
			this.getTile(14, 26),
			this.getTile(14, 34),
			this.getTile(17, 38),
					];

	var messages = [];
	for (var i = 0 ; i < g.TUTORIALMESSAGES[this.currentDepth].length ; i++) //8 total
	{
		var message = g.TUTORIALMESSAGES[this.currentDepth][i];
		messages.push(message);
	}	

	for (var i = 0 ; i < messageTiles.length ; i++)
	{
		var mT = messageTiles[i];
		var message = messages[i];
		mT.setMessage(message);
	}
}





Level.prototype.placeOrb = function()
{
	var tile;
	var foundTile = false;
	orbLoop: do
	{
		tile = this.getRandomOpenTile();
		for (var i = 0 ; i < 4 ; i++)
		{
			if (tile.siblings[i].terrain !== 'OPEN')
			{
				continue orbLoop;
			}
		}
		if (tile.item === false)
		{
			foundTile = true;
		}
	}while (!foundTile)

	tile.setTerrain('ORB');
}





Level.prototype.spawnStairsAndSpawnPoint = function(minimumStairDistance)
{
	var redoDungeon = false;
	var stairsUp; //Stairs up is spawn point
	var stairsDown;
	var foundStairs = false;
	var stairsAttempts = 0;
	stairsLoop: do
	{
		stairsDown = this.getRandomOpenTile();
		//If it's next to a wall orthagonally or diagonally, try again
		for (var x = stairsDown.x - 1 ; x <= stairsDown.x + 1 ; x++)
		{
			for (var y = stairsDown.y - 1 ; y <= stairsDown.y + 1 ; y++)
			{
				var t = this.getTile(x, y);
				if (t.terrain !== 'OPEN')
				{
					continue stairsLoop;
				}
			}
		}
		
		var foundStairsUp = false;
		var stairsUpAttempts = 0;
		stairsUpLoop: do
		{
			stairsUpAttempts++;
			if (stairsUpAttempts > 10)
			{
				break;
			}
			stairsUp = this.getRandomOpenTile();

			//If it's next to a wall, try again
			for (var i = 0 ; i < 4 ; i++)
			{
				if (stairsUp.siblings[i].terrain !== 'OPEN')
				{
					continue stairsUpLoop;
				}
			}

			var distance = stairsUp.getDistance(stairsDown);
			if (distance >= minimumStairDistance)
			{
				foundStairsUp = true;
				foundStairs = true;
			}
		}
		while(foundStairsUp === false)
	}
	while(foundStairs === false)

	stairsDown.setTerrain("STAIRSDOWN");
	stairsUp.setTerrain("SPAWNPOINT");
	this.spawnTile = stairsUp;
}



Level.prototype.spawnItems = function()
{
	this.spawnWeapons();
	this.spawnArmor();
	this.spawnHelmets();
}


Level.prototype.spawnWeapons = function()
{
	//Place the guns
	for (var i = 0 ; i < this.numberOfGuns ; i++)
	{
		var currWeapon = g.game.getRandomWeapon();
		var currTile;
		var foundTile = false;
		do{
			currTile = this.getRandomOpenTile();
			if (currTile.item){
				continue;
			}
			foundTile = true;
		}
		while (foundTile === false)
		currWeapon.initialize(currTile);
	}
}


Level.prototype.spawnArmor = function()
{
	//Place the helmets
	for (var i = 0 ; i < this.numberOfHelmets ; i++)
	{
		var currHelmet = new Helmet();
		var currTile;
		var foundTile = false
		do
		{
			currTile = this.getRandomOpenTile();
			if (currTile.item)
			{
				continue;
			}
			foundTile = true;
		}
		while (foundTile === false)
		currHelmet.initialize(currTile);
	}
}


Level.prototype.spawnHelmets = function()
{
	//Place the armor
	for (var i = 0 ; i < this.numberOfArmors ; i++)
	{
		var currArmor = new Armor();
		var currTile;
		var foundTile = false
		do
		{
			currTile = this.getRandomOpenTile();
			if (currTile.item)
			{
				continue;
			}
			foundTile = true;
		}
		while (foundTile === false)
		currArmor.initialize(currTile);
	}
}

//DONT TOUCH THIS!!!! ITS COMPLICATED 
Level.prototype.spawnEnemies = function()
{	
	var levelComposition = g.levelCompositions[this.currentDepth];
	var totalEnemyFrequency = 0; //The sum of all the enmy frequencies
	var bottomRanges = []; //Can't really explain how these work. You'll just have to trace the code. Sorry.
	var topRanges = []; //Can't really explain how these work. You'll just have to trace the code. Sorry.
	//Sum the frequencies. Set up the ranges
	for (var i = 0 ; i < levelComposition.length ; i++)
	{
		var freq = levelComposition[i].frequency;
		bottomRanges.push(totalEnemyFrequency);
		totalEnemyFrequency += freq;
		topRanges.push(totalEnemyFrequency);
	}

	//Place enemies
	for (var i = 0 ; i < this.numberOfEnemies ; i++)
	{
		//Just zombies for now
		var tile = this.getRandomUnoccupiedOpenTile();
		//Choose what enemy to spawn
		var randomNumber = g.rand.next(0, totalEnemyFrequency);
		var currEnemyName = false; //Set to false so we can see if it's never set
		var hiveProduceName = false;
		for (var j = 0 ; j < bottomRanges.length ; j++)
		{
			var bottomRange = bottomRanges[j];
			var topRange = topRanges[j];
			if (randomNumber >= bottomRange && randomNumber < topRange)
			{
				currEnemyName = levelComposition[j].creature;
				break;
			}
			
		}
		//If it's a hive, choose an enemy for it to produce
		if (currEnemyName === "Hive")
		{
			var foundEnemyToProduce = true; //Will be set to false if the enemy we select is another hive
			do
			{
				var randomNumberForHive = g.rand.next(0, totalEnemyFrequency);
				for (var k = 0 ; k < bottomRanges.length ; k++)
				{
					var bottomRangeForHive = bottomRanges[k];
					var topRangeForHive = topRanges[k];
					var enem
					if (randomNumberForHive >= bottomRangeForHive && randomNumberForHive < topRangeForHive)
					{
						hiveProduceName = levelComposition[k].creature;
						if (hiveProduceName === "Hive")
						{
							foundEnemyToProduce = false;
						}
						else 
						{
							foundEnemyToProduce = true;
						}
						break;
					}
				}
			} 
			while (foundEnemyToProduce === false)
		}
		var currEnemy;
		if (currEnemyName !== "Hive")
		{
			currEnemy = new g.constructors[currEnemyName]();
		}
		else
		{
			currEnemy = new g.constructors[currEnemyName](hiveProduceName);
		}
		
		var behavior = g.rand.next(0, 1) < this.percentOfEnemiesSleeping ? 'SLEEPING' : 'WANDERING';
		if (currEnemy.enemyType === 'HIVE')
		{
			behavior = 'SLEEPING';
		}

		g.game.spawnUnit(currEnemy, tile, behavior);
	}
}



Level.prototype.spawnLightSources = function()
{
	//Place light sources
	for (var i = 0 ; i < this.numberOfLightSources ; i++)
	{
		var tileFound = false;
		var tile = false;
		while (tileFound === false)
		{
			tile = this.getRandomOpenTile();
			if (tile.isLightSource === false)
			{
				tileFound = true;	
			}
		}
		tile.setAsLightSource();
	}
}








Level.prototype.getTile = function(x, y)
{
	if (x < 0 || x >= this.width || y < 0 || y >= this.height)
	{
		return false;
	}

	if (Math.round(x) !== x || Math.round(y) !== y)
	{
		return false;
	}
	
	return this.tiles[x][y];
}


/*
Level.prototype.getRandomOpenTile = function()
{
	var foundOpen = false;
	var attempts = 0;
	for (var attempts = 0 ; attempts < 100 ; attempts++)
	{
		var randX = g.rand.nextInt(0, this.width);
		var randY = g.rand.nextInt(0, this.height);
		var tile = this.getTile(randX, randY);
		if (tile.terrain === "OPEN")
		{
			return tile;
		}
	}
	return false;
}
*/

Level.prototype.getRandomOpenTile = function()
{
	var tiles = this.getTiles();
	var startingInd = g.rand.nextInt(0, tiles.length);

	for (var ind = startingInd ; ind < startingInd + tiles.length ; ind++)
	{
		var i = ind % tiles.length;
		var tile = tiles[i];

		if (tile.terrain === 'OPEN')
		{
			return tile;
		}
	}

	return false;
}




Level.prototype.getRandomWallTile = function()
{
	var tiles = this.getTiles();
	var startingInd = g.rand.nextInt(0, tiles.length);

	for (var ind = startingInd ; ind < startingInd + tiles.length ; ind++)
	{
		var i = ind % tiles.length;
		var tile = tiles[i];

		if (tile.terrain === 'WALL')
		{
			return tile;
		}
	}

	return false;
}



Level.prototype.getRandomUnoccupiedOpenTile = function()
{
	var tiles = this.getTiles();
	var startingInd = g.rand.nextInt(0, tiles.length);

	for (var ind = startingInd ; ind < startingInd + tiles.length ; ind++)
	{
		var i = ind % tiles.length;
		var tile = tiles[i];

		if (tile.terrain === 'OPEN' && tile.unit === false)
		{
			return tile;
		}
	}

	return false;
}


Level.prototype.floodFillFromTile = function(tile)
{
	var queue = [];
	var processed = [];
	queue.push(tile);
	while (queue.length > 0)
	{
		var tile = queue[0];
		queue.splice(0, 1);
		if (tile.terrain === 'OPEN' && tile.filled === false)
		{
			tile.filled = true;
			processed.push(tile);
			//For each sibling
			for (var i = 0 ; i < tile.siblings.length ; i++)
			{
				var currSibling = tile.siblings[i];
				if (currSibling)
				{
					if (currSibling.filled === false)
					{
						queue.push(currSibling);
					}
				}
			}	
		}
	}
	return processed;
}



Level.prototype.setTileSiblings = function(){
	for (var x = 0 ; x < this.width ; x++)
	{
		for (var y = 0 ; y < this.height ; y++)
		{
			var tile = this.getTile(x, y);
			tile.setSiblings();
		}
	}
}



Level.prototype.getTiles = function()
{
	var tiles = [];
	for (var x = 0 ; x < this.width ; x++)
	{
		for (var y = 0 ; y < this.height ; y++)
		{
			var tile = this.getTile(x, y);
			tiles.push(tile);
		}
	}
	return tiles;
}


Level.prototype.reinitialize = function()
{
	this.tiles = [];
	//Fill the level with wall tiles
	for (var x = 0 ; x < this.width ; x++)
	{
		this.tiles.push([]);
		for (var y = 0 ; y < this.height ; y++)
		{
			var tile = new Tile(x, y);
			this.tiles[x].push(tile);
		}
	}
	this.setTileSiblings();
}



Level.prototype.drunkConnectPoints = function(p1, p2)
{
	var x1 = p1.x;
	var y1 = p1.y;
	var x2 = p2.x;
	var y2 = p2.y;

	var start = this.getTile(x1, y1);
	var end = this.getTile(x2, y2);	

	start.setTerrain('OPEN');
	end.setTerrain('OPEN');

	var lastTileCarved = start;
	var done = false
	var attempts = 0;
	carveLoop: while (done === false)
	{
		attempts++;
		if (attempts > 100)
		{
			break;
		}
		//Get the sibs of last tile carved. See which one is closest to end.
		var minDistance = 99999999;
		var minDistanceIndex;
		var startingInd = g.rand.nextInt(0, 4);
		for (var ind = startingInd ; ind < startingInd + 4 ; ind++)
		{
			var i = ind % 4;
			var sib = lastTileCarved.siblings[i];
			if (sib === end)
			{
				done = true;
				break carveLoop;
			}
			var distance = sib.getDistance(end);
			if (distance < minDistance)
			{
				minDistance = distance;
				minDistanceIndex = i;
			}
		}

		if (g.rand.next(0, 1) < .7)
		{
			//Carve 3 tiles in direction of min distance tile
			for (var k = 0 ; k < 3 ; k++)
			{
				lastTileCarved.siblings[minDistanceIndex].setTerrain('OPEN');
				lastTileCarved = lastTileCarved.siblings[minDistanceIndex];
				if (lastTileCarved === end)
				{
					break carveLoop;
				}
			}
			
		}
		else
		{
			var index = g.rand.nextInt(0, 4);
			//Carve 3 tiles in direction of min distance tile
			for (var k = 0 ; k < 3 ; k++)
			{
				lastTileCarved.siblings[index].setTerrain('OPEN');
				lastTileCarved = lastTileCarved.siblings[minDistanceIndex];
				if (lastTileCarved === end)
				{
					break carveLoop;
				}
			}
		}

		if (lastTileCarved === end)
		{
			done = true;
			break;
		}

	}
}



//Takes two point objects and carves halways between them
Level.prototype.connectPoints = function(center1, center2)
{

	var x1 = center1.x;
	var y1 = center1.y;
	var x2 = center2.x;
	var y2 = center2.y;

	var random = g.rand.nextInt(0, 2);
	switch (random)
	{
		case 0:
			this.carveLine(x1, y1, x2, y1);
			this.carveLine(x2, y1, x2, y2);
			break;
		case 1:
			this.carveLine(x1, y1, x1, y2);
			this.carveLine(x1, y2, x2, y2);
			break;
	}
}


Level.prototype.connectPointsDeterministic = function(center1, center2)
{

	var x1 = center1.x;
	var y1 = center1.y;
	var x2 = center2.x;
	var y2 = center2.y;

	
	this.carveLine(x1, y1, x2, y1);
	this.carveLine(x2, y1, x2, y2);
	
}

//Carves a vertical or horizontal rectangle from (x1, y1) to (x2, y2)
Level.prototype.carveLine = function(x1, y1, x2, y2)
{
	var xDiff = x2 - x1;
	var yDiff = y2 - y1;

	if (yDiff !== 0 && xDiff !== 0) //If one of them isn't 0, it's not a fuckin vertical or horizontal rect
	{
		return false;
	}

	if (xDiff < 0 || yDiff < 0) //If they're both negative, switch both
	{
		this.carveLine(x2, y2, x1, y1);
		return;
	}

	if (yDiff === 0) //If it's horizontal
	{
		for (var x = x1 ; x <= x2 ; x++)
		{
			var currTile = this.getTile(x, y1);
			currTile.setTerrain('OPEN');
		}
	}
	else //If it's vertical
	{
		for (var y = y1 ; y <= y2 ; y++)
		{
			var currTile = this.getTile(x1, y);
			currTile.setTerrain('OPEN');
		}
	}
}



//x1 and y1 MUST represent the top left corner
//The room will not include x2 and y2
Level.prototype.carveRect = function(x1, y1, x2, y2)
{
	for (var x = x1 ; x < x2 ; x++)
	{
		for (var y = y1 ; y < y2 ; y++)
		{
			var t = this.getTile(x, y);
			t.setTerrain('OPEN');
		}
	}
}




Level.prototype.generateLevel = function()
{

	if (g.game.DEBUG.blankDungeon)
	{
		this.generateBlankDungeon();
		return;
	}
	var success;
	var attempts = 0;
	do 
	{
		//clear the dungeon if attempt failed
		if (attempts > 0)
		{
			var tiles = this.getTiles();
			for (var i = 0 ; i < tiles.length ; i++)
			{
				var tile = tiles[i];
				tile.setTerrain("WALL");
			}
		}
		success = this.generate();
		attempts++;
	}
	while (success === false && attempts < 99999);

	if (success === false)
	{
		return;
	}
	var minimumStairDistance = (this.width + this.height) / 4;
	minimumStairDistance = Math.round(minimumStairDistance);

	this.spawnStairsAndSpawnPoint(minimumStairDistance);
	this.spawnItems();
	this.spawnEnemies();
	this.spawnLightSources();
	this.placeOrb();
	
}



Level.prototype.initialize = function()
{
	//Fill the level with wall tiles
	for (var x = 0 ; x < this.width ; x++)
	{
		this.tiles.push([]);
		for (var y = 0 ; y < this.height ; y++)
		{
			var tile = new Tile(x, y);
			this.tiles[x].push(tile);
			if (x === 0 || x === this.width - 1 || y === 0 || y === this.height - 1)
			{
				tile.setTerrain('INDESTRUCTIBLEWALL');
			}
		}
	}
	this.setTileSiblings();
	if (g.game.inTutorial === false)
	{
		this.setNumberOfEnemies();
		this.setNumberOfItems();
		this.setNumberOfLightSources();
		this.generateLevel(); //Make the map
	}
	else
	{
		this.generateTutorialLevel(this.currentDepth);
	}
	
}












Level.prototype.SETTESTTABLE = function(){
	for (var x = 0 ; x < this.width ; x++)
	{
		for (var y = 0 ; y < this.height ; y++)
		{
			var currCell = this.TESTTABLE.rows[y].cells[x];
			var currTile = this.getTile(x, y);
			if (currTile.terrain === "WALL")
			{
				currCell.style.backgroundColor = 'gray';
			}
			else if (currTile.terrain === "OPEN")
			{
				currCell.style.backgroundColor = 'blue';
			}
			else if (currTile.terrain === "STAIRSUP")
			{
				currCell.innerHTML = "<";
			}
			else if (currTile.terrain === "STAIRSDOWN")
			{
				currCell.innerHTML = ">";
			}
		}
	}
}


Level.prototype.INITIALIZETESTTABLE = function() 
{
	//Fill the test table
	for (var y = 0 ; y < this.height ; y++)
	{
		var row = document.createElement('tr');
		this.TESTTABLE.appendChild(row);
		for (var x = 0 ; x < this.width ; x++)
		{
			var cell = document.createElement('td');
			cell.innerHTML = '&nbsp;';
			cell.style.border = '1px solid black';
			cell.style.width = '10px';
			cell.style.height = '10px';
			cell.style.fontSize = '7pt';
			row.appendChild(cell);
		}
	}
	document.body.appendChild(this.TESTTABLE);
	this.TESTTABLE.style.borderSpacing = '0px';
}

