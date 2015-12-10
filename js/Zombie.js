

g.constructors.Zombie = function Zombie()
{

	this.tile;
	
	this.name = 'Zombie';
	this.enemyType = 'ZOMBIE';
	this.enemyText = 'Zombie';

	this.strength = 10;
	this.dexterity = 0;
	this.intelligence = 0;
	this.perception = 10;

	

	this.overrides = { //Will return these values instead of the values based on attributes
		maxHealth: 100,
		moveTime: 30,
	}

}

g.constructors.Zombie.prototype = new Enemy();









