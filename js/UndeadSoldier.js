g.constructors.UndeadSoldier = function UndeadSoldier()
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
		viewAngle: 90,
		viewRange: 20,
	}

	this.equipedWeapon = new Rifle();
}

g.constructors.UndeadSoldier.prototype = new Enemy();
