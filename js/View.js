
function View(width, height){
	
	this.TEST = [];

	this.widthInCells = width;
	this.heightInCells = height;

	this.cells = [];

	this.viewX = 0; //Relative to the map
	this.viewY = 0;

	this.cellLength = 16;

	//TEST
	/*
	this.widthInCells = g.game.widthInit;
	this.heightInCells = g.game.heightInit;
	this.cellLength = 10;
	g.fontSize = '10pt';
	*/
	//TEST


	this.showDirections = false; //If true, it shows arrows for the units instead of their characters
	this.showStealthRadius = false; //If true, tiles not in the player's stealth radius will be colored

	this.damageGraphicsOn = false; //Set to true when teh attack graphics activate. Keeps them from stepping over each other. 
	this.explodedGraphicsOn = false; //Set to true when the exploded graphics activate. 
	this.alertsToLog = []; //Alert messages to log

	this.optionsMenu = false;
	this.optionsMenuOptionDivs = {
		resume: false,
		quit: false,
	}

	this.canvases = {
		terrain: document.createElement('canvas'),
		items: document.createElement('canvas'),
		units: document.createElement('canvas'),
		lighting: document.createElement('canvas'),
		stealth: document.createElement('canvas'),
		vision: document.createElement('canvas'),
		seen: document.createElement('canvas'),
		select: document.createElement('canvas'),
		graphics1: document.createElement('canvas') //For debugging
	};

	


	this.canvasStyle = {
		width: this.cellLength * this.widthInCells,
		height: this.cellLength * this.heightInCells,
		top: 30,
		left: 250,
		selectOpacity: .5,
	}


	this.tutorialMessageDiv = false;

	//Lighint opacity
	this.lightingOpacity = .15;
	if (g.game.DEBUG.dontShowLighting)
	{
		this.lightingOpacity = 0;
	}




	this.tilesInBetween = []; //Cells in between the player and the cells aimed at

	this.messageCells = [];
	this.messages = []; 
	this.alerts = false;

	this.numberOfMessagesDisplayed = 10;

	this.messagesStyle = {
		width: 236,
		height: 350,
		top: 250,
		left: 10,
		border: '3px solid black'
	}

	this.alertsStyle = {
		width: this.canvasStyle.width,
		height: 200,
		top: 250,
		left: this.canvasStyle.left,
		fontSize: 20
	}



	


	this.equipmentInfoMainDiv = false;
	this.characterInfoMainDiv = false;
	this.enemyInfoMainDiv = false;
	this.tileInfoMainDiv = false;

	this.equipmentInfoMainSpans = {
		weaponName: false,
		weaponDamage: false,
		weaponAverageDamagePerTick: false,
		weaponRange: false,
		weaponAccuracy: false,
		weaponNoise: false,
		weaponAttackTime: false,
		weaponReloadTime: false,
		weaponClipSize: false
	}

	this.equipmentInfoMainDivStyle = {
		width: '260',
		height: '160',
		top: '250',
		left: '785',
		border: '3px solid black'
	}


	this.characterInfoMainSpans = {
		healthBar: false,
		Health: false,
		MaxHealth: false,
		energyBar: false,
		Energy: false,
		MaxEnergy: false,
		sneaking: false,
		walking: false,
		running: false,
		DodgeChance: false,
		DamageReduction: false,
		ViewDistance: false,
		ViewAngle: false,
		MoveTime: false,
		MoveNoise: false,
		Visibility: false,
		//direction: false,
	}

	this.characterInfoMainDivStyle = {
		width: '250',
		height: '200',
		top: '30',
		left: '785',
		padding: '10',
		margin: '3',
		border: '3px solid black',
		barWidth: '100',
		barHeight: '10',
		healthBarColor: g.COLORCONSTANTS.RED,
		energyBarColor: g.COLORCONSTANTS.BLUE
	}


	this.enemyInfoMainSpans = {
		name: false,
		healthBar: false,
		health: false,
		maxHealth: false,
		energyBar: false,
		energy: false,
		maxEnergy: false,
		damage: false,
		range: false,
		chance: false,
		attackTime: false,
		reloadTime: false,
		dodgeChance: false,
		armor: false,
		moveTime: false,
		direction: false,
	}

	this.enemyInfoMainDivStyle = {
		width: '230',
		height: '195',
		top: '30',
		left: '10',
		border: '3px solid black',
		barWidth: '100',
		barHeight: '10',
		margin: '3'
	}


	this.powersMainSpans = [];

	this.powersMainDivStyle = {
		width: '270',
		height: '180',
		top: '420',
		left: '785',
		border: '3px solid black',
	}



	this.depthSpan = false;
	this.orbSpan = false;



	this.menu = document.createElement('div');

	this.powerPoints = false;
	this.skillPoints = false;

	this.menuLabels = {
		character: document.createElement('div'),
		equipment: document.createElement('div'),
		powers: document.createElement('div')
	}
	this.menuInfo = {
		character: document.createElement('div'),
		equipment: document.createElement('div'),
		powers: document.createElement('div')
	}


	this.characterInfoContainers = {
		strength: false,
		dexterity: false,
		intelligence: false,
		perception: false,
		health: false,
		healthRechargeRate: false,
		energy: false,
		energyRechargeRate: false,
		moveTime: false,
		moveNoise: false,
		dodgeChance: false,
		armor: false,
		viewDistance: false,
		viewAngle: false,
		visibility: false,
		direction: false,
	}

	this.characterInfoSpans = {
		strength: false,
		dexterity: false,
		intelligence: false,
		perception: false,
		healthPercent: false,
		health: false,
		maxHealth: false,
		healthRechargeRate: false,
		energyPercent: false,
		energy: false,
		maxEnergy: false,
		energyRechargeRate: false,
		moveTime: false,
		moveNoise: false,
		dodgeChance: false,
		damageReduction: false,
		viewDistance: false,
		viewAngle: false,
		visibility: false,
		direction: false,
	}

	this.attributeInfoDiv = false;

	this.attributeInfoDivStyle = {
		position: 'absolute',
		width: '600px',
		height: '365px',
		left: '400px',
		top: '10px',
		backgroundColor: g.COLORCONSTANTS.PURPLE,
		border: '1px solid ' + g.COLORCONSTANTS.BLACK,
		padding: '20px',
		fontSize: '12pt',
	}



	//Represents the window that displays equipment stats in the menu
	this.internalEquipmentInfo = {
		weapon: false,
		armor: false
	}

	this.internalEquipmentInfoStyle = {
		width: 270,
		height: 350,
		top: 50,
		left: 330,
		backgroundColor: g.colors.equipmentInfoBackground,
		border: '3px solid ' + g.COLORCONSTANTS.BLACK,
	}


	this.armorInfoSpans = {
		name: false,
		damageReduction: false,
		dodgeChanceEffect: false,
		moveNoiseEffect: false,
		//moveTimeEffect: false,
		visibilityEffect: false,
		viewDistanceEffect: false,
		viewAngleEffect: false,
		maxHealthEffect: false,
		healthRechargeEffect: false,
		maxEnergyEffect: false,
		energyRechargeEffect: false,
	}


	//this.equipmentInfoMenu = false;
	this.equipmentInfoSpans = {
		name: false,
		/*
		damageBase: false,
		damageMul: false, //damageMultiplier
		damageParam: false, //damage paramater
		damageTotal: false,
		*/
		damage: false,
		averageDamagePerTick: false,
		range: false,
		/*
		chanceBase: false,
		chanceMul: false,
		chanceParam: false,
		*/
		accuracy: false,
		noise: false,
		attackTime: false,
		reloadTime: false,
		clipSize: false,
		spreadAngle: false,
		followThrough: false,
		knockBack: false,
	}

	this.equipmentInfoSpansEquiped = {
		name: false,
		damage: false,
		averageDamagePerTick: false,
		range: false,
		chance: false,
		noise: false,
		shootTime: false,
		reloadTime: false,
		clipSize: false,
		spreadAngle: false,
		followThrough: false,
		knockBack: false,
	}

	this.equipmentListCells = [];



	this.powersMenu = {
		table: false,
		powerDivs: [],
		powerCells: [],
		description: false,
		powerAtts: false,
	}




	this.mainMenuContainers = {
		BEGIN: false,
		//TUTORIAL: false,
		QUIT: false,
	}


	this.raceMenuContainers = {
		BRUTE: false,
		STALKER: false,
		ADEPT: false,
		HIGHBROW: false,
	}

	this.classMenuContainers = {
	}
}











//Sets the entire view
View.prototype.set = function()
{
	
	if (g.game.selectedTile)
	{
		this.centerOnTile(g.game.selectedTile);
	}
	else
	{
		this.centerOnTile(g.game.player.tile);
	}
	
	/*
	if (g.game.state === 'AIMING')
	{
		this.tilesInBetween = g.game.player.tilesAimedAt;
	}
	else if (g.game.state === 'AIMINGPOWER')
	{
		this.tilesInBetween = g.game.player.tilesAimedAtPower;
	}
	else
	{
		this.tilesInBetween = [];
	}
	*/

	for (var x = 0 ; x < this.widthInCells ; x++)
	{
		for (var y = 0 ; y < this.heightInCells ; y++)
		{
			var cell = this.getCell(x, y);
			this.setCell(cell);
		}
	}
	


	if (g.game.tookDamage.length > 0 && g.game.DEBUG.attackGraphicsOff === false)
	{
		this.startDamageGraphics();
	}

	if (g.game.explodedTiles.length > 0)
	{
		this.startExplodedGraphics();
	}

	//If we're printing the path distances, clear all the path distances
	if (g.game.DEBUG.showPathDistance)
	{
		var tiles = g.game.level.getTiles();
		for (var i = 0 ; i < tiles.length ; i++)
		{
			var t = tiles[i];
			t.pathDistance = false;
			t.pathFound = false;
		}
	}

}






View.prototype.setCell = function(cell)
{
	cell.fullClear();

	var tile = this.getTileFromCell(cell);

	//If the tile is out of rance, set it to black and return 
	if (tile === false)
	{
		cell.fillRect(g.COLORCONSTANTS.BLACK, 'seen');
	}
	else if (tile.seenByPlayer === false && g.game.DEBUG.allTilesVisible === false)
	{
		cell.fillRect(g.COLORCONSTANTS.BLACK, 'seen');
	}
	else
	{
		//Else if it's a real tile and it's been seen by the player
		var color;
		var character;

		var terrain = tile.terrain;
		var p = g.game.player;
		if (terrain === 'OPEN')
		{
			color = tile.elevation === 1 ? g.colors.OPEN : g.colors.PIT;
		
			if (tile.unit || tile.item)
			{
				character = '';
			}
			else
			{
				character = tile.elevation === 1 ? g.chars.OPEN : g.chars.PIT;
			}
			cell.fillRect(color, 'terrain');
			color = g.colors.border;
			cell.strokeRect(color, 'terrain');
			color = g.COLORCONSTANTS.DARKGRAY;
			cell.fillText(character, color, 'terrain');
		}
		else if (terrain === 'WALL')
		{
			if (tile.destructable)
			{
				color = g.colors.WALL;
			}
			else
			{
				color = g.colors.INDESTRUCTABLE;
			}
			cell.fillRect(color, 'terrain');
			color = g.colors.border;
			cell.strokeRect(color, 'terrain');
			color = g.colors.defaultColor;
			character = g.chars.WALL;
			cell.fillText(character, color, 'terrain');

		}
		else if (terrain === 'STAIRSDOWN')
		{
			color = g.colors.STAIRSDOWN;
			cell.fillRect(color, 'terrain');
			color = g.colors.border;
			cell.strokeRect(color, 'terrain');
			color = g.colors.defaultColor;
			character = g.chars.STAIRSDOWN;
			cell.fillText(character, color, 'terrain');
		}
		else if (terrain === 'ORB')
		{
			color = g.colors.OPEN;
			cell.fillRect(color, 'terrain');
			color = g.colors.border;
			cell.strokeRect(color, 'terrain');
			color = g.colors.ORB;
			character = g.chars.ORB;
			cell.fillText(character, color, 'terrain');
		}
		else if (terrain === 'LAVA')
		{
			if (p.canSee(tile))
			{
				cell.fillLava();
			}
			else
			{
				cell.fillLavaLastSeen();
			}
		}




		//Items
		if (tile.item){
			var item = tile.item;
			var character = g.chars[item.type];
			cell.fillText(character, g.colors.items, 'items');
		}





		if (tile.unit)
		{
			var unit = tile.unit;
			if (unit === p)
			{
				if (this.showDirections) //If we're showing the directions of the units
				{
					character = this.directionIndexToString(unit.get('direction'));
				}
				else 
				{
					character = g.chars.PLAYER;
				}
				color = g.colors.PLAYER;
				cell.fillText(character, color, 'units');
			}
			else 
			{
				if (p.canSee(tile) || g.game.DEBUG.allTilesVisible)
				{
					if (this.showDirections) //If we're showing the directions of the units
					{
						character = this.directionIndexToString(unit.get('direction'));
					}
					else 
					{
						character = g.chars[unit.enemyType];
					}

					if (unit.alignment === "ALLY")
					{
						color = g.colors.ALLY;
					}
					else
					{
						color = g.colors[unit.behavior];
					}
					cell.fillText(character, color, 'units');
				}
			}
		}




		if (this.showStealthRadius)
		{
			//See if the tile is within a player's stealth radius
			if (g.game.player.isVisibleFromTile(tile) === false)
			{
				cell.fillRect(g.colors.stealth, 'stealth');
			}
		}



		//Select canvas
		if (g.game.state === 'AIMING')
		{
			if (p.actorsAimedAt.indexOf(tile.unit) !== -1 || p.wallsAimedAt.indexOf(tile) !== -1)
			{
				color = g.colors.actorsAimedAt;
				cell.fillRect(color, 'select');
			}
			else if (p.tilesAimedAt.indexOf(tile) !== -1)
			{
				color = g.colors.tilesAimedAt;
				cell.fillRect(color, 'select');
			}
		}
		else if (g.game.state === 'AIMINGPOWER')
		{
			if (p.actorsAimedAtPower.indexOf(tile.unit) !== -1 || p.wallsAimedAtPower.indexOf(tile) !== -1)
			{
				color = g.colors.actorsAimedAt;
				cell.fillRect(color, 'select');
			}
			else if (p.tilesAimedAtPower.indexOf(tile) !== -1)
			{
				color = g.colors.tilesAimedAtPower;
				cell.fillRect(color, 'select');
			}	
		}

		//Lighting
		//Only set it if we're not in aiming mode
		if (g.game.state !== "AIMING")
		{
			if (tile.light === 'DARK')
			{
				cell.fillRect(g.colors.DARK, 'lighting');
			}

			//ctx = this.canvases.lightingMedium.getContext('2d');
			if (tile.light === 'BRIGHT')
			{
				cell.fillRect(g.colors.BRIGHT, 'lighting')
			}
			if (g.game.DEBUG.highlightLightSources && tile.isLightSource === true)
			{
				cell.fillRect(g.COLORCONSTANTS.YELLOW, 'lighting');
			}
		}


		//Vision
		if (p.canSee(tile) === false && g.game.DEBUG.allTilesVisible === false)
		{
			cell.fillRect(g.COLORCONSTANTS.BLACK, 'vision');
		}
	}


	if (g.game.state === 'EXAMINING' || g.game.state === 'AIMING' || g.game.state === 'AIMINGPOWER')
	{
		if (tile === g.game.selectedTile)
		{
			cell.strokeThickRect(g.COLORCONSTANTS.BRIGHTRED, 'select');
		}
	}
	
}






