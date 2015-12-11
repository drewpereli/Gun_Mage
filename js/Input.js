


function Input()
{

}


//Left Arrow: 37
//Right Arrow: 39
//Up Arrow: 38
//Down Arrow: 40
//Space: 32
//Period: 190
//x: 88 -- Examine
//m: 77 -- Menu
//e: 69 -- Equipment, Equip, unequip (depending on the state)
//p: 80 -- Powers
//1: 49 -- Power 1
//2: 50 -- Power 2
//3: 51 -- Power 3
//4: 52 -- Power 4
//5: 53 -- Power 5
//Esc: 27 -- Options, Escape (back to default state usually)
//d: 68 -- Destroy
//a: 65 -- Attack/aim
//u: 85 -- Use
//r: 82 -- Reload
//l: 76 -- Emphasize/demphasize lighting
//i: 73 -- Get info
//Tab: 9 -- Change stance
//?: Shift + 191 -- Open manual
//Enter: 13 -- Selecting menu options

Input.prototype.keyDown = function(e)
{
	var state = g.game.state;
	var code = e.keyCode;
	//console.log(code);
	//First, prevent defaults
	if (code === 37 || code === 39 || code === 38 || code === 40 || code === 9)
	{
		e.preventDefault();
	}
	//If it's question mark, open manual regardless of state
	if (code === 191)
	{
		if (e.shiftKey)
		{
			g.game.openManual();
		}
	}

	
	

	if (state === "DEFAULT" || state === "TUTORIAL")
	{
		switch (code){
			//Left arrow
			case 37:
				if (e.altKey){
					g.game.turnPlayer("LEFT", true);
				}
				else if (e.shiftKey)
				{
					g.game.shiftPlayer("LEFT");
				}
				else{
					g.game.movePlayer("LEFT");
				}
				break;
			//Right arrow
			case 39:
				if (e.altKey){
					g.game.turnPlayer("RIGHT", true);
				}
				else if (e.shiftKey)
				{
					g.game.shiftPlayer("RIGHT");
				}
				else{
					g.game.movePlayer("RIGHT");
				}
				break;
			//Up arrow
			case 38:
				if (e.altKey){
					g.game.turnPlayer("UP", true);
				}
				else if (e.shiftKey)
				{
					g.game.shiftPlayer("UP");
				}
				else{
					g.game.movePlayer("UP");
				}
				break;
			//Down arrow
			case 40:
				if (e.altKey){
					g.game.turnPlayer("DOWN", true);
				}
				else if (e.shiftKey)
				{
					g.game.shiftPlayer("DOWN");
				}
				else{
					g.game.movePlayer("DOWN");
				}
				break;
			//Space
			case 32:
				g.game.playerWait();
				break;
			//Period
			case 190:
				if (e.shiftKey)
				{
					g.game.playerRest();
				}
				else
				{
					g.game.playerWait();
				}
				break;
			//a
			case 65:
				g.game.changeState("AIMING");
				break;
			//x
			case 88:
				g.game.changeState("EXAMINING");
				break;
			//c
			case 67:
				g.game.changeState("MENU.CHARACTER");
				break;
			//m
			case 77:
				g.game.changeState("MENU.CHARACTER");
				break;
			//e
			case 69:
				g.game.changeState("MENU.EQUIPMENT");
				break;
			//i
			case 73:
				g.game.changeState("MENU.EQUIPMENT");
				break;
			//p
			case 80:
				g.game.changeState("MENU.POWERS");
				break;
			//1
			case 49:
				g.game.playerUseOrAimPower(0);
				break;
			//2
			case 50:
				g.game.playerUseOrAimPower(1);
				break;
			//3
			case 51:
				g.game.playerUseOrAimPower(2);
				break;
			//4
			case 52:
				g.game.playerUseOrAimPower(3);
				break;
			//5
			case 53:
				g.game.playerUseOrAimPower(4);
				break;
			//6
			case 54:
				g.game.playerUseOrAimPower(5);
				break;
			//7
			case 55:
				g.game.playerUseOrAimPower(6);
				break;
			//8
			case 56:
				g.game.playerUseOrAimPower(7);
				break;
			//9
			case 57:
				g.game.playerUseOrAimPower(8);
				break;
			//Escape
			case 27:
				g.game.changeState("OPTIONS");
				break;
			//o
			case 79:
				g.game.changeState("OPENING");
				break;
			//c
			case 67:
				g.game.changeState("CLOSING");
				break;
			/*
			//g
			case 71:
				g.game.playerPickUp();
				break;
			*/
			//r
			case 82:
				g.game.playerReload();
				break;
			//Tab
			case 9:
				g.game.changePlayerStance();
				break;
			//l
			case 76:
				g.game.changeLightingEmphasis();
				break;
			//d
			case 68:
				g.game.toggleShowDirections();
				break;
			//v
			case 86:
				g.game.toggleShowStealthRadius();
				break;
			default:
				//console.log("No case for " + e.key + " in the " + state + " state.");
		}

	}
	else if (state === "AIMING")
	{
		switch (code){
			//Left arrow
			case 37:
				g.game.moveAim("LEFT");
				break;
			//Right arrow
			case 39:
				g.game.moveAim("RIGHT");
				break;
			//Up arrow
			case 38:
				g.game.moveAim("UP");
				break;
			//Down arrow
			case 40:
				g.game.moveAim("DOWN");
				break;
			//Space
			case 32:
				g.game.changeState("DEFAULT");
				break;
			//Period
			case 190:
				g.game.changeState("DEFAULT");
				break;
			//a
			case 65:
				g.game.playerFire();
				break;
			//Enter
			case 13:
				g.game.playerFire();
				break;
			//x
			case 88:
				g.game.changeState("EXAMINING");
				break;
			//m
			case 77:
				g.game.changeState("MENU.CHARACTER");
				break;
			//e
			case 69:
				g.game.changeState("MENU.EQUIPMENT");
				break;
			//p
			case 80:
				g.game.changeState("MENU.POWERS");
				break;
			//1
			case 49:
				g.game.playerUseOrAimPower(0);
				break;
			//2
			case 50:
				g.game.playerUseOrAimPower(1);
				break;
			//3
			case 51:
				g.game.playerUseOrAimPower(2);
				break;
			//4
			case 52:
				g.game.playerUseOrAimPower(3);
				break;
			//5
			case 53:
				g.game.playerUseOrAimPower(4);
				break;
			//6
			case 54:
				g.game.playerUseOrAimPower(5);
				break;
			//7
			case 55:
				g.game.playerUseOrAimPower(6);
				break;
			//8
			case 56:
				g.game.playerUseOrAimPower(7);
				break;
			//9
			case 57:
				g.game.playerUseOrAimPower(8);
				break;
			//Escape
			case 27:
				g.game.changeState("DEFAULT");
				break;
				//r
			case 82:
				g.game.playerReload();
				break;
			//l
			case 76:
				g.game.changeLightingEmphasis();
				break;
			//d
			case 68:
				g.game.toggleShowDirections();
				break;
			//v
			case 86:
				g.game.toggleShowStealthRadius();
				break;
			default:
				//console.log("No case for " + e.key + " in the " + state + " state.");
		}
	}
	else if (state === "AIMINGPOWER")
	{
		switch (code)
		{
			//Left arrow
			case 37:
				g.game.moveAim("LEFT");
				break;
			//Right arrow
			case 39:
				g.game.moveAim("RIGHT");
				break;
			//Up arrow
			case 38:
				g.game.moveAim("UP");
				break;
			//Down arrow
			case 40:
				g.game.moveAim("DOWN");
				break;
			//Space
			case 32:
				g.game.changeState("DEFAULT");
				break;
			//Period
			case 190:
				g.game.changeState("DEFAULT");
				break;
			//a
			case 65:
				g.game.changeState("AIMING");
				break;
			//x
			case 88:
				g.game.changeState("EXAMINING");
				break;
			//1
			case 49:
				g.game.playerUseOrAimPower(0);
				break;
			//2
			case 50:
				g.game.playerUseOrAimPower(1);
				break;
			//3
			case 51:
				g.game.playerUseOrAimPower(2);
				break;
			//4
			case 52:
				g.game.playerUseOrAimPower(3);
				break;
			//5
			case 53:
				g.game.playerUseOrAimPower(4);
				break;
			//6
			case 54:
				g.game.playerUseOrAimPower(5);
				break;
			//7
			case 55:
				g.game.playerUseOrAimPower(6);
				break;
			//8
			case 56:
				g.game.playerUseOrAimPower(7);
				break;
			//9
			case 57:
				g.game.playerUseOrAimPower(8);
				break;
			//Escape
			case 27:
				g.game.changeState("DEFAULT");
				break;
			//d
			case 68:
				g.game.toggleShowDirections();
				break;
			//v
			case 86:
				g.game.toggleShowStealthRadius();
				break;
			default:
				break;
		}
	}
	else if (state === "EXAMINING")
	{
		switch (code)
		{
			//Left arrow
			case 37:
				g.game.moveFocus("LEFT");
				break;
			//Right arrow
			case 39:
				g.game.moveFocus("RIGHT");
				break;
			//Up arrow
			case 38:
				g.game.moveFocus("UP");
				break;
			//Down arrow
			case 40:
				g.game.moveFocus("DOWN");
				break;
			//Space
			case 32:
				g.game.changeState("DEFAULT");
				break;
			//Period
			case 190:
				g.game.changeState("DEFAULT");
				break;
			//a
			case 65:
				g.game.changeState("AIMING");
				break;
			//x
			case 88:
				g.game.changeState("DEFAULT");
				break;
			//i
			case 73:
				g.game.getInfo();
				break;
			//m
			case 77:
				g.game.changeState("MENU.CHARACTER");
				break;
			//e
			case 69:
				g.game.changeState("MENU.EQUIPMENT");
				break;
			//p
			case 80:
				g.game.changeState("MENU.POWERS");
				break;
			//1
			case 49:
				g.game.playerUseOrAimPower(0);
				break;
			//2
			case 50:
				g.game.playerUseOrAimPower(1);
				break;
			//3
			case 51:
				g.game.playerUseOrAimPower(2);
				break;
			//4
			case 52:
				g.game.playerUseOrAimPower(3);
				break;
			//5
			case 53:
				g.game.playerUseOrAimPower(4);
				break;
			//Escape
			case 27:
				g.game.changeState("DEFAULT");
				break;
			//r
			case 82:
				g.game.playerReload();
				break;
			//l
			case 76:
				g.game.changeLightingEmphasis();
				break;
			//d
			case 68:
				g.game.toggleShowDirections();
				break;
			//v
			case 86:
				g.game.toggleShowStealthRadius();
				break;
			default:
				//console.log("No case for " + e.key + " in the " + state + " state.");
		}
	}
	else if (state === "OPTIONS")
	{
		switch (code)
		{
			//Up
			case 38:
				g.game.moveOption("UP");
				break;
			//Down
			case 40:
				g.game.moveOption("DOWN");
				break;
			//Esc
			case 27:
				g.game.changeState("DEFAULT");
				break;
			//Enter
			case 13:
				g.game.selectMenuOption();
				break;
			default:
				//console.log("No case for " + e.key + " in the " + state + " state.");
		}
	}
	else if (state === "MENU.CHARACTER")
	{
		switch (code)
		{
			//Left
			case 37:
				g.game.changeAttributeSelection("LEFT");
				break;
			//Right
			case 39:
				g.game.changeAttributeSelection("RIGHT");
				break;
			//Up
			case 38:
				g.game.changeAttributeSelection("UP");
				break;
			//Down
			case 40:
				g.game.changeAttributeSelection("DOWN");
				break;
			//Enter
			case 13:
				g.game.upgradeAttribute();
				break;
			//m
			case 77:
				g.game.changeState("DEFAULT");
				break;
			//Escape
			case 27:
				g.game.changeState("DEFAULT");
				break;
			default:
				//console.log("No case for " + e.key + " in the " + state + " state.");
		}
	}
	else if (state === "MENU.EQUIPMENT")
	{
		switch (code)
		{
			//Left
			case 37:
				g.game.changeEquipmentSelection("LEFT");
				break;
			//Right
			case 39:
				g.game.changeEquipmentSelection("RIGHT");
				break;
			//Up
			case 38:
				g.game.changeEquipmentSelection("UP");
				break;
			//Down
			case 40:
				g.game.changeEquipmentSelection("DOWN");
				break;
			//m
			case 77:
				g.game.changeState("DEFAULT");
				break;
			//e
			case 69:
				g.game.equipOrUnequipSelectedItem();
				break;
			//Enter
			case 13:
				g.game.equipOrUnequipSelectedItem();
				break;
			//d
			case 68:
				g.game.destroySelectedItem();
				break;
			//Escape
			case 27:
				g.game.changeState("DEFAULT");
				break;
			
			default:
				//console.log("No case for " + e.key + " in the " + state + " state.");
		}
	}
	else if (state === "MENU.POWERS")
	{
		switch (code)
		{
			//Left
			case 37:
				g.game.changePowersSelection("LEFT");
				break;
			//Right
			case 39:
				g.game.changePowersSelection("RIGHT");
				break;
			//Up
			case 38:
				g.game.changePowersSelection("UP");
				break;
			//Down
			case 40:
				g.game.changePowersSelection("DOWN");
				break;
			//m
			case 77:
				g.game.changeState("DEFAULT");
				break;
			//Escape
			case 27:
				g.game.changeState("DEFAULT");
				break;
			//Enter
			case 13:
				g.game.upgradePower();
				break;
			default:
				//console.log("No case for " + e.key + " in the " + state + " state.");
		}
	}
	else if (state === 'MAINMENU')
	{
		switch (code)
		{
			//Up
			case 38:
				g.game.changeMainMenuSelection("UP");
				break;
			//Down
			case 40:
				g.game.changeMainMenuSelection("DOWN");
				break;
			//Enter
			case 13:
				g.game.selectMainMenuSelection();
				break;
		}
	}
	else if (state === 'RACEMENU')
	{
		switch (code)
		{
			//Up
			case 38:
				g.game.changeRaceMenuSelection("UP");
				break;
			//Down
			case 40:
				g.game.changeRaceMenuSelection("DOWN");
				break;
			//Enter
			case 13:
				g.game.selectRaceMenuSelection();
				break;
			//Escape
			case 27:
				g.game.changeState("MAINMENU");
				break;
		}
	}
	else if (state === 'CLASSMENU')
	{
		switch (code)
		{
			//Up
			case 38:
				g.game.changeClassMenuSelection("UP");
				break;
			//Down
			case 40:
				g.game.changeClassMenuSelection("DOWN");
				break;
			//Enter
			case 13:
				g.game.selectClassMenuSelection();
				break;
			//Escape
			case 27:
				g.game.changeState("RACEMENU");
				break;
		}
	}
	else if (state === 'RESTING')
	{
		g.game.changeState('DEFAULT');
	}
	else if (state === 'MESSAGE')
	{
		if (code === 27)//Escape
		{
			if (g.game.inTutorial){g.game.changeState('DEFAULT');}
			else g.game.changeState('EXAMINING');
		}
	}
}



Input.prototype.initialize = function()
{
	document.body.addEventListener('keydown', g.input.keyDown);
}

