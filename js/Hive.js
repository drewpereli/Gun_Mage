
g.constructors.Hive = function Hive(type)
{
	//this.name = type + " Hive";
	this.enemyType = "HIVE";
	this.enemyText = type + " Hive";

	this.unitProduced = type;

	this.overrides = {
		maxHealth: 300,
	}

}

g.constructors.Hive.prototype = new Enemy();



g.constructors.Hive.prototype.act = function()
{
	var openTile = false;
	var startingIndex = g.rand.nextInt(0, 4);
	for (var ind = startingIndex ; ind < startingIndex + 4 ; ind++)
	{
		var i = ind % 4;
		var sib = this.tile.siblings[i];
		if (sib.terrain !== 'OPEN' || sib.unit !== false)
		{
			continue;
		}
		openTile = sib;
		break;
	}

	if (openTile === false)
	{
		return;
	}

	//If we're producing a unit
	if (g.rand.next(0, 1) < g.HIVESPAWNCHANCE)
	{
		var unit = new g.constructors[this.unitProduced]();
		g.game.spawnUnit(unit, openTile, "WANDERING");
	}

	this.timeUntilNextAction = 0;
}