/*
//Set all the canvases for an individual cell
View.prototype.setCell = function(cell)
{
	cell.fullClear();

	var tile = this.getTileFromCell(cell);
	if (tile)
	{
		//Go through the canvases
		//Terrain
		if (tile.terrain === "WALL")
		{
			var color;
			if (tile.destructable)
			{
				color = g.colors.WALL;
			}
			else
			{
				color = g.colors.INDESTRUCTABLE;
			}
			cell.fillRect(color, 'terrain');
			cell.fillText(g.chars.WALL, g.colors.defaultColor, 'terrain');
		}
		else if (tile.terrain === "OPEN")
		{
			var color;
			if (tile.message)
			{
				color = g.colors.MESSAGETILE;
			}
			else 
			{
				color = g.colors.OPEN;
			}
			cell.fillRect(color, 'terrain');
			cell.strokeRect(g.colors.border, 'terrain');
		}
		else if (tile.terrain === "STAIRSDOWN")
		{
			cell.fillRect(g.colors.STAIRS, 'terrain');
			cell.strokeRect(g.colors.border, 'terrain');
			cell.fillText(g.chars.STAIRSDOWN, g.colors.defaultColor, 'terrain');
		}
		else if (tile.terrain === 'ORB')
		{
			var color;
			if (tile.message)
			{
				color = g.colors.MESSAGETILE;
			}
			else 
			{
				color = g.colors.OPEN;
			}
			cell.fillRect(color, 'terrain');
			cell.strokeRect(g.colors.border, 'terrain');
			cell.fillText(g.chars.ORB, g.COLORCONSTANTS.YELLOW, 'terrain');
		}
		else if (tile.terrain === 'LAVA')
		{
			if (g.game.player.canSee(tile))
			{
				cell.fillLava();
			}
			else
			{
				if (tile.seenByPlayer)
				{
					cell.fillLavaLastSeen();
				}
			}
		}


		//Items
		if (tile.item){
			var item = tile.item;
			var character = g.chars[item.type];
			cell.fillText(character, g.colors.items, 'items');
		}


		//Units
		if (tile.unit){
			//ctx.font = g.fontSize + 'px bold monospace';
			var unit = tile.unit;
			var character;
			var color;
			if (unit === g.game.player)
			{
				if (this.showDirections) //If we're showing the directions of the units
				{
					character = this.directionIndexToString(unit.get('direction'));
				}
				else 
				{
					character = g.chars.PLAYER;
				}
				color = g.colors.defaultColor;
				cell.fillText(character, color, 'units');
			}
			else if (g.game.player.visibleTiles.indexOf(tile) !== -1 || g.game.DEBUG.allTilesVisible) //If it's an enemy and we can see it
			{
				if (this.showDirections) //If we're showing the directions of the units
				{
					character = this.directionIndexToString(unit.get('direction'));
				}
				else 
				{
					character = g.chars[unit.enemyType];
				}

				if (unit.alignment === "ALLY")
				{
					color = g.colors.ALLY;
				}
				else
				{
					color = g.colors[unit.behavior];
				}
				cell.fillText(character, color, 'units');
			}
			
			//ctx.font = g.fontSize + 'px monospace';
		}


		//General
		if (this.showStealthRadius)
		{
			//See if the tile is within a player's stealth radius
			if (g.game.player.isVisibleFromTile(tile) === false)
			{
				cell.fillRect(g.colors.stealth, 'stealth');
			}
		}
		



		//Select
		//ctx = this.canvases.select.getContext('2d');
		if (this.tilesInBetween.indexOf(tile) !== -1)//If the tile is an in between tile for aiming, or if it's the tile we're examining
		{
			var color;
			if (g.game.state === 'AIMING')
			{
				
				if (tile.unit && g.game.player.actorsAimedAt.indexOf(tile.unit) !== -1)//If the tile has a unit on it, and the unit will be shot if the player fires
				{
					color = g.COLORCONSTANTS.YELLOW;
				}
				else if (g.game.player.wallsAimedAt.indexOf(tile) !== -1) //If it's a wall, we're aiming at the wall, and we can see the wall
				{
					color = g.COLORCONSTANTS.YELLOW;
				}
				
				else
				{
					
					color = g.colors.tilesBetweenVisible;
					
				}
				cell.fillRect(color, 'select');
			}
			else if (g.game.state === "AIMINGPOWER")
			{
				if (tile.unit && g.game.player.actorsAimedAtPower.indexOf(tile.unit) !== -1 && g.game.player.visibleTiles.indexOf(tile) !== -1)//If the tile has a unit on it, and the unit will be shot if the player fires, and we can see it
				{
					color = g.COLORCONSTANTS.YELLOW;
				}
				else if (tile.terrain === "WALL" && g.game.player.wallsAimedAtPower.indexOf(tile) !== -1 && g.game.player.visibleTiles.indexOf(tile) !== -1) //If it's a wall, we're aiming at the wall, and we can see the wall
				{
					color = g.COLORCONSTANTS.YELLOW;
				}
				
				else
				{
					color = g.COLORCONSTANTS.PURPLE;
				}
				cell.fillRect(color, 'select');
			}

			
		}

		//Selected tile is set in the "seen" context

		


		//Lighting
		//Only set it if we're not in aiming mode
		if (g.game.state !== "AIMING")
		{
			if (tile.light === 'DARK')
			{
				cell.fillRect(g.colors.DARK, 'lighting');
			}

			//ctx = this.canvases.lightingMedium.getContext('2d');
			if (tile.light === 'BRIGHT')
			{
				cell.fillRect(g.colors.BRIGHT, 'lighting')
			}
			if (g.game.DEBUG.highlightLightSources && tile.isLightSource === true)
			{
				cell.fillRect(g.COLORCONSTANTS.YELLOW, 'lighting');
			}
		}

		//Vision
		if (g.game.player.visibleTiles.indexOf(tile) !== -1 || g.game.DEBUG.allTilesVisible) //If the tile is visible
		{
			cell.clearRect('vision');
		}
		else 
		{
			cell.fillRect(g.COLORCONSTANTS.BLACK, 'vision');
		}


		//seen
		if (tile.seenByPlayer || g.game.DEBUG.allTilesVisible)
		{
			cell.clearRect('seen');
		}
		else
		{
			cell.fillRect(g.COLORCONSTANTS.BLACK, 'seen');


		}
		//Use the "seen" context
		if (tile === g.game.selectedTile)
		{
			cell.strokeThickRect(g.COLORCONSTANTS.BRIGHTRED, 'seen');
		}

		if (g.game.DEBUG.showNoise)
		{	
			var ctx = this.canvases.seen.getContext('2d');
			var fontSize = ctx.font;
			ctx.font = '6pt ' + g.fontFamily;
			cell.fillText(tile.noise, g.COLORCONSTANTS.BLACK, 'seen');
			ctx.fontSize = fontSize;

		}

		//Graphics 1
		if (g.game.DEBUG.showPathDistance)
		{
			ctx = this.canvases.graphics1.getContext('2d');
			if (tile.pathFound)
			{
				cell.fillText(tile.pathDistance, g.COLORCONSTANTS.BLACK, 'graphics1');
			}
		}
	}
	else//If tile is false, the cell represents something outside the map. simply color it black.
	{
		cell.fillRect(g.COLORCONSTANTS.BLACK, 'seen');
	}
}
*/






View.prototype.clearCell = function(cell)
{
	for (cName in this.canvases)
	{
		var c = this.canvases[cName];
		ctx = c.getContext('2d');
		ctx.clearRect(cell.xPx, cell.yPx, this.cellLength, this.cellLength);
	}
}




View.prototype.openOptionsMenu = function()
{
	this.optionsMenu.style.visibility = 'visible';
}

View.prototype.closeOptionsMenu = function()
{
	this.optionsMenu.style.visibility = 'hidden';
}

View.prototype.selectOption = function()
{
	var s = g.game.selectedMenuItem;
	var divs = [this.optionsMenuOptionDivs.resume, this.optionsMenuOptionDivs.quit];
	for (var i = 0 ; i < 2 ; i++)
	{
		if (i === s) divs[i].style.backgroundColor = g.COLORCONSTANTS.YELLOW;
		else divs[i].style.backgroundColor = 'transparent';
	}
}


//Opens the menu based on the games state
View.prototype.openMenu = function()
{
	this.menu.style.visibility = 'visible';
	this.menu.style.display = 'initial';
	this.menuLabels.character.style.backgroundColor = g.colors.menuLabelDefaultBackground;
	this.menuLabels.equipment.style.backgroundColor = g.colors.menuLabelDefaultBackground;
	this.menuLabels.powers.style.backgroundColor = g.colors.menuLabelDefaultBackground;

	

	if (g.game.state === 'MENU.CHARACTER')
	{
		this.menuLabels.character.style.border = g.menuLabelSelectedBorder;
		this.menuLabels.character.style.backgroundColor = g.colors.menuLabelSelectedBackground;
		this.menuInfo.character.style.visibility = 'visible';

		for (var attribute in this.characterInfoContainers)
		{
			this.characterInfoContainers[attribute].style.backgroundColor = 'transparent';
		}

		this.attributeInfoDiv.innerHTML = '';

		var p = g.game.player;
		var s = this.characterInfoSpans; //Really should've done this before. 

		this.characterInfoSpans.strength.innerHTML = p.get('strength');
		this.characterInfoSpans.dexterity.innerHTML = p.get('dexterity');
		this.characterInfoSpans.intelligence.innerHTML = p.get('intelligence');
		this.characterInfoSpans.perception.innerHTML = p.get('perception');
		this.characterInfoSpans.healthPercent.innerHTML = Math.round(100 * p.get('health') / p.get('maxHealth'));
		this.characterInfoSpans.health.innerHTML = Math.round(100 *p.get('health')) / 100; //Round to 2 decimal places
		this.characterInfoSpans.maxHealth.innerHTML = p.get('maxHealth');
		s.healthRechargeRate.innerHTML = round(p.get('healthRechargeRate'), 2); //
		this.characterInfoSpans.energyPercent.innerHTML = Math.round(100 * p.get('energy') / p.get('maxEnergy'));
		this.characterInfoSpans.energy.innerHTML = Math.round(100 * p.get('energy')) / 100; //Round to 2 decimal places
		this.characterInfoSpans.maxEnergy.innerHTML = p.get('maxEnergy');
		s.energyRechargeRate.innerHTML = round(p.get('energyRechargeRate'), 2);
		this.characterInfoSpans.moveTime.innerHTML = p.get('moveTime');
		this.characterInfoSpans.moveNoise.innerHTML = p.get('moveNoise');
		this.characterInfoSpans.dodgeChance.innerHTML = round(p.get('dodgeChance'), 2);
		this.characterInfoSpans.damageReduction.innerHTML = p.get('damageReduction');
		this.characterInfoSpans.viewDistance.innerHTML = p.get('viewDistance');
		this.characterInfoSpans.viewAngle.innerHTML = p.get('viewAngle') + '&deg;';
		s.visibility.innerHTML = p.get('visibility');
		this.characterInfoSpans.direction.innerHTML = this.directionIndexToString(p.get('direction'));

	}
	else if (g.game.state === 'MENU.EQUIPMENT')
	{
		this.menuLabels.equipment.style.border = g.menuLabelSelectedBorder;
		this.menuLabels.equipment.style.backgroundColor = g.colors.menuLabelSelectedBackground;
		this.menuInfo.equipment.style.visibility = 'visible';
		for (var equipIndex = 0 ; equipIndex < this.equipmentListCells.length ; equipIndex++)
		{
			var equipment;
			var equipmentName;
			if (equipIndex < g.game.player.equipment.length)
			{
				equipment = g.game.player.equipment[equipIndex];
				equipmentName = equipment.name;
			}
			else
			{
				equipment = 'NOTHING';
				equipmentName = '';
			}
			var equipmentCell = this.equipmentListCells[equipIndex];
			var p = g.game.player;
			equipmentCell.innerHTML = '&middot;' + equipmentName;
			if (equipment === p.equipedWeapon || equipment === p.equipedArmor || equipment === p.equipedHelmet)
			{
				equipmentCell.innerHTML += ' (equipped)';
			}
		}

		//Set equpment info divs to invisible
		this.internalEquipmentInfo.weapon.style.visibility = 'hidden';
		this.internalEquipmentInfo.armor.style.visibility = 'hidden';
		this.internalEquipmentInfo.equipedWeapon.style.visibility = 'hidden';


	}
	else if (g.game.state === 'MENU.POWERS')
	{
		this.menuLabels.powers.style.border = g.menuLabelSelectedBorder;
		this.menuLabels.powers.style.backgroundColor = g.colors.menuLabelSelectedBackground;
		this.menuInfo.powers.style.visibility = 'visible';
		//this.powersMenu.description.style.display = 'default'; 

		//Make the background colors of all the powers transparent
		for (var i = 0 ; i < this.powersMenu.powerDivs.length ; i++)
		{
			var powerDiv = this.powersMenu.powerDivs[i];
			var color = 'transparent';
			powerDiv.style.backgroundColor = color;
		}

		this.powersMenu.description.innerHTML = ''; //Clear the description box
		this.powersMenu.powerAtts.innerHTML = '';
	}
}

View.prototype.closeMenu = function()
{
	for (var menuName in this.menuInfo)
	{
		var subMenu = this.menuInfo[menuName];
		var label = this.menuLabels[menuName];
		subMenu.style.visibility = 'hidden';
		//subMenu.style.display = 'none';
		label.style.backgroundColor = g.colors.menuLabelDefault;
		label.style.border = null;
	}
	//Unhighlight all the equipment cells
	for (var i = 0 ; i < this.equipmentListCells.length ; i++)
	{
		this.equipmentListCells[i].style.backgroundColor = 'transparent';
	}
	//Set the display divs in the equipment menu to invisible 
	this.internalEquipmentInfo.weapon.style.visibility = 'hidden';
	this.internalEquipmentInfo.armor.style.visibility = 'hidden';
	this.internalEquipmentInfo.equipedWeapon.style.visibility = 'hidden';
	this.internalEquipmentInfo.equipedArmor.style.visibility = 'hidden';
	//this.menu.style.visibility = 'hidden';
	this.menu.style.display = 'none';
}



View.prototype.selectPowerInMenu = function()
{
	var powerNum = g.game.selectedMenuItem;
	var selectedPower = g.game.player.powers[powerNum];

	//If it's the first power, we just came from selecting the label. Therefore, change the label color
	if (powerNum === 0)
	{
		this.menuLabels.powers.style.backgroundColor = g.colors.menuLabelDefaultBackground;
	}

	for (var i = 0 ; i < this.powersMenu.powerDivs.length ; i++)
	{
		var powerDiv = this.powersMenu.powerDivs[i];
		var power = g.game.player.powers[i];

		var color = 'transparent';
		if (i === powerNum)
		{
			color = g.COLORCONSTANTS.YELLOW;
		}
		powerDiv.style.backgroundColor = color;

		//Make the opacity of the cells appropriate for the given level of upgrades
		var currCells = this.powersMenu.powerCells[i];
		for (var j = 0 ; j < currCells.length ; j++)
		{
			var opacity = .5;
			if ((j <= power.upgradesActivated && j!== 0) || (j === 0 && power.unlocked))//If it's less than the number of upgrades activated, or it's the first cell and the power has been unlocked
			{
				opacity = 1;
			}

			currCells[j].style.opacity = opacity;
		}
	}

	var description = selectedPower.atts.description;
	this.powersMenu.description.innerHTML = description;


	var energyUseSection = '';
	var timeSection = '';
	var noiseSection = '';

	if (selectedPower.atts.powerType !== "PASSIVE") //If it's not a passive power, it has some energy use
	{
		energyUseSection = '<b>Energy Use:</b> ' + selectedPower.atts.energyConsumption
	}
	if (selectedPower.atts.powerType === "ACTIVATED") //If it's an activated power, it also has noise and time taken
	{
		timeSection = '&nbsp;&nbsp;&nbsp;<b>Time:</b> ' + selectedPower.atts.timeTaken;
		noiseSection = '&nbsp;&nbsp;&nbsp;<b>Noise:</b> ' + selectedPower.atts.noise;
	}


	this.powersMenu.powerAtts.innerHTML = energyUseSection + timeSection + noiseSection;

}





