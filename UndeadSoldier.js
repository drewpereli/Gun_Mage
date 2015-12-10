function UndeadSoldier()
{
	this.name = 'Name goes here';
	this.enemyType = 'UNDEADSOLDIER';
	this.enemyText = 'Undead Soldier';

	this.strength = 10;
	this.dexterity = 5;
	this.intelligence = 0;
	this.perception = 15;

	this.overrides = {
		maxHealth: 200,
		moveTime: 20,
	}
}

UndeadSoldier.prototype = new Enemy();