View.prototype.selectAttributeInMenu = function()
{
	var item = g.game.selectedMenuItem;

	this.menuLabels.character.style.backgroundColor = g.colors.menuLabelDefaultBackground;	

	var i = 0;
	var selectedAttribute = false; //Used to get the description text for the attribute
	for (var attribute in this.characterInfoContainers)
	{
		var container = this.characterInfoContainers[attribute];
		if (i === item)
		{
			container.style.backgroundColor = g.COLORCONSTANTS.YELLOW;
			selectedAttribute = attribute;
		}
		else
		{
			container.style.backgroundColor = 'transparent';
		}
		i++;
	}

	//Set the description of the attribute
	var infoDiv = this.attributeInfoDiv;
	var description = '';
	if (selectedAttribute)
	{
		description = g.attributeDescriptions[selectedAttribute];
	}
	infoDiv.innerHTML = description;
}





//Highlights the selected equipment item
View.prototype.selectEquipmentItem = function()
{
	var selectedItemNumber = g.game.selectedMenuItem;
	if (selectedItemNumber === 'LABEL')
	{
		return;
	}
	var item = g.game.player.equipment[selectedItemNumber];
	//Unhighlight the label and other cells except the selected one
	this.menuLabels.equipment.style.backgroundColor = g.colors.menuLabelDefaultBackground;
	for (var i = 0 ; i < g.game.player.equipment.length ; i++)
	{
		var equipmentCell = this.equipmentListCells[i];
		if (i === selectedItemNumber)
		{
			equipmentCell.style.backgroundColor = g.colors.menuSelectionBackground;
		}
		else {
			equipmentCell.style.backgroundColor = 'transparent';
		}
	}

	//Set up equipment info div
	if (item.type === 'GUN' || item.type === 'MELEE')
	{

		var gun = item;
		var p = g.game.player;
		var damageInnerHTML;
		var chanceInnerHTML;
		var damageB = gun.damageB;
		var damageM = gun.damageM;
		var damageP = gun.damageP.slice(0, 3);
		var damage = gun.damageB + gun.damageM * g.game.player[gun.damageP];
		damageInnerHTML = damageB + ' + ' + damageM + ' x [' + damageP + '] = ' + damage;
		var chance;
		if (item.type === 'GUN')
		{
			var chanceB = gun.chanceB;
			var chanceM = gun.chanceM;
			var chanceP = gun.chanceP.slice(0, 3);
			chance = gun.chanceB + gun.chanceM * g.game.player[gun.chanceP];
			chanceInnerHTML = chanceB + ' + ' + chanceM + ' x [' + chanceP + '] = ' + chance + '%';
		}
		else if (item.type === 'MELEE')
		{
			chance = 100;
			chanceInnerHTML = '100%';
		}
		
		
		var attackTime = gun.attackTime;

		this.internalEquipmentInfo.weapon.style.visibility = 'visible';
		this.internalEquipmentInfo.equipedWeapon.style.visibility = 'visible';
		this.internalEquipmentInfo.armor.style.visibility = 'hidden';
		this.internalEquipmentInfo.equipedArmor.style.visibility = 'hidden';

		this.equipmentInfoSpans.name.innerHTML = gun.name;
		this.equipmentInfoSpans.damage.innerHTML = damageInnerHTML;
		this.equipmentInfoSpans.averageDamagePerTick.innerHTML = Math.round(100 * chance / 100 * damage / attackTime) / 100;
		this.equipmentInfoSpans.range.innerHTML = Math.floor(gun.range);
		this.equipmentInfoSpans.accuracy.innerHTML = chanceInnerHTML;
		this.equipmentInfoSpans.noise.innerHTML = gun.noise;
		this.equipmentInfoSpans.attackTime.innerHTML = attackTime + ' ticks';
		this.equipmentInfoSpans.reloadTime.innerHTML = gun.reloadTime ? gun.reloadTime : "Doesn't Reload";
		this.equipmentInfoSpans.clipSize.innerHTML = gun.clipSize ? gun.clipSize : "Doesn't Have a Clip";
		this.equipmentInfoSpans.spreadAngle.innerHTML = gun.spreadAngle + '&deg;';
		this.equipmentInfoSpans.followThrough.innerHTML = gun.followThrough + ' units';
		this.equipmentInfoSpans.knockBack.innerHTML = gun.knockBack;
		
		var e = this.equipmentInfoSpans;
		
		var selectedValues = [(damage), (chance / 100 * damage / gun.attackTime),
				Math.floor(gun.range), (chance),
				gun.noise, gun.attackTime, gun.reloadTime, gun.clipSize,
				gun.spreadAngle, gun.followThrough, gun.knockBack];
		var equipedValues = [p.getWeaponDamage(), p.getWeaponAverageDamagePerTick(), Math.floor(p.getWeaponRange()), p.getWeaponAccuracy(),
				p.getWeaponNoise(), p.getWeaponAttackTime(), p.getWeaponReloadTime(), p.getWeaponClipSize(), p.getWeaponSpreadAngle(),
				p.getWeaponFollowThrough(), p.getWeaponKnockBack()];
		var spans = [e.damage, e.averageDamagePerTick, e.range, e.accuracy, e.noise, e.attackTime, e.reloadTime, e.clipSize, e.spreadAngle, e.followThrough, e.knockBack];
		for (var i = 0 ; i < selectedValues.length ; i++)
		{
			var color = g.COLORCONSTANTS.BLACK; //Default
			var selectedValue = selectedValues[i];
			var equipedValue = equipedValues[i];
			selectedValue = round(selectedValue, 3);
			equipedValue = round(equipedValue, 3);

			var span = spans[i];
			//If negative is better (hardcoded)
			if (i === 6 || i === 4 || i === 5)
			{
				if (selectedValue > equipedValue)
				{
					color = g.COLORCONSTANTS.RED;
				}
				else if (selectedValue < equipedValue)
				{
					color = g.COLORCONSTANTS.BRIGHTGREEN;
				}
			}
			else
			{
				if (selectedValue > equipedValue)
				{
					color = g.COLORCONSTANTS.BRIGHTGREEN;
				}
				else if (selectedValue < equipedValue)
				{
					color = g.COLORCONSTANTS.RED;
				}
			}

			if (equipedValue === false || typeof equipedValue === 'undefined')
			{
				color = g.COLORCONSTANTS.BLACK;
			}

			span.style.color = color;
		}

		//Set equiped weapon stats
		var equipedSpans = this.equipmentInfoSpansEquiped;
		gun = p.equipedWeapon;
		equipedSpans.name.innerHTML = p.getWeaponName();
		equipedSpans.damage.innerHTML = gun === false ? p.getWeaponDamage() : gun.damageB + ' + ' + gun.damageM + ' x [' + gun.damageP.slice(0, 3) + '] = ' + p.getWeaponDamage();
		equipedSpans.averageDamagePerTick.innerHTML = Math.round(100 * p.getWeaponAverageDamagePerTick()) / 100;
		equipedSpans.range.innerHTML = Math.floor(p.getWeaponRange());	
		equipedSpans.chance.innerHTML = gun === false || gun.type === 'MELEE'? p.getWeaponAccuracy() + '%' : gun.chanceB + ' + ' + gun.chanceM + ' x ' + gun.chanceP.slice(0, 3) + ' = ' + p.getWeaponAccuracy() + '%';
		equipedSpans.noise.innerHTML = p.getWeaponNoise();
		equipedSpans.shootTime.innerHTML = p.getWeaponAttackTime() + ' ticks';
		equipedSpans.reloadTime.innerHTML = p.getWeaponReloadTime() !== false ? p.getWeaponReloadTime() : "Doesn't Reload";
		equipedSpans.clipSize.innerHTML = p.getWeaponClipSize() !== false ? p.getWeaponClipSize() : "Doesn't Have Clip";
		equipedSpans.spreadAngle.innerHTML = p.getWeaponSpreadAngle() + '&deg;';
		equipedSpans.followThrough.innerHTML = p.getWeaponFollowThrough() + ' units';
		equipedSpans.knockBack.innerHTML = p.getWeaponKnockBack();
	}
	else //If it's a helmet or piece of armor 
	{

		var type; //Used for the innerHTML if no helmet/armor is equiped
		var equipedArmor;
		if (item.type === "ARMOR")
		{
			type = 'Armor';
			equipedArmor = g.game.player.equipedArmor;
		}
		else if (item.type === 'HELMET')
		{
			type = 'Helmet';
			equipedArmor = g.game.player.equipedHelmet;
		}

		var spans = this.armorInfoSpans;

		this.internalEquipmentInfo.armor.style.visibility = 'visible';
		this.internalEquipmentInfo.equipedArmor.style.visibility = 'visible';
		this.internalEquipmentInfo.weapon.style.visibility = 'hidden';
		this.internalEquipmentInfo.equipedWeapon.style.visibility = 'hidden';

		var positiveIsGood = ['damageReduction', 'dodgeChanceEffect', 'viewDistanceEffect', 'viewAngleEffect', 'maxHealthEffect', 'healthRechargeEffect', 'maxEnergyEffect', 'energyRechargeEffect'];//Array of attributes where a positive value is good for the player
		var negativeIsGood = ['moveNoiseEffect', 'visibilityEffect']//Array of attributes where a negative value is good for the player


		for (var name in spans)
		{
			var color; 
			var plusOrMinus = Number(item[name]) > 0 ? '+' : '';

			if (positiveIsGood.indexOf(name) !== -1)//Positive = good
			{
				if (equipedArmor)
				{
					if (item[name] > equipedArmor[name])
					{
						color = g.COLORCONSTANTS.BRIGHTGREEN;
					}
					else if (item[name] < equipedArmor[name])
					{
						color = g.COLORCONSTANTS.RED;
					}
					else
					{
						color = g.COLORCONSTANTS.BLACK;
					}
				}
				else
				{
					color = g.COLORCONSTANTS.BLACK;
				}
			}
			else if (negativeIsGood.indexOf(name) !== -1) //Positive = bad
			{
				if (equipedArmor)
				{
					if (item[name] > equipedArmor[name])
					{
						color = g.COLORCONSTANTS.RED;
					}
					else if (item[name] < equipedArmor[name])
					{
						color = g.COLORCONSTANTS.BRIGHTGREEN;
					}
					else
					{
						color = g.COLORCONSTANTS.BLACK;
					}
				}
				else
				{
					color = g.COLORCONSTANTS.BLACK;
				}
			}
			else //If it's the name div
			{
				color = g.COLORCONSTANTS.BLACK;
				plusOrMinus = '';
			}

			spans[name].style.color = color;
			spans[name].innerHTML = plusOrMinus + item[name];
		}
		//Set equiped armor thing
		

		if (item.type === "ARMOR")
		{
			item = g.game.player.equipedArmor;
		}
		else if (item.type === 'HELMET')
		{
			item = g.game.player.equipedHelmet;
		}

		var equipedDiv = this.internalEquipmentInfo.equipedArmor;
		var innerHTML = '<h4>EQUIPED:</h4>';

		if (item !== false) //If we have a helmet/armor equiped
		{

			var labels = ['', 'Damage Reduction: ', 'Dodge Chance Effect: ', 'Move Noise Effect: ', 'Visibility Effect: ',
					'View Distance Effect: ', 'View Angle Effect: ', 'Max Health Effect: ', 'Health Recharge Effect: ',
					'Max Energy Effect: ', 'Energy Recharge Effect: '];
			var values = [item.name, item.damageReduction, item.dodgeChanceEffect, item.moveNoiseEffect, item.visibilityEffect,
					item.viewDistanceEffect, item.viewAngleEffect, item.maxHealthEffect, item.healthRechargeEffect,
					item.maxEnergyEffect, item.energyRechargeEffect];

			for (var i = 0 ; i < labels.length ; i++)
			{
				var label = labels[i];
				var value = values[i];

				if (i === 0) //If it's the name thing, give it a css rule so it'll be all good
				{
					innerHTML += '<div class="armorMenuNameDiv">' + value + '</div>'
				}
				else
				{
					var plusModifier = '';
					if (value > 0)
					{
						plusModifier = '+'
					}
					innerHTML += '<div><b>' + label + ':</b> ' + plusModifier + value + '</div>';
				}
			}
		}
		else
		{
			innerHTML = '<h1>No ' + type + ' <br/>Equiped</h1>';
		}

		equipedDiv.innerHTML = innerHTML;


		//Set visible tiles
		g.game.player.setVisibleTiles();
	}
	this.setCharacterMainDiv();
}




View.prototype.selectMainMenuItem = function()
{
	var selection = g.game.selectedMenuItem;

	var i = 0;
	for (var name in this.mainMenuContainers)
	{
		var cont = this.mainMenuContainers[name];
		if (selection === i)
		{
			cont.style.backgroundColor = g.COLORCONSTANTS.GOLD;
		}
		else
		{
			cont.style.backgroundColor = 'transparent';
		}
		i++;
	}
}


View.prototype.selectRaceMenuItem = function()
{
	var selection = g.game.selectedMenuItem;

	var i = 0;
	var raceDescription = '';
	for (var name in this.raceMenuContainers)
	{
		var cont = this.raceMenuContainers[name];
		if (selection === i)
		{
			cont.style.backgroundColor = g.COLORCONSTANTS.GOLD;
			raceDescription = g.playerRaces[name];
		}
		else
		{
			cont.style.backgroundColor = 'transparent';
		}
		i++;
	}

	this.raceDescription.innerHTML = raceDescription;
}




View.prototype.selectClassMenuItem = function()
{
	var selection = g.game.selectedMenuItem;

	var i = 0;
	var classDescription = '';

	for (var name in this.classMenuContainers)
	{
		var cont = this.classMenuContainers[name];
		if (selection === i)
		{
			cont.style.backgroundColor = g.COLORCONSTANTS.GOLD;
			classDescription = g.playerClasses[name];
		}
		else
		{
			cont.style.backgroundColor = 'transparent';
		}
		i++;
	}

	this.classDescription.innerHTML = classDescription;
}







View.prototype.setPowersMainDiv = function()
{
	var spans = this.powersMainSpans;
	var pPowers = g.game.player.powers;
	for (var i = 0 ; i < spans.length ; i++)
	{
		var currSpan = spans[i];
		var text;
		var p;
		if (i >= pPowers.length)//If the index has gone beyond how many powers the player has
		{
			text = '';
		}
		else
		{
			p = pPowers[i];
			text = p.name;
		}

		currSpan.innerHTML = text;

		if (p.unlocked === false)
		{
			currSpan.style.opacity = .5;
		}
		else 
		{
			currSpan.style.opacity = 1;
		}

		if (typeof p.currentlyActivated !== 'undefined' && p.currentlyActivated)
		{
			currSpan.style.backgroundColor = g.COLORCONSTANTS.BRIGHTPURPLE;
		}
		else
		{
			currSpan.style.backgroundColor = 'transparent';
		}
	}
}




View.prototype.highlightPower = function(pIndex)
{
	var span = this.powersMainSpans[pIndex];
	span.style.backgroundColor = g.COLORCONSTANTS.BRIGHGREEN;
}

View.prototype.unhighlightPower = function(pIndex)
{
	var span = this.powersMainSpans[pIndex];
	span.style.backgroundColor = 'transparent';
}




View.prototype.setEquipmentMainDiv = function()
{
	var p = g.game.player;
	var innerHTMLArray = [];
	innerHTMLArray.push(p.get('weaponName'));
	innerHTMLArray.push(p.get('weaponDamage'));
	innerHTMLArray.push(p.getWeaponAverageDamagePerTick());
	innerHTMLArray.push(p.get('weaponRange'));
	innerHTMLArray.push(p.get('weaponAccuracy'));
	innerHTMLArray.push(p.get('weaponNoise'));
	innerHTMLArray.push(p.get('weaponAttackTime'));
	innerHTMLArray.push(p.get('weaponReloadTime') !== false ? '<b>Reload Time:</b> ' + p.get('weaponReloadTime') : '');
	//innerHTMLArray.push(p.get('weaponArmorPiercing') ? '<b>Armor Piercing:</b> ' + p.get('weaponArmorPiercing') : '');
	innerHTMLArray.push(p.get('weaponClipSize') !== false ? '<b>Clip:</b> ' + p.get('weaponLoadedAmmo') + '/' + p.get('weaponClipSize') : '');


	var i = 0;
	for (var name in this.equipmentInfoMainSpans)
	{
		var span = this.equipmentInfoMainSpans[name];
		span.innerHTML = innerHTMLArray[i];
		i++;
	}
}




View.prototype.setSkillPoints = function()
{
	this.skillPoints.innerHTML = g.game.playerSkillPoints;
}

View.prototype.setPowerPoints = function()
{
	this.powerPoints.innerHTML = g.game.playerPowerPoints;
}




View.prototype.updateClip = function()
{
	var span = this.equipmentInfoMainSpans.weaponClipSize;
	span.innerHTML = '<b>Clip:</b> ' + g.game.player.get('weaponLoadedAmmo') + '/' + g.game.player.get('weaponClipSize');
}





View.prototype.setCharacterMainDiv = function()
{
	var p = g.game.player;
	var healthBarWidth = this.characterInfoMainDivStyle.barWidth * p.get('health') / p.get('maxHealth');
	healthBarWidth = Math.round(healthBarWidth);
	var energyBarwidth = this.characterInfoMainDivStyle.barWidth * p.get('energy') / p.get('maxEnergy');
	energyBarWidth = Math.round(energyBarwidth);

	this.characterInfoMainSpans.healthBar.style.width = healthBarWidth + 'px';
	this.characterInfoMainSpans.energyBar.style.width = energyBarwidth + 'px';

	var spans = this.characterInfoMainSpans; //Should've just done this earlier but whatevs

	var stance = g.game.player.stance;

	spans.sneaking.style.backgroundColor = 'transparent';
	spans.walking.style.backgroundColor = 'transparent';
	spans.running.style.backgroundColor = 'transparent';

	spans[stance.toLowerCase()].style.backgroundColor = g.COLORCONSTANTS.BRIGHTGREEN;
	
	var moveTimeColor = g.COLORCONSTANTS.BLACK;
	var moveNoiseColor = g.COLORCONSTANTS.BLACK;
	if (stance === "SNEAKING")
	{
		moveTimeColor = g.COLORCONSTANTS.RED;
		moveNoiseColor = g.COLORCONSTANTS.GREEN;
	}
	else if (stance === 'RUNNING')
	{
		moveTimeColor = g.COLORCONSTANTS.GREEN;
		moveNoiseColor = g.COLORCONSTANTS.RED;
	}

	var spansToSkip = ['healthBar', 'energyBar', 'sneaking', 'walking', 'running'];

	for (var name in this.characterInfoMainSpans)
	{
		if (spansToSkip.indexOf(name) !== -1)
		{
			continue;
		}


		var span = this.characterInfoMainSpans[name];
		//span.innerHTML = Math.round(p.get(name));
		span.innerHTML = Math.round(100 * p['get' + name]()) / 100;
		if (name === 'MoveTime')
		{
			span.style.color = moveTimeColor
		}
		else if (name === 'MoveNoise')
		{
			span.style.color = moveNoiseColor;
		}
		
	}
}










View.prototype.setEnemyDivMain = function()
{
	if (g.game.selectedTile === false)
	{
		this.enemyInfoMainDiv.style.display = 'none';
		return;
	}
	
	var enemy = g.game.selectedTile.unit;
	if (enemy === false || enemy === g.game.player)
	{
		this.enemyInfoMainDiv.style.display = 'none';
	}
	else {
		this.enemyInfoMainDiv.style.display = 'initial';
		var spans = this.enemyInfoMainSpans;
		var barWidth = this.enemyInfoMainDivStyle.barWidth;
		spans.name.innerHTML = enemy.enemyText;
		spans.healthBar.style.width = Math.round(barWidth * enemy.get('health') / enemy.get('maxHealth')) + 'px';
		spans.health.innerHTML = enemy.get('health');
		spans.maxHealth.innerHTML = enemy.get('maxHealth');

		if (enemy.maxEnergy === 0)
		{
			spans.energyBar.style.width = '0px';
		}
		else
		{
			spans.energyBar.style.width = Math.round(barWidth * enemy.get('energy') / enemy.get('maxEnergy'))  + 'px';
		}
		spans.energy.innerHTML = enemy.get('energy');
		spans.maxEnergy.innerHTML = enemy.get('maxEnergy');

		spans.damage.innerHTML = enemy.get('weaponDamage');
		spans.range.innerHTML = enemy.get('weaponRange');
		spans.chance.innerHTML = enemy.get('weaponAccuracy');
		spans.attackTime.innerHTML = enemy.get('weaponAttackTime');
		spans.reloadTime.innerHTML = enemy.get('weaponReloadTime') === false ? "Doesn't reload" : enemy.get('weaponReloadTime');
		spans.dodgeChance.innerHTML = enemy.get('dodgeChance');
		spans.armor.innerHTML = enemy.get('damageReduction');
		spans.moveTime.innerHTML = enemy.get('moveTime');
		spans.direction.innerHTML = enemy.get('direction');
	}
}




View.prototype.setDepth = function()
{
	this.depthSpan.innerHTML = g.game.depth;
}

View.prototype.setOrb = function(found)
{
	this.orbSpan.innerHTML = found ? 'Yes' : 'No';
}




View.prototype.startExplodedGraphics = function()
{
	if (this.explodedGraphicsOn === true)
	{
		return;
	}
	this.explodedGraphicsOn = true;

	var explodedCells = [];

	//only add the cells that the player can see
	for (var i = g.game.explodedTiles.length - 1 ; i >= 0 ; i--)
	{
		var t = g.game.explodedTiles[i];
		if (g.game.player.visibleTiles.indexOf(t) !== -1)
		{
			explodedCells.push(this.getCellFromTile(t));
		}
		
	}

	var delay = 10; //Time between opacity reductions
	var numberOfBlinks = 50;

	for (var i = 0 ; i < explodedCells.length ; i++)
	{
		var cell = explodedCells[i];
		cell.fillRect(g.colors.explosion, 'graphics1');
	}

	var fadeTiles = function(blinkNumber)
	{
		if (blinkNumber === 0)
		{
			g.game.explodedTiles = [];
			g.view.explodedGraphicsOn = false;
			g.view.canvases.graphics1.style.opacity = 1;
			for (var i = 0 ; i < explodedCells.length ; i++)
			{
				var cell = explodedCells[i];
				cell.clearRect('graphics1');
			}
			return;
		}

		var currentOpacity = blinkNumber / numberOfBlinks;
		g.view.canvases.graphics1.style.opacity = currentOpacity;
		setTimeout(function(){fadeTiles(blinkNumber - 1);}, delay);

	}

	fadeTiles(numberOfBlinks);
}





View.prototype.startDamageGraphics = function()
{
	if (this.damageGraphicsOn)//If there's already graphics happening
	{
		return;
	}

	this.damageGraphicsOn = true;

	//Remove any actors no longer visible to the player form tookDamage
	for (var i = g.game.tookDamage.length - 1 ; i >= 0 ; i--)
	{
		var actor = g.game.tookDamage[i];
		if (g.game.player.visibleTiles.indexOf(actor.tile) === -1)//If the player can't see it, remove it from tookDamage
		{
			g.game.tookDamage.splice(i, 1);
		}
	}


	var delay = 100; //Time between blinks in ms;
	var numberOfBlinks = 2;
	var blinkUnits = function(blinkNumber)
	{
		if (blinkNumber === 0)
		{
			g.game.tookDamage = [];
			g.view.damageGraphicsOn = false;
			return;
		}
		//Do the damage graphics
		if (blinkNumber % 2 === 1)
		{	
			for (var i = 0 ; i < g.game.tookDamage.length ; i++)
			{
				var unit = g.game.tookDamage[i];
				if (unit.dead)
				{
					continue;
				}
				var color;
				var character;
				if (g.view.showDirections)
				{
					character = g.view.directionIndexToString(unit.direction);
					if (unit === g.game.player)
					{
						color = g.COLORCONSTANTS.PLAYER;
					}
					else
					{
						if (unit.alignment !== 'ALLY')
						{
							color = g.colors[unit.behavior];
						}
						else //If it's an ally
						{
							color = g.colors.ALLY;
						}
					}
				}
				else
				{
					if (unit === g.game.player)
					{
						character = g.chars.PLAYER;
						color = g.colors.PLAYER;
					}
					else
					{
						if (unit.alignment !== 'ALLY')
						{
							color = g.colors[unit.behavior];
						}
						else //If it's an ally
						{
							color = g.colors.ALLY;
						}
						character = g.chars[unit.enemyType];
					}
				}
				var cell = g.view.getCellFromTile(unit.tile);
				cell.fillStyle = color;
				cell.fillText(character, color, 'units');
			}
		}
		else
		{
			for (var i = 0 ; i < g.game.tookDamage.length ; i++)
			{
				var unit = g.game.tookDamage[i];
				var cell = g.view.getCellFromTile(unit.tile);
				cell.clearRect('units');
			}
		}

		setTimeout(function(){blinkUnits(blinkNumber - 1);}, delay);
	}

	
	blinkUnits(numberOfBlinks * 2);
}












//Centers the view on tile
View.prototype.centerOnTile = function(tile)
{
	if (g.game.DEBUG.keepViewCentered)
	{
		var widthHalf = Math.round(this.widthInCells / 2);
		var heightHalf = Math.round(this.heightInCells / 2);
		this.viewX = Math.round(g.game.level.width / 2 - widthHalf);
		this.viewY = Math.round(g.game.level.height / 2 - heightHalf);
		return;
	}
	this.centerOn(tile.x, tile.y);
}



//Centers the view on (x, y)
View.prototype.centerOn = function(x, y){

	if (g.game.DEBUG.keepViewCentered)
	{
		var widthHalf = Math.round(this.widthInCells / 2);
		var heightHalf = Math.round(this.heightInCells / 2);
		this.viewX = Math.round(g.game.level.width / 2 - widthHalf);
		this.viewY = Math.round(g.game.level.height / 2 - heightHalf);
		return;
	}
	//Get top left corner x and y
	var widthHalf = Math.round(this.widthInCells / 2);
	var heightHalf = Math.round(this.heightInCells / 2);

	var newX = x - widthHalf;
	var newY = y - heightHalf;

	/*
	if(newX < 0)
	{
		newX = 0;
	}
	if(newY < 0)
	{
		newY = 0;
	}
	if(newX > g.game.level.width - this.widthInCells)
	{
		newX = g.game.level.width - this.widthInCells;
	}
	if (newY > g.game.level.height - this.heightInCells)
	{
		newY = g.game.level.height - this.heightInCells;
	}
	*/

	this.viewX = newX;
	this.viewY = newY;
}


//Returns the cell object corresponding to the tile object. Retursn false if the tile is out of the view range
View.prototype.getCellFromTile = function(tile){
	var x = tile.x;
	var y = tile.y;
	if (x < this.viewX || x >= this.viewX + this.widthInCells)
	{
		return false;
	}
	if (y < this.viewY || y >= this.viewY + this.heightInCells)
	{
		return false;
	}
	//If it's in the view range
	return this.getCell(x - this.viewX, y - this.viewY);
}


//Returns the tile object corresponding to the cell object if it exists.
View.prototype.getTileFromCell = function(cell)
{
	var x = cell.x;
	var y = cell.y;
	var tileX = this.viewX + x;
	var tileY = this.viewY + y;
	if (tileX < 0 || tileX >= g.game.level.widthInCells || tileY < 0 || tileY >= g.game.level.heightInCells)
	{
		return false;
	}
	return g.game.level.getTile(tileX, tileY);
}


View.prototype.getCell = function(x, y)
{
	if (x < 0 || x >= this.widthInCells)
	{
		return false;
	}
	if (y < 0 || y >= this.heightInCells)
	{
		return false;
	}
	if (typeof this.cells[x] === 'undefined')
	{
		console.log(x + ', ' + y);
		console.log(arguments.callee.caller.name);
		return;
	}
	return this.cells[x][y];
}




View.prototype.setLightingEmphasis = function()
{
	var emph = g.game.lightingEmphasis;
	var multiplier = Math.pow(emph, 1.5);

	this.canvases.lighting.style.opacity = Math.round(this.lightingOpacity * multiplier * 100) / 100;

	this.set();
}




View.prototype.directionIndexToString = function(index)
{
	var character;
	switch (index)
	{
		case 0:
			character = g.chars.UP;
			break;
		case 1:
			character = g.chars.RIGHT;
			break;
		case 2:
			character = g.chars.DOWN;
			break;
		case 3:
			character = g.chars.LEFT;
			break;
	}
	return character;
}





View.prototype.initializeMainMenu = function()
{
	//document.body.style.backgroundColor = 'black';
	//Create the menu container
	var mainMenu = document.createElement('div');
	var menuWidth = 1000;
	document.body.appendChild(mainMenu);
	//mainMenu.style.backgroundColor = 'black';
	mainMenu.style.position = 'absolute';
	//mainMenu.style.width = menuWidth + 'px';
	mainMenu.style.width = "100%";
	mainMenu.style.height = '600px';
	mainMenu.style.textAlign = 'center';
	//Print the title
	var title = document.createElement('h1');
	title.innerHTML = "GUNMAGE";
	//title.innerHTML = title.innerHTML.replace("GAME", "<strike>GAME</strike>") + " CENSORSHIP!";
	title.style.color = 'gold';
	title.style.fontSize = '50pt';
	title.style.color = g.COLORCONSTANTS.WHITE;
	//title.style.width = menuWidth + 'px';
	title.style.width = "100%";
	title.style.textAlign = 'center';
	title.style.marginBottom = '200px';
	//title.style.position = 'absolute';
	//title.style.left = '300px';
	mainMenu.appendChild(title);

	var instructions = document.createElement('h3');
	instructions.innerHTML = "Use the arrow keys to make a selection";
	instructions.style.color = 'gold';
	instructions.style.fontSize = '20pt';
	instructions.style.color = g.COLORCONSTANTS.WHITE;
	instructions.style.width = "100%";
	instructions.style.textAlign = 'center';
	instructions.style.marginBottom = '50px';
	mainMenu.appendChild(instructions);

	for (var name in this.mainMenuContainers)
	{
		var container = document.createElement('div');
		mainMenu.appendChild(container);
		container.innerHTML = name;
		if (name === 'TUTORIAL')
		{
			container.innerHTML += ' (ONLY THE FIRST LEVEL IS IMPLEMENTED)';
		}
		container.style.margin = 'auto';
		container.style.marginBottom = '30px';
		container.style.color = g.COLORCONSTANTS.BRIGHTPURPLE;
		container.style.fontSize = '25pt';
		container.style.width = '500px';
		this.mainMenuContainers[name] = container;
	}
}



View.prototype.initializeRaceMenu = function()
{
	//document.body.style.backgroundColor = 'black';
	var raceMenu = document.createElement('div');
	var menuWidth = 1000;
	document.body.appendChild(raceMenu);
	//raceMenu.style.backgroundColor = 'black';
	raceMenu.style.position = 'absolute';
	raceMenu.style.width = menuWidth + 'px';
	raceMenu.style.height = '600px';
	raceMenu.style.textAlign = 'left';
	raceMenu.style.padding = '20px';
	raceMenu.style.fontSize = '20pt';

	//Set up title
	var title = document.createElement('div');
	title.innerHTML = 'Pick a race: ';
	title.style.color = g.COLORCONSTANTS.PURPLE;
	raceMenu.appendChild(title);

	for (var raceName in g.playerRaces)
	{
		var race = document.createElement('div');
		raceMenu.appendChild(race);
		race.innerHTML = raceName;
		race.style.color = g.COLORCONSTANTS.BLACK;
		race.style.margin = '20px';
		race.style.marginLeft = '50px';
		race.style.width = '200px';
		this.raceMenuContainers[raceName] = race;
	}

	var description = document.createElement('div');
	raceMenu.appendChild(description);
	description.style.position = 'absolute';
	description.style.left = '700px';
	description.style.top = '20px';
	description.style.width = '400px';
	description.style.height = '300px';
	description.style.padding = '20px';
	description.style.backgroundColor = g.COLORCONSTANTS.LIGHTBLUE;
	this.raceDescription = description;

}



View.prototype.initializeClassMenu = function()
{
	//document.body.style.backgroundColor = 'black';
	var classMenu = document.createElement('div');
	var menuWidth = 1000;
	document.body.appendChild(classMenu);
	//classMenu.style.backgroundColor = 'black';
	classMenu.style.position = 'absolute';
	classMenu.style.width = menuWidth + 'px';
	classMenu.style.height = '600px';
	classMenu.style.textAlign = 'left';
	classMenu.style.padding = '20px';
	classMenu.style.fontSize = '20pt';

	//Set up title
	var title = document.createElement('div');
	title.innerHTML = 'Pick a class: ';
	title.style.color = g.COLORCONSTANTS.PURPLE;
	classMenu.appendChild(title);

	for (var className in g.playerClasses)
	{
		var classContainer = document.createElement('div');
		classMenu.appendChild(classContainer);
		classContainer.innerHTML = className;
		classContainer.style.color = g.COLORCONSTANTS.BLACK;
		classContainer.style.margin = '20px';
		classContainer.style.marginLeft = '50px';
		classContainer.style.width = '200px';
		this.classMenuContainers[className] = classContainer;
	}

	var description = document.createElement('div');
	classMenu.appendChild(description);
	description.style.position = 'absolute';
	description.style.left = '700px';
	description.style.top = '20px';
	description.style.width = '400px';
	description.style.height = '300px';
	description.style.padding = '20px';
	description.style.backgroundColor = g.COLORCONSTANTS.LIGHTBLUE;
	this.classDescription = description;

}








View.prototype.initializeGameView = function(){
	//Iterate through the canvases to initialize them
	var zIndexInitial = -3;
	var zIndex = zIndexInitial;
	for (var canvasName in this.canvases){
		var canvas = this.canvases[canvasName];
		canvas.width = this.canvasStyle.width;
		canvas.height = this.canvasStyle.height;
		canvas.style.width = this.canvasStyle.width + 'px';
		canvas.style.height = this.canvasStyle.height + 'px';
		canvas.style.left = this.canvasStyle.left + 'px';
		canvas.style.top = this.canvasStyle.top + 'px';
		canvas.style.border = '1px solid black';
		canvas.style.position = 'absolute';
		canvas.style.zIndex = zIndex;
		zIndex++;

		var ctx = canvas.getContext('2d');
		ctx.font = g.fontSize + 'pt ' + g.fontFamily;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';

		if (canvasName === 'select')
		{
			canvas.style.opacity = .4;
		}
		else if (canvasName === 'lighting')
		{
			canvas.style.opacity = this.lightingOpacity;
		}
		else if (canvasName === 'vision')
		{
			canvas.style.opacity = .6;
		}
		else if (canvasName === 'stealth')
		{
			canvas.style.opacity = .5;
		}
		else if (canvasName === 'units')
		{	
			ctx.font = '900 ' + g.fontSize + 'pt ' + g.fontFamily;
		}

		document.body.appendChild(canvas);
	}

	//Fill the cell array
	for (var x = 0 ; x < this.widthInCells ; x++)
	{
		this.cells.push([]);
		for (var y = 0 ; y < this.heightInCells ; y++)
		{
			var cell = new Cell(x, y);
			cell.initialize();
			this.cells[x].push(cell);
		}
	}

	
	//Initialize the menu
	this.initializeMenu();

	//Initialize info divs
	this.initializeInfoDivs();

	//Initialize message div
	this.initializeMessageTable();

	//Initialize alert div
	this.initializeAlertDiv();

	//Initalize opions menu
	this.initializeOptionsMenu();
	

	//Initialize the depth and orb info
	var containerStyle = {
		position: 'absolute',
		top: '530px',
		fontSize: '14pt',
	}

	var spanStyle = {
		fontWeight: 'bold',
		color: g.COLORCONSTANTS.LIGHTBLUE,
	}

	var depthContainer = document.createElement('div');
	document.body.appendChild(depthContainer);
	depthContainer.innerHTML = 'Depth: ';
	var depth = document.createElement('span');
	depthContainer.appendChild(depth);
	this.depthSpan = depth;
	depthContainer.style.left = '260px';

	var orbContainer = document.createElement('div');
	document.body.appendChild(orbContainer);
	orbContainer.innerHTML = 'Found orb on this level: ';
	var orb = document.createElement('span');
	orbContainer.appendChild(orb);
	this.orbSpan = orb;
	orbContainer.style.left = '400px';

	for (var name in containerStyle)
	{
		depthContainer.style[name] = containerStyle[name];
		orbContainer.style[name] = containerStyle[name];
	}

	for (var name in spanStyle)
	{
		depth.style[name] = spanStyle[name];
		orb.style[name] = spanStyle[name];
	}

	this.setDepth();
	this.setOrb(false);
	


	//Add control info div
	var controlInfo = document.createElement("div");
	controlInfo.innerHTML = `
		<table>
			<tr>
				<td><span class='controlKey'>Arrow Keys</span>: Move</td>
				<td><span class='controlKey'>Alt + Arrow Keys</span>: Turn (.5 x move time / 90&deg;)</td>
			</tr>
			<tr>
				<td><span class='controlKey'>Shift + Arrow Keys</span>: Move without turning (2x move time)</td>
				<td><span class='controlKey'>a</span>: Aim, attack(while aiming)</td>
			</tr>
			<tr>
				<td><span class='controlKey'>d</span>: Toggle display directions</td>
				<td><span class='controlKey'>x</span>: Toggle examine mode</td>
			</tr>
			<tr>
				<td><span class='controlKey'>m</span>: Open Character Menu</td>
				<td><span class='controlKey'>esc</span>: Open Main Menu</td>
			</tr>
			<tr>
				<td><span class='controlKey'>.</span>: Wait one tick</td>
				<td><span class='controlKey'>Shift + .</span>: Rest</td>
			</tr>
			<tr>
				<td><span class='controlKey'>Tab</span>: Toggle Move Mode</td>
			</tr>
		<table>
	`;
	$(controlInfo).attr("id", "control-info-main-div")
		.css("position", "absolute")
		.css("border", "3px solid black")
		.css("width", this.canvasStyle.width + "px")
		.css("height", "160px")
		.css("left", "250px")
		.css("top", "555px")
		.css("background-color", g.COLORCONSTANTS.BLUE)
		.appendTo("body");

	$("#control-info-main-div td").css("height", "26px")
		.css("font-size", "8pt")
		.css("padding", "1px");



	//Add tutorial message container (for later)
	var tM = document.createElement('div');
	document.body.appendChild(tM);
	tM.style.width = this.canvasStyle.width + 40 + 'px';
	tM.style.height = '300px';
	tM.style.left = this.canvasStyle.left - 40 + 'px';
	tM.style.top = '100px';
	tM.style.position = 'absolute';
	tM.style.backgroundColor = g.COLORCONSTANTS.BLUE;
	tM.style.color = g.COLORCONSTANTS.BRIGHTPURPLE;
	tM.style.zIndex = 10;
	tM.style.padding = '20px';
	tM.style.fontSize = '14pt';
	tM.style.border = '3px solid ' + g.COLORCONSTANTS.BLACK;
	tM.style.borderRadius = '5px';

	var tMInternal = document.createElement('div');
	tM.appendChild(tMInternal)
	tMInternal.style.textAlign = 'center';
	this.tutorialMessageDiv = tMInternal;

	var escape = document.createElement('div');
	tM.appendChild(escape);
	escape.innerHTML = '-- Press escape to exit --';
	escape.style.color = 'white';
	escape.style.position = 'absolute';
	escape.style.width = tM.style.width;
	escape.style.height = '100px';
	escape.style.top = '300px';
	escape.style.textAlign = 'center';

	tM.style.visibility = 'hidden';


	this.set();
}




View.prototype.initializeOptionsMenu = function()
{
	var oM = document.createElement('div');
	document.body.appendChild(oM);
	oM.style.left = this.canvasStyle.left + 20 + 'px';
	oM.style.top = '100px';
	oM.style.width = this.canvasStyle.width - 40 + 'px';
	oM.style.height = '150px';
	oM.style.position = 'absolute';
	oM.style.backgroundColor = g.COLORCONSTANTS.LIGHTBLUE;
	oM.style.zIndex = 15;
	oM.style.visibility = 'hidden';
	oM.style.border = '3px solid ' + g.COLORCONSTANTS.PURPLE;
	oM.style.borderRadius = '5px';
	this.optionsMenu = oM;

	for (var i = 0 ; i < 2 ; i++)
	{
		var option = document.createElement('div');
		oM.appendChild(option);
		//option.style.top = (100 + i * 40) + 'px';
		option.style.height = '30px';
		option.style.margin = '30';
		option.style.textAlign = 'center';
		option.style.color = g.COLORCONSTANTS.PURPLE;
		option.style.fontSize = '16pt';

		var innerHTML;
		if (i === 0) {innerHTML = 'RESUME'; this.optionsMenuOptionDivs.resume = option;}
		else {innerHTML = "DIE"; this.optionsMenuOptionDivs.quit = option;}

		option.innerHTML = innerHTML;
	}
}




View.prototype.initializeAlertDiv = function()
{
	var alerts = document.createElement('div');
	document.body.appendChild(alerts);
	this.alerts = alerts;
	alerts.style.position = 'absolute';
	alerts.style.left = this.alertsStyle.left + 'px';
	alerts.style.top = this.alertsStyle.top + 'px';
	alerts.style.width = this.alertsStyle.width + 'px';
	alerts.style.height = this.alertsStyle.height + 'px';
	alerts.style.fontSize = this.alertsStyle.fontSize + 'pt';
	alerts.style.zIndex = 100;
	alerts.style.textAlign = 'center';
	alerts.style.color = g.colors.alerts;
}





View.prototype.displayTutorialMessage = function(message)
{
	if (message.length > 700)
	{
		this.tutorialMessageDiv.style.fontSize = '11pt';
	}
	else
	{
		this.tutorialMessageDiv.style.fontSize = '14pt';
	}
	this.tutorialMessageDiv.parentElement.style.visibility = 'visible';
	this.tutorialMessageDiv.innerHTML = message;
}

View.prototype.eraseTutorialMessage = function()
{
	this.tutorialMessageDiv.parentElement.style.visibility = 'hidden';
}



/*
View.prototype.logAlert = function(alert)
{
	var div = this.alerts;
	//Set to one preemptively in case we're currently logging an alert
	var period = 50; //in ms

	var fadeCount = 0;

	var fade = function(op, top)
	{
		if (fadeCount < 2)
		{
			if (fadeCount === 0)
			{
				div.style.opacity = 1;
				div.innerHTML = alert;

			}
			g.view.loggingMessage = true;
			fadeCount++;
			setTimeout(function(){fade(op, top);}, period);
			return;
		}
		if (fadeCount === 2)
		{
			g.view.loggingMessage = false;
		}	
		

		if (op <= 0)
		{
			while(div.firstChild)
			{
				div.removeChild(div.firstChild);
			}
			div.style.opacity = 1;
			//div.style.top = g.view.alertsStyle.top + 'px';
			return;
		}
		else if (g.view.loggingMessage)
		{
			return;
		}

		div.style.opacity = op;
		//div.style.top = top + 'px';
		setTimeout(function(){fade(op - .05, top - 10);}, period);
	}


	
	setTimeout(function(){fade(.9, g.view.alertsStyle.top);}, 200);
}
*/

View.prototype.logAlert = function(alert)
{
	this.alertsToLog.push(alert);
	var div = this.alerts;
	var period = 50; //Period in ms

	var fade = function(op)
	{
		if (alert !== g.view.alertsToLog[g.view.alertsToLog.length - 1])
		{
			div.style.opacity = 1;
			//div.innerHTML = alert;
			for (var i = 0 ; i < g.view.alertsToLog.length - 1 ; i++)
			{
				g.view.alertsToLog.splice(0, 1);
			}
			//setTimeout(function()fade(.9), 200);
			return;
		}


		if (op <= 0)
		{
			while(div.firstChild)
			{
				div.removeChild(div.firstChild);
			}
			div.style.opacity = 1;
			g.view.alertsToLog = [];
			return;
		}

		div.style.opacity = op;
		//div.style.top = top + 'px';
		setTimeout(function(){fade(op - .05, top - 10);}, period);
	}

	div.innerHTML = alert;
	setTimeout(function(){fade(.9)}, 500);
}



View.prototype.logMessage = function(message)
{
	if (g.game.messageLogged === false)
	{
		g.game.messageLogged = true;
	}
	this.messages = this.messages.slice(1);
	this.messages.push(message);

	//Update innerHTMLs of the cells
	for (var i = 0 ; i < this.messageCells.length ; i++)
	{
		this.messageCells[i].innerHTML = this.messages[i];
	}
}





View.prototype.initializeMessageTable = function()
{
	var mTable = document.createElement('table');
	document.body.appendChild(mTable);
	mTable.style.left = this.messagesStyle.left + 'px';
	mTable.style.top = this.messagesStyle.top + 'px';
	mTable.style.width = this.messagesStyle.width + 'px';
	mTable.style.height = this.messagesStyle.height + 'px';
	mTable.style.position = 'absolute';
	mTable.style.borderSpacing = '0px';
	mTable.style.border = this.messagesStyle.border;

	//Fill table
	var colors = [g.colors.messagesBackground1, g.colors.messagesBackground2]
	for (var i = 0 ; i < this.numberOfMessagesDisplayed ; i++)
	{
		var row = document.createElement('tr');
		mTable.appendChild(row);
		var dot = document.createElement('td');
		row.appendChild(dot);
		dot.innerHTML = '&middot;';
		dot.style.width = '8px';
		var cell = document.createElement('td');
		row.appendChild(cell);
		cell.style.height = 100 * (1 / this.numberOfMessagesDisplayed) + '%';
		this.messageCells.push(cell);
		var color = colors[(i + 2) % 2];
		dot.style.backgroundColor = color;
		cell.style.backgroundColor = color;
		//Also put a dot in messages
		this.messages.push('');
	}
	this.logMessage('');
}





View.prototype.initializeInfoDivs = function()
{
	this.initializeEquipmentInfoMainDiv();
	this.initializeEnemyInfoMainDiv();
	this.initializeCharacterInfoMainDiv();
	this.initializeTileInfoMainDiv();
	this.initializePowersMainDiv();
}




View.prototype.initializePowersMainDiv = function()
{
	var powersDiv = document.createElement('div');
	document.body.appendChild(powersDiv);
	var styles = this.powersMainDivStyle;
	powersDiv.style.width = styles.width + 'px';
	powersDiv.style.height = styles.height + 'px';
	powersDiv.style.top = styles.top + 'px';
	powersDiv.style.left = styles.left + 'px';
	powersDiv.style.border = styles.border;
	powersDiv.style.position = 'absolute';

	//Title
	var title = document.createElement('div');
	powersDiv.appendChild(title);
	title.innerHTML = 'POWERS';
	title.style.textAlign = 'center';
	title.style.margin = '5px';
	title.style.fontSize = '15pt';

	//Powers list
	for (var i = 0 ; i < 9 ; i++)
	{
		var containerDiv = document.createElement('div');
		powersDiv.appendChild(containerDiv);
		var number = document.createElement('span');
		containerDiv.appendChild(number);
		number.innerHTML = (i + 1) + ': ';
		var powerSpan = document.createElement('span');
		containerDiv.appendChild(powerSpan);
		this.powersMainSpans.push(powerSpan);
	}

	this.setPowersMainDiv();
}



View.prototype.initializeEquipmentInfoMainDiv = function()
{
	var infoDiv = document.createElement('div');
	this.equipmentInfoMainDiv = infoDiv;
	document.body.appendChild(infoDiv);
	infoDiv.style.position = 'absolute';
	infoDiv.style.width = this.equipmentInfoMainDivStyle.width + 'px';
	infoDiv.style.height = this.equipmentInfoMainDivStyle.height + 'px';
	infoDiv.style.top = this.equipmentInfoMainDivStyle.top + 'px';
	infoDiv.style.left = this.equipmentInfoMainDivStyle.left + 'px';
	infoDiv.style.padding = '5px';
	infoDiv.style.borderLeft = this.equipmentInfoMainDivStyle.border;
	infoDiv.style.borderBottom = this.equipmentInfoMainDivStyle.border;
	infoDiv.style.borderRight = this.equipmentInfoMainDivStyle.border;

	var titles = ["", "<b>Damage:</b> ", "<b>Average Damage per Tick:</b> ", "<b>Range:</b> ", "<b>Accuracy:</b> ", "<b>Noise:</b> ", 
			"<b>Attack Time:</b> ", "", "", "", ""];

	var i = 0;
	for (var name in this.equipmentInfoMainSpans)
	{
		var div = document.createElement('div');
		infoDiv.appendChild(div);
		var title = titles[i];
		div.innerHTML = title;
		var span = document.createElement('span');
		div.appendChild(span);
		this.equipmentInfoMainSpans[name] = span;
		//Set the style of name
		if (name === 'weaponName')
		{
			div.style.fontSize = '14pt';
			div.style.fontWeight = 'bold';
			div.style.textAlign = 'center';
		}

		i++;
	}

	this.setEquipmentMainDiv();
}


View.prototype.initializeCharacterInfoMainDiv = function()
{
	var infoDiv = document.createElement('div');
	this.characterInfoMainDiv = infoDiv;
	document.body.appendChild(infoDiv);
	infoDiv.style.position = 'absolute';
	infoDiv.style.width = this.characterInfoMainDivStyle.width + 'px';
	infoDiv.style.height = this.characterInfoMainDivStyle.height + 'px';
	infoDiv.style.top = this.characterInfoMainDivStyle.top + 'px';
	infoDiv.style.left = this.characterInfoMainDivStyle.left + 'px';
	infoDiv.style.padding = this.characterInfoMainDivStyle.padding + 'px';
	infoDiv.style.borderTop = this.characterInfoMainDivStyle.border;
	infoDiv.style.borderLeft = this.characterInfoMainDivStyle.border;
	infoDiv.style.borderRight = this.characterInfoMainDivStyle.border;	

	

	//Set up the health and energy divs
	var healthDiv = document.createElement('div');
	infoDiv.appendChild(healthDiv);
	healthDiv.innerHTML = '<b>Health:</b> ';
	healthDiv.style.margin = this.characterInfoMainDivStyle.margin + 'px';

	var outerHealthBar = document.createElement('span');
	healthDiv.appendChild(outerHealthBar);
	outerHealthBar.style.border = '1px solid black';
	outerHealthBar.style.width = this.characterInfoMainDivStyle.barWidth +'px';
	outerHealthBar.style.height = this.characterInfoMainDivStyle.barHeight + 'px';
	outerHealthBar.style.position = 'absolute';

	var innerHealthBar = document.createElement('span');
	outerHealthBar.appendChild(innerHealthBar);
	this.characterInfoMainSpans.healthBar = innerHealthBar;
	innerHealthBar.style.width = this.characterInfoMainDivStyle.barWidth +'px';
	innerHealthBar.style.height = this.characterInfoMainDivStyle.barHeight + 'px';
	innerHealthBar.style.backgroundColor = this.characterInfoMainDivStyle.healthBarColor;
	innerHealthBar.style.position = 'absolute';

	var healthNumberContainer = document.createElement('span');
	healthDiv.appendChild(healthNumberContainer);
	healthNumberContainer.style.position = 'absolute';
	healthNumberContainer.style.left = Number(this.characterInfoMainDivStyle.barWidth) + 75 + 'px';

	var healthNumber = document.createElement('span');
	healthNumberContainer.appendChild(healthNumber);
	this.characterInfoMainSpans.Health = healthNumber;
	healthNumber.innerHTML = g.game.player.get('health');
	
	var slash = document.createElement('span');
	slash.innerHTML = '&#47;';
	healthNumberContainer.appendChild(slash);

	var maxHealth = document.createElement('span');
	healthNumberContainer.appendChild(maxHealth);
	this.characterInfoMainSpans.MaxHealth = maxHealth;
	maxHealth.innerHTML = g.game.player.get('maxHealth');



	var energyDiv = document.createElement('div');
	infoDiv.appendChild(energyDiv);
	energyDiv.innerHTML = '<b>Energy:</b> ';
	energyDiv.style.margin = this.characterInfoMainDivStyle.margin + 'px';

	var outerEnergyBar = document.createElement('span');
	energyDiv.appendChild(outerEnergyBar);
	outerEnergyBar.style.border = '1px solid black';
	outerEnergyBar.style.width = this.characterInfoMainDivStyle.barWidth +'px';
	outerEnergyBar.style.height = this.characterInfoMainDivStyle.barHeight + 'px';
	outerEnergyBar.style.position = 'absolute';

	var innerEnergyBar = document.createElement('span');
	outerEnergyBar.appendChild(innerEnergyBar);
	this.characterInfoMainSpans.energyBar = innerEnergyBar;
	innerEnergyBar.style.width = this.characterInfoMainDivStyle.barWidth +'px';
	innerEnergyBar.style.height = this.characterInfoMainDivStyle.barHeight + 'px';
	innerEnergyBar.style.backgroundColor = this.characterInfoMainDivStyle.energyBarColor;
	innerEnergyBar.style.position = 'absolute';

	var energyNumberContainer = document.createElement('span');
	energyDiv.appendChild(energyNumberContainer);
	energyNumberContainer.style.position = 'absolute';
	energyNumberContainer.style.left = Number(this.characterInfoMainDivStyle.barWidth) + 75 + 'px';

	var energyNumber = document.createElement('span');
	energyNumberContainer.appendChild(energyNumber);
	this.characterInfoMainSpans.Energy = energyNumber;
	energyNumber.innerHTML = g.game.player.get('energy');
	
	var slash1 = document.createElement('span');
	slash1.innerHTML = '&#47;';
	energyNumberContainer.appendChild(slash1);

	var maxEnergy = document.createElement('span');
	energyNumberContainer.appendChild(maxEnergy);
	this.characterInfoMainSpans.MaxEnergy = maxEnergy;
	maxEnergy.innerHTML = g.game.player.get('maxEnergy');



	var line = document.createElement('span');
	line.innerHTML = '<hr />';
	infoDiv.appendChild(line);


	//Move stance
	var stanceContainer = document.createElement('div');
	infoDiv.appendChild(stanceContainer);
	stanceContainer.style.textAlign = 'center';

	var stanceNames = ["SNEAKING", "WALKING", "RUNNING"];
	for (var sNIndex = 0 ; sNIndex < stanceNames.length ; sNIndex++)
	{
		sN = stanceNames[sNIndex];
		var stanceSpan = document.createElement('span');
		stanceContainer.appendChild(stanceSpan);
		stanceSpan.innerHTML = sN;
		stanceSpan.style.margin = '5px';
		stanceSpan.style.padding = '3px';
		this.characterInfoMainSpans[sN.toLowerCase()] = stanceSpan;
		//Add a space between the stance names
		/*
		if (sNIndex < 2)
		{
			var spaces = document.createElement('span');
			stanceContainer.appendChild(spaces);
			spaces.innerHTML = '&nbsp;&nbsp;';
		}
		*/
	}
	var stance = g.game.player.stance;
	this.characterInfoMainSpans[stance.toLowerCase()].style.backgroundColor = g.COLORCONSTANTS.BRIGHTGREEN;

	
	line = document.createElement('span');
	line.innerHTML = '<hr />';
	infoDiv.appendChild(line);





	var titles = ["Health: ", "", "", "Energy: ", "", "", '', '', '',
			"Dodge Chance: ", "Damage Reduction: ", "View Distance: ", "View Angle: ", "Move Time: ", "Move Noise: ",
			"Visibility: ", "Direction: "];


	var i = 0;
	for (var name in this.characterInfoMainSpans)
	{
		if (this.characterInfoMainSpans[name] === false)
		{
			var div = document.createElement('div');
			infoDiv.appendChild(div);
			div.style.margin = this.characterInfoMainDivStyle.margin + 'px';
			var span = document.createElement('span'); 
			this.characterInfoMainSpans[name] = span;

			div.innerHTML = '<b>' + titles[i] + '</b>';
			div.appendChild(span);

			if (name === 'ViewAngle')
			{
				span.innerHTML = g.game.player.get('viewAngle');
				var sym = document.createElement('span');
				sym.innerHTML = '&deg;';
				div.appendChild(sym);
			}
			else 
			{
				span.innerHTML = g.game.player.get(name);
				if (name === 'DodgeChance')
				{
					var sym = document.createElement('span');
					sym.innerHTML = '%';
					div.appendChild(sym);
				}
			}

		}

		i++;
	}

	var line2 = document.createElement('span');
	line2.innerHTML = '<hr />';
	infoDiv.appendChild(line2);

	this.setCharacterMainDiv();
}


View.prototype.initializeEnemyInfoMainDiv = function()
{
	var infoDivContainer = document.createElement('div');
	document.body.appendChild(infoDivContainer);
	infoDivContainer.style.left = this.enemyInfoMainDivStyle.left + 'px';
	infoDivContainer.style.top = this.enemyInfoMainDivStyle.top + 'px';
	infoDivContainer.style.width = this.enemyInfoMainDivStyle.width + 'px';
	infoDivContainer.style.height = this.enemyInfoMainDivStyle.height + 'px';
	infoDivContainer.style.border = this.enemyInfoMainDivStyle.border;
	infoDivContainer.style.position = 'absolute';

	var infoDiv = document.createElement('div');
	infoDivContainer.appendChild(infoDiv);
	this.enemyInfoMainDiv = infoDiv;
	infoDiv.style.display = 'none';

	var nameDiv = document.createElement('div');
	infoDiv.appendChild(nameDiv);
	this.enemyInfoMainSpans.name = nameDiv;
	nameDiv.style.fontSize = '14pt';
	nameDiv.style.fontWeight = 'bold';
	nameDiv.style.textAlign = 'center';

	//Health and energy containers
	var names = ['health', 'energy'];
	var namesUC = ['Health', 'Energy'];
	for (var i = 0 ; i < 2 ; i++)
	{
		var container = document.createElement('div');
		infoDiv.appendChild(container);
		container.innerHTML = '<b>' + namesUC[i] + ':</b> ';
		container.style.margin = this.enemyInfoMainDivStyle.margin + 'px';

		var outerBar = document.createElement('span');
		container.appendChild(outerBar);
		outerBar.style.width = this.enemyInfoMainDivStyle.barWidth + 'px';
		outerBar.style.height = this.enemyInfoMainDivStyle.barHeight + 'px';
		outerBar.style.position = 'absolute';
		outerBar.style.border = '1px solid black';

		var innerBar = document.createElement('span');
		outerBar.appendChild(innerBar);
		innerBar.style.width = this.enemyInfoMainDivStyle.barWidth + 'px';
		innerBar.style.height = this.enemyInfoMainDivStyle.barHeight + 'px';
		innerBar.style.position = 'absolute';
		innerBar.style.backgroundColor = this.characterInfoMainDivStyle[names[i] + 'BarColor'];
		this.enemyInfoMainSpans[names[i] + 'Bar'] = innerBar;

		var numberContainer = document.createElement('span');
		container.appendChild(numberContainer);
		numberContainer.style.position = 'absolute';
		numberContainer.style.left = Number(this.enemyInfoMainDivStyle.barWidth) + 70 + 'px';

		var number = document.createElement('span');
		numberContainer.appendChild(number);
		this.enemyInfoMainSpans[names[i]] = number;

		var slash = document.createElement('span');
		slash.innerHTML = '&#47;'
		numberContainer.appendChild(slash);

		var max = document.createElement('span');
		numberContainer.appendChild(max);
		this.enemyInfoMainSpans['max' + namesUC[i]] = max;
	}

	var titles = ['', '', '', '', '', '', '', 'Damage: ', 'Range: ', 'Hit Chance: ',
			'Attack Time: ', 'Reload Time: ', 
			'Dodge Chance: ', 'Armor: ', 'Move Time: ', 'Direction: '];

	var i = 0;
	for (var name in this.enemyInfoMainSpans)
	{
		var span = this.enemyInfoMainSpans[name];
		if (span === false)
		{
			var div = document.createElement('div');
			infoDiv.appendChild(div);
			var title = titles[i];
			div.innerHTML = '<b>' + title + '</b>';

			span = document.createElement('span');
			this.enemyInfoMainSpans[name] = span;
			div.appendChild(span);

			if (name === 'chance' || name === 'dodgeChance')
			{
				var symbol = document.createElement('span');
				symbol.innerHTML = '%';
				div.appendChild(symbol);
			}
		}
		i++;
	}
}


View.prototype.initializeTileInfoMainDiv = function()
{

}



View.prototype.initializeMenu = function()
{
	var menu = this.menu;
	menu.style.width = '1100px';
	menu.style.height = '500px';
	menu.style.top = '20px';
	menu.style.left = '30px';
	menu.style.position = 'absolute';
	menu.style.backgroundColor = g.COLORCONSTANTS.BLACK;
	menu.style.zIndex = 10;
	menu.style.visibility = 'hidden';
	document.body.appendChild(menu);
	//Create the labels
	for (var labelName in this.menuLabels)
	{
		var label = this.menuLabels[labelName];
		label.style.top = '10px';
		label.style.width = '150px';
		label.style.textAlign = 'center';
		label.style.fontSize = '20pt';
		label.style.fontFamily = 'monospace';
		label.style.position = 'absolute';
		label.style.color = g.colors.menuLabelDefaultText;
		label.style.backgroundColor = g.colors.menuLabelDefaultBackground;
		if (labelName === 'character')
		{
			label.style.left = '50px';
			label.innerHTML = 'Character';
		}
		else if (labelName === 'equipment')
		{
			label.style.left = '280px';
			label.innerHTML = 'Equipment';
		}
		else if (labelName === 'powers')
		{
			label.style.left = '500px';
			label.innerHTML = 'Powers';
		}
		menu.appendChild(label);
	}

	//Create the power points and the skill points div
	var pointsContainer = document.createElement('div');
	menu.appendChild(pointsContainer);
	pointsContainer.style.color = g.COLORCONSTANTS.WHITE;
	pointsContainer.style.left = '700px';
	pointsContainer.style.top = '20px';
	pointsContainer.style.fontSize = '14pt';
	pointsContainer.style.position = 'absolute';
	var skillPointsLabel = document.createElement('span');
	pointsContainer.appendChild(skillPointsLabel);
	skillPointsLabel.innerHTML = 'Skill Points: ';
	var skillPoints = document.createElement('span');
	pointsContainer.appendChild(skillPoints);
	this.skillPoints = skillPoints;
	skillPoints.style.color = g.COLORCONSTANTS.LIGHTBLUE;
	skillPoints.innerHTML = g.game.playerSkillPoints;
	var powerPointsLabel = document.createElement('span');
	pointsContainer.appendChild(powerPointsLabel);
	powerPointsLabel.innerHTML = '&nbsp;&nbsp;Power Points: ';
	var powerPoints = document.createElement('span');
	pointsContainer.appendChild(powerPoints);
	this.powerPoints = powerPoints;
	powerPoints.innerHTML = g.game.playerPowerPoints;
	powerPoints.style.color = g.COLORCONSTANTS.PURPLE;

	//Create the internal info divs
	for (var menuInfoName in this.menuInfo)
	{
		var internalInfo = this.menuInfo[menuInfoName];
		internalInfo.style.width = '1080px';
		internalInfo.style.height = '430px';
		internalInfo.style.left = '10px';
		internalInfo.style.top = '50px';
		internalInfo.style.position = 'absolute';
		internalInfo.style.visibility = 'hidden';
		menu.appendChild(internalInfo);
		if (menuInfoName === 'character')
		{
			internalInfo.id = 'characterInfo';
			internalInfo.style.fontSize = '13pt';
			internalInfo.style.backgroundColor = g.colors.characterMenuBackground;
			//internalInfo.style.padding = '20px';

			var strengthContainer = document.createElement('div');
			internalInfo.appendChild(strengthContainer);
			this.characterInfoContainers.strength = strengthContainer;
			var strengthDiv = document.createElement('div');
			strengthDiv.innerHTML = 'STRENGTH: <span id="strengthSpan"></span>';
			strengthContainer.appendChild(strengthDiv);
			strengthDiv.style.fontWeight = 'bold';
			this.characterInfoSpans.strength = document.getElementById('strengthSpan');

			var dexterityContainer = document.createElement('div');
			internalInfo.appendChild(dexterityContainer);
			this.characterInfoContainers.dexterity = dexterityContainer;
			var dexterityDiv = document.createElement('div');
			dexterityDiv.innerHTML = 'DEXTERITY: <span id="dexteritySpan"></span>';
			dexterityContainer.appendChild(dexterityDiv);
			dexterityDiv.style.fontWeight = 'bold';
			this.characterInfoSpans.dexterity = document.getElementById('dexteritySpan');

			var intelligenceContainer = document.createElement('div');
			internalInfo.appendChild(intelligenceContainer);
			this.characterInfoContainers.intelligence = intelligenceContainer;
			var intelligenceDiv = document.createElement('div');
			intelligenceDiv.innerHTML = 'INTELLIGENCE: <span id="intelligenceSpan"></span>';
			intelligenceContainer.appendChild(intelligenceDiv);
			intelligenceDiv.style.fontWeight = 'bold';
			this.characterInfoSpans.intelligence = document.getElementById('intelligenceSpan');

			var perceptionContainer = document.createElement('div');
			internalInfo.appendChild(perceptionContainer);
			this.characterInfoContainers.perception = perceptionContainer;
			var perceptionDiv = document.createElement('div');
			perceptionDiv.innerHTML = 'PERCEPTION: <span id="perceptionSpan"></span>';
			perceptionContainer.appendChild(perceptionDiv);
			perceptionDiv.style.fontWeight = 'bold';
			this.characterInfoSpans.perception = document.getElementById('perceptionSpan');


			var healthContainer = document.createElement('div');
			internalInfo.appendChild(healthContainer);
			this.characterInfoContainers.health = healthContainer;
			var healthDiv = document.createElement('div');
			healthDiv.innerHTML = "Health: <span id=\"healthPercentSpan\"></span>% (<span id=\"healthSpan\"></span>/<span id=\"maxHealthSpan\"></span>)";
			healthContainer.appendChild(healthDiv);
			this.characterInfoSpans.healthPercent = document.getElementById('healthPercentSpan');
			this.characterInfoSpans.health = document.getElementById('healthSpan');
			this.characterInfoSpans.maxHealth = document.getElementById('maxHealthSpan');

			var healthRechargeRateContainer = document.createElement('div');
			internalInfo.appendChild(healthRechargeRateContainer);
			this.characterInfoContainers.healthRechargeRate = healthRechargeRateContainer;
			var healthRechargeRateDiv = document.createElement('div');
			healthRechargeRateDiv.innerHTML = 'Health Recharge Rate: <span id="healthRechargeRate"></span> / tick';
			healthRechargeRateContainer.appendChild(healthRechargeRateDiv);
			this.characterInfoSpans.healthRechargeRate = document.getElementById('healthRechargeRate');

			var energyContainer = document.createElement('div');
			internalInfo.appendChild(energyContainer);
			this.characterInfoContainers.energy = energyContainer;
			var energyDiv = document.createElement('div');
			energyDiv.innerHTML = 'Energy: <span id="energyPercentSpan"></span>% (<span id="energySpan"></span>/<span id="maxEnergySpan"></span>)';
			energyContainer.appendChild(energyDiv);
			this.characterInfoSpans.energyPercent = document.getElementById('energyPercentSpan');
			this.characterInfoSpans.energy = document.getElementById('energySpan');
			this.characterInfoSpans.maxEnergy = document.getElementById('maxEnergySpan');

			var energyRechargeRateContainer = document.createElement('div');
			internalInfo.appendChild(energyRechargeRateContainer);
			this.characterInfoContainers.energyRechargeRate = energyRechargeRateContainer;
			var energyRechargeRateDiv = document.createElement('div');
			energyRechargeRateDiv.innerHTML = 'Energy Recharge Rate: <span id="energyRechargeRate"></span> / tick';
			energyRechargeRateContainer.appendChild(energyRechargeRateDiv);
			this.characterInfoSpans.energyRechargeRate = document.getElementById('energyRechargeRate');
			
			var moveTimeContainer = document.createElement('div');
			internalInfo.appendChild(moveTimeContainer);
			this.characterInfoContainers.moveTime = moveTimeContainer;
			var moveTimeDiv = document.createElement('div');
			moveTimeDiv.innerHTML = 'Move Time: <span id="moveTimeSpan"></scpan>';
			moveTimeContainer.appendChild(moveTimeDiv);
			this.characterInfoSpans.moveTime = document.getElementById('moveTimeSpan');
			
			var moveNoiseContainer = document.createElement('div');
			internalInfo.appendChild(moveNoiseContainer);
			this.characterInfoContainers.moveNoise = moveNoiseContainer;
			var moveNoiseDiv = document.createElement('div');
			moveNoiseDiv.innerHTML = 'Move Noise: <span id="moveNoiseSpan"></span>';
			moveNoiseContainer.appendChild(moveNoiseDiv);
			this.characterInfoSpans.moveNoise = document.getElementById('moveNoiseSpan');
			
			var speedContainer = document.createElement('div');
			internalInfo.appendChild(speedContainer);
			this.characterInfoContainers.dodgeChance = speedContainer;
			var speedDiv = document.createElement('div');
			speedDiv.innerHTML = 'Dodge Chance: <span id="speedSpan"></span>';
			speedContainer.appendChild(speedDiv);
			this.characterInfoSpans.dodgeChance = document.getElementById('speedSpan');
			
			var armorContainer = document.createElement('div');
			internalInfo.appendChild(armorContainer);
			this.characterInfoContainers.armor = armorContainer;
			var armorDiv = document.createElement('div');
			armorDiv.innerHTML = 'Damage Reduction: <span id="armorSpan"></span>';
			armorContainer.appendChild(armorDiv);
			this.characterInfoSpans.damageReduction = document.getElementById('armorSpan');
			
			var viewDistanceContainer = document.createElement('div');
			internalInfo.appendChild(viewDistanceContainer);
			this.characterInfoContainers.viewDistance = viewDistanceContainer;
			var viewDistanceDiv = document.createElement('div');
			viewDistanceDiv.innerHTML = 'View Distance: <span id="viewDistanceSpan"></span>';
			viewDistanceContainer.appendChild(viewDistanceDiv);
			this.characterInfoSpans.viewDistance = document.getElementById('viewDistanceSpan');

			var viewAngleContainer = document.createElement('div');
			internalInfo.appendChild(viewAngleContainer);
			this.characterInfoContainers.viewAngle = viewAngleContainer;
			var viewAngleDiv = document.createElement('div');
			viewAngleDiv.innerHTML = 'View Angle: <span id="viewAngleSpan"></span>';
			viewAngleContainer.appendChild(viewAngleDiv);
			this.characterInfoSpans.viewAngle = document.getElementById('viewAngleSpan');

			var visibilityContainer = document.createElement('div');
			internalInfo.appendChild(visibilityContainer);
			this.characterInfoContainers.visibility = visibilityContainer;
			var visibilityDiv = document.createElement('div');
			visibilityDiv.innerHTML = 'Visibility: <span id="visibilitySpan"></span>';
			visibilityContainer.appendChild(visibilityDiv);
			this.characterInfoSpans.visibility = document.getElementById('visibilitySpan');
			
			var directionContainer = document.createElement('div');
			internalInfo.appendChild(directionContainer);
			this.characterInfoContainers.direction = directionContainer;
			var directionDiv = document.createElement('div');
			directionDiv.innerHTML = 'Direction: <span id="directionSpan"></span>';
			directionContainer.appendChild(directionDiv);
			this.characterInfoSpans.direction = document.getElementById('directionSpan');

			//Set the styles for the containers
			for (var att in this.characterInfoContainers)
			{
				var container = this.characterInfoContainers[att];
				container.style.width = '390px';
				container.style.height = '22px';
			}


			//Set up info div
			var attributeInfoDiv = document.createElement('div');
			this.attributeInfoDiv = attributeInfoDiv;
			internalInfo.appendChild(attributeInfoDiv);
			for (var style in this.attributeInfoDivStyle)
			{
				attributeInfoDiv.style[style] = this.attributeInfoDivStyle[style];
			}
		}
		else if (menuInfoName === 'equipment')
		{
			internalInfo.style.backgroundColor = g.colors.equipmentMenuBackground;

			var equipmentTable = document.createElement('table');
			internalInfo.appendChild(equipmentTable);
			//Ten rows, 2 columns
			for (var rowIndex = 0 ; rowIndex < 10 ; rowIndex++)
			{
				var row = document.createElement('tr');
				equipmentTable.appendChild(row);
				for (var cellIndex = 0 ; cellIndex < 2 ; cellIndex++)
				{
					var cell = document.createElement('td');
					cell.style.width = '150px';
					cell.style.height = '24px';
					cell.style.fontSize = '10pt';
					cell.style.padding = '10px';
					row.appendChild(cell);
				}
			}
			//Add the cells to the equipmentListCells Array
			for (var cellIndex = 0 ; cellIndex < 2 ; cellIndex++)
			{
				for (var rowIndex = 0 ; rowIndex < 10 ; rowIndex++)
				{
					var cell = equipmentTable.rows[rowIndex].cells[cellIndex];
					this.equipmentListCells.push(cell);
				}
			}


			//Add display window
			var equipmentInfo = document.createElement('div');
			internalInfo.appendChild(equipmentInfo);
			this.internalEquipmentInfo.weapon = equipmentInfo;
			var margin = '10px';
			//equipmentInfo.id = 'equipmentInfoWindow';

			//Add 'selected' label
			var selectedLabel = document.createElement('h4');
			equipmentInfo.appendChild(selectedLabel);
			selectedLabel.innerHTML = 'SELECTED:';

			equipmentInfo.style.top = this.internalEquipmentInfoStyle.top + 'px';
			equipmentInfo.style.left = this.internalEquipmentInfoStyle.left + 'px';
			equipmentInfo.style.width = this.internalEquipmentInfoStyle.width + 'px';
			equipmentInfo.style.height = this.internalEquipmentInfoStyle.height + 'px';
			equipmentInfo.style.backgroundColor = this.internalEquipmentInfoStyle.backgroundColor;
			equipmentInfo.style.border = this.internalEquipmentInfoStyle.border;
			equipmentInfo.style.position = 'absolute';
			//Set up the info spans
			var labels = 	[
					'', 'Damage: ', ' Damage per Tick: ',
					'Range: ', 'Accuracy: ', 'Noise: ',
					'Attack Time: ', 'Reload Time: ', 'Clip Size: ',
					'Spread Angle: ', 'Follow Through: ', 'Knock Back: '
							];

			var i = 0;
			for (var name in this.equipmentInfoSpans)
			{
				var container = document.createElement('div');
				equipmentInfo.appendChild(container);
				container.innerHTML = '<b>' + labels[i] + '</b>';
				container.style.margin = margin;
				if (name === 'name')
				{
					container.style.textAlign = 'center';
					container.style.fontSize = '14pt';
					container.style.fontWeight = 'bold';
				}
				var span = document.createElement('span');
				container.appendChild(span);
				this.equipmentInfoSpans[name] = span;
				i++;
			}


			/*
			var nameDiv = document.createElement('div');
			equipmentInfo.appendChild(nameDiv);
			nameDiv.innerHTML = '<span id="equipmentName"></span>';
			this.equipmentInfoSpans.name = document.getElementById('equipmentName');
			nameDiv.style.textAlign = 'center';
			nameDiv.style.fontSize = '14pt';
			this.equipmentInfoSpans.name.style.fontWeight = 'bold';
			nameDiv.style.margin = margin;


			var damageDiv = document.createElement('div');
			equipmentInfo.appendChild(damageDiv);
			damageDiv.innerHTML = '<b>Damage:</b> <span id="equipmentDamageBase"></span> + <span id="equipmentDamageMul"></span>'
					+ ' x <span id="equipmentDamageParam"></span> = <span id="equipmentDamageTotal"></span>';
			this.equipmentInfoSpans.damageBase = document.getElementById('equipmentDamageBase');
			this.equipmentInfoSpans.damageMul = document.getElementById('equipmentDamageMul');
			this.equipmentInfoSpans.damageParam = document.getElementById('equipmentDamageParam');
			this.equipmentInfoSpans.damageTotal = document.getElementById('equipmentDamageTotal');
			this.equipmentInfoSpans.damageTotal.style.color = g.colors.equipmentInfoTotal;
			damageDiv.style.margin = margin;

			var dPTDiv = document.createElement('div');
			equipmentInfo.appendChild(dPTDiv);
			dPTDiv.innerHTML = '<b>Average Damage per Tick:</b> <span id="dPT"></span>';
			this.equipmentInfoSpans.averageDamagePerTick = document.getElementById('dPT');
			this.equipmentInfoSpans.averageDamagePerTick.style.color = g.colors.equipmentInfoTotal;
			dPTDiv.style.margin = margin;

			var rangeDiv = document.createElement('div');
			equipmentInfo.appendChild(rangeDiv);
			rangeDiv.innerHTML = '<b>Range:</b> <span id="equipmentRange"></span>';
			this.equipmentInfoSpans.range = document.getElementById('equipmentRange');
			this.equipmentInfoSpans.range.style.color = g.colors.equipmentInfoTotal;
			rangeDiv.style.margin = margin;
		
			var chanceDiv = document.createElement('div');
			equipmentInfo.appendChild(chanceDiv);
			chanceDiv.innerHTML = '<b>Accuracy:</b> <span id="equipmentChanceBase"></span> + <span id="equipmentChanceMul"></span>'
					+ ' x <span id="equipmentChanceParam"></span> = <span id="equipmentChanceTotal"></span>';
			this.equipmentInfoSpans.chanceBase = document.getElementById('equipmentChanceBase');
			this.equipmentInfoSpans.chanceMul = document.getElementById('equipmentChanceMul');
			this.equipmentInfoSpans.chanceParam = document.getElementById('equipmentChanceParam');
			this.equipmentInfoSpans.chanceTotal = document.getElementById('equipmentChanceTotal');
			this.equipmentInfoSpans.chanceTotal.style.color = g.colors.equipmentInfoTotal;
			chanceDiv.style.margin = margin;

			var noiseDiv = document.createElement('div');
			equipmentInfo.appendChild(noiseDiv);
			noiseDiv.innerHTML = '<b>Noise:</b> <span id="equipmentNoise"></span>';
			this.equipmentInfoSpans.noise = document.getElementById('equipmentNoise');
			this.equipmentInfoSpans.noise.style.color = g.colors.equipmentInfoTotal;
			noiseDiv.style.margin = margin;

			var shootTimeDiv = document.createElement('div');
			equipmentInfo.appendChild(shootTimeDiv);
			shootTimeDiv.innerHTML = '<b>Shoot Time:</b> <span id="equipmentShootTime"></span>';
			this.equipmentInfoSpans.shootTime = document.getElementById('equipmentShootTime');
			this.equipmentInfoSpans.shootTime.style.color = g.colors.equipmentInfoTotal;
			shootTimeDiv.style.margin = margin;

			var reloadTimeDiv = document.createElement('div');
			equipmentInfo.appendChild(reloadTimeDiv);
			reloadTimeDiv.innerHTML = '<b>Reload Time:</b> <span id="equipmentReloadTime"></span>';
			this.equipmentInfoSpans.reloadTime = document.getElementById('equipmentReloadTime');
			this.equipmentInfoSpans.reloadTime.style.color = g.colors.equipmentInfoTotal;
			reloadTimeDiv.style.margin = margin;

			var clipSizeDiv = document.createElement('div');
			equipmentInfo.appendChild(clipSizeDiv);
			clipSizeDiv.innerHTML = '<b>Clip Size:</b> <span id="equipmentClipSize"></span>';
			this.equipmentInfoSpans.clipSize = document.getElementById('equipmentClipSize');
			this.equipmentInfoSpans.clipSize.style.color = g.colors.equipmentInfoTotal;
			clipSizeDiv.style.margin = margin;

			var spreadAngleDiv = document.createElement('div');
			equipmentInfo.appendChild(spreadAngleDiv);
			spreadAngleDiv.innerHTML = '<b>Spread Angle:</b> <span id="spreadAngleDiv"></span>';
			this.equipmentInfoSpans.spreadAngle = document.getElementById('spreadAngleDiv');
			this.equipmentInfoSpans.spreadAngle.style.color = g.colors.equipmentInfoTotal;
			spreadAngleDiv.style.margin = margin;

			var knockBackDiv = document.createElement('div');
			equipmentInfo.appendChild(knockBackDiv);
			knockBackDiv.innerHTML = '<b>Knock Back:</b> <span id="knockBackDiv"></span>';
			this.equipmentInfoSpans.knockBack = document.getElementById('knockBackDiv');
			this.equipmentInfoSpans.knockBack.style.color = g.colors.equipmentInfoTotal;
			knockBackDiv.style.margin = margin;

			var followThroughDiv = document.createElement('div');
			equipmentInfo.appendChild(followThroughDiv);
			followThroughDiv.innerHTML = '<b>Follow Through:</b> <span id="followThroughDiv"></span>';
			this.equipmentInfoSpans.followThrough = document.getElementById('followThroughDiv');
			this.equipmentInfoSpans.followThrough.style.color = g.colors.equipmentInfoTotal;
			followThroughDiv.style.margin = margin;
			*/
			/*
			var armorPiercingDiv = document.createElement('div');
			equipmentInfo.appendChild(armorPiercingDiv);
			armorPiercingDiv.innerHTML = '<b>Armor Piercing:</b> <span id="equipmentArmorPiercing"></span>';
			this.equipmentInfoSpans.armorPiercing = document.getElementById('equipmentArmorPiercing');
			this.equipmentInfoSpans.armorPiercing.style.color = g.colors.equipmentInfoTotal;
			*/

			/*
			var statusEffectDiv = document.createElement('div');
			equipmentInfo.appendChild(statusEffectDiv);
			statusEffectDiv.innerHTML = '<span id="equipmentStatusEffect"></span> '
					+ '<span id="equipmentStatusEffectChance"></span>';
			this.equipmentInfoSpans.statusEffect = document.getElementById('equipmentStatusEffect');
			this.equipmentInfoSpans.statusEffectChance = document.getElementById('equipmentStatusEffectChance');
			this.equipmentInfoSpans.statusEffect.style.color = g.colors.equipmentInfoTotal;
			*/

			//Create equiped weapon display 
			var equipedWeaponDiv = document.createElement('div')
			internalInfo.appendChild(equipedWeaponDiv);
			this.internalEquipmentInfo.equipedWeapon = equipedWeaponDiv
			equipedWeaponDiv.style.width = this.internalEquipmentInfoStyle.width + 'px';
			equipedWeaponDiv.style.height = this.internalEquipmentInfoStyle.height + 'px';
			equipedWeaponDiv.style.left = this.internalEquipmentInfoStyle.left + this.internalEquipmentInfoStyle.width + 0 + 'px';
			equipedWeaponDiv.style.top = this.internalEquipmentInfoStyle.top + 'px';
			equipedWeaponDiv.style.border = this.internalEquipmentInfoStyle.border;
			equipedWeaponDiv.style.backgroundColor = this.internalEquipmentInfoStyle.backgroundColor;
			equipedWeaponDiv.style.position = 'absolute';

			//Add 'equiped' label
			var equipedLabel = document.createElement('h4');
			equipedWeaponDiv.appendChild(equipedLabel);
			equipedLabel.innerHTML = 'EQUIPED:';

			var labels = ["", "Damage: ", "Average Damage per Tick: ", "Range: ", "Accuracy: ", "Noise: ", "Shoot Time: ", "Reload Time: ", "Clip Size: ", 
						"Spread Angle: ", "Follow Through: ", "Knock Back: "];
			var i = 0;
			for (var name in this.equipmentInfoSpansEquiped)
			{

				var container = document.createElement('div');
				equipedWeaponDiv.appendChild(container);
				container.style.margin = margin;
				container.innerHTML = '<b>' + labels[i] + '</b>';
				var span = document.createElement('span');
				container.appendChild(span);
				this.equipmentInfoSpansEquiped[name] = span;

				if (name === 'name')
				{
					container.style.textAlign = 'center';
					span.style.fontSize = '14pt';
					span.style.fontWeight = 'bold';
				}

				i++;
			}





			//Create armor/helmet display div
			var armorDiv = document.createElement('div');
			internalInfo.appendChild(armorDiv);
			this.internalEquipmentInfo.armor = armorDiv;
			armorDiv.style.width = this.internalEquipmentInfoStyle.width + 'px';
			armorDiv.style.height = this.internalEquipmentInfoStyle.height + 'px';
			armorDiv.style.left = this.internalEquipmentInfoStyle.left + 'px';
			armorDiv.style.top = this.internalEquipmentInfoStyle.top + 'px';
			armorDiv.style.border = this.internalEquipmentInfoStyle.border;
			armorDiv.style.backgroundColor = this.internalEquipmentInfoStyle.backgroundColor;
			armorDiv.style.position = 'absolute';
			armorDiv.setAttribute('class', 'menuArmorDiv');

			//Add 'selected' label
			var selectedLabel = document.createElement('h4');
			armorDiv.appendChild(selectedLabel);
			selectedLabel.innerHTML = 'SELECTED:';

			var labels = ["", 'Damage Reduction: ', 'Dodge Chance Effect: ', 'Move Noise Effect: ',
					'Visibility Effect: ', 'View Distance Effect: ', 'View Angle Effect: ', 'Max Health Effect: ', 'Health Recharge Effect: ',
					'Max Energy Effect: ', 'Energy Recharge Effect: '];
			var i = 0;
			for (var name in this.armorInfoSpans)
			{
				var container = document.createElement('div');
				armorDiv.appendChild(container);
				var innerHTML = '';
				innerHTML += '<b>' + labels[i] + '</b>';
				container.innerHTML = innerHTML;
				var span = document.createElement('span');
				span.id = 'armor' + i;
				this.armorInfoSpans[name] = span;
				container.appendChild(span);
				//span.innerHTML = i;

				if (name === 'name')
				{
					/*
					container.style.textAlign = 'center';
					span.style.fontSize = '14pt';
					span.style.fontWeight = 'bold';
					*/
					container.setAttribute('class', 'armorMenuNameDiv');
				}

				i++;
			}


			var equipedArmorDiv = document.createElement('div');
			internalInfo.appendChild(equipedArmorDiv);
			this.internalEquipmentInfo.equipedArmor = equipedArmorDiv;
			equipedArmorDiv.style.width = this.internalEquipmentInfoStyle.width + 'px';
			equipedArmorDiv.style.height = this.internalEquipmentInfoStyle.height + 'px';
			equipedArmorDiv.style.left = this.internalEquipmentInfoStyle.width + this.internalEquipmentInfoStyle.left + 0 + 'px';
			equipedArmorDiv.style.top = this.internalEquipmentInfoStyle.top + 'px';
			equipedArmorDiv.style.border = this.internalEquipmentInfoStyle.border;
			equipedArmorDiv.style.backgroundColor = this.internalEquipmentInfoStyle.backgroundColor;
			equipedArmorDiv.style.position = 'absolute';
			equipedArmorDiv.setAttribute('class', 'menuArmorDiv');

			//Add 'selected' label
			var equipedLabel = document.createElement('h4');
			equipedArmorDiv.appendChild(equipedLabel);
			equipedLabel.innerHTML = 'EQUIPED:';

		}
		else if (menuInfoName === 'powers')//POWERS MENU
		{
			internalInfo.style.backgroundColor = g.colors.powersMenuBackground;
			var table = document.createElement('div');
			internalInfo.appendChild(table);
			this.powersMenu.table = table;
			//table.style.cellSpacing = '1px';
			table.style.margin = '10px';
			table.style.color = g.COLORCONSTANTS.BLACK;
			table.style.fontSize = '11pt';

			//Fill the table
			for (var rows = 0 ; rows < g.game.player.powers.length ; rows++)
			{
				var row = document.createElement('div');
				table.appendChild(row);
				this.powersMenu.powerDivs.push(row);
				row.style.width = '700px';
				row.style.height = '35px';
				row.style.marginBottom = '5px';
				row.style.marginTop = '5px';
				row.style.fontWeight = 'bold';

				var power = g.game.player.powers[rows];

				var currCellArray = [];

				for (var cells = 0 ; cells < 2 * (power.atts.maxUpgrades + 1) ; cells++) 
				{
					var cell = document.createElement('span');
					row.appendChild(cell);
					//cell.style.borderBottom = '1px solid black';
					cell.style.height = '20px';
					
					cell.style.padding = '3px';
					

					if (cells === 0)
					{
						cell.innerHTML = rows + 1 + ':';
					}
					else
					{
						//If it's an odd number cell, it's a power name.
						//If it's an even number cell, it's an arrow
						if (cells % 2 === 1)
						{	
							var powerNameSpan = document.createElement('span');
							cell.appendChild(powerNameSpan);

							var powerName = '';
							if (cells === 1)
							{
								powerName = power.name;
								if (power.unlocked === false)
								{
									powerNameSpan.style.opacity = .5;
								}
							}
							else 
							{
								var upgradeIndex = (cells - 1) / 2;
								powerUpgrade = power.atts.upgrades[upgradeIndex];

								if (typeof powerUpgrade !== 'undefined')
								{
									powerName = powerUpgrade.name;

									//If it's an unlocked upgrade, make the opacity 1
									if (upgradeIndex < power.upgradesActivated)
									{
										powerNameSpan.style.opacity = 1;
									}
									else{
										powerNameSpan.style.opacity = .5;
									}
								}
							}

							powerNameSpan.innerHTML = powerName;

							currCellArray.push(powerNameSpan);
						}
						else 
						{
							var arrow = document.createElement('span');
							cell.appendChild(arrow);
							arrow.innerHTML = '&#8658;';
						}
					}

				}

				this.powersMenu.powerCells.push(currCellArray);

			}
			//Make the power description div
			var descriptionContainer = document.createElement('div');
			internalInfo.appendChild(descriptionContainer);

			descriptionContainer.style.top = '10px';
			descriptionContainer.style.left = '750px';
			descriptionContainer.style.width = '300px';
			descriptionContainer.style.height = '400px';
			descriptionContainer.style.border = '1px solid black';
			descriptionContainer.style.backgroundColor = g.COLORCONSTANTS.LIGHTBLUE;
			descriptionContainer.style.padding = '5px';
			descriptionContainer.style.position = 'absolute';
			

			var description = document.createElement('div');
			this.powersMenu.description = description;
			descriptionContainer.appendChild(description);

			var powerAtts = document.createElement('div');
			descriptionContainer.appendChild(powerAtts);
			this.powersMenu.powerAtts = powerAtts;
			powerAtts.style.position = 'absolute';
			powerAtts.style.top = '370px';
		}
	}
}





View.prototype.clearDOM = function()
{
	var dom = document.body;
	while (dom.firstChild)
	{
		dom.removeChild(dom.firstChild);
	}
}



//TEST
//Uses the test table
View.prototype.colorTilesInArray = function(tileArray)
{
	for (var i = 0 ; i < tileArray.length ; i++)
	{
		var tile = tileArray[i];
		var cell = g.game.level.TESTTABLE.rows[tile.y].cells[tile.x];
		cell.style.backgroundColor = g.COLORCONSTANTS.YELLOW;
	}
}