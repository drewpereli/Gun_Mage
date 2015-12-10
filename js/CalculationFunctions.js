
function rotate(x, y, axisX, axisY, angle)
{
	var s = Math.sin(angle);
	var c = Math.cos(angle);

	var newX = c * (x - axisX) - s * (y - axisY) + axisX;
	var newY = s * (x - axisX) + c * (y - axisY) + axisY;
	newX = Math.round(newX);
	newY = Math.round(newY);

	return {x: newX, y: newY};
}


function rotateKeepWithinMap(x, y, axisX, axisY, angle){

	var rotation = rotate(x, y, axisX, axisY, angle);
	var newX = rotation.x;
	var newY = rotation.y;

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

	return {x: newX, y: newY};
}



function degreesToRadians(d)
{
	return d * (Math.PI / 180);
}


function radiansToDegrees(r)
{
	//Pi r = 180 d. 
	return (180 / Math.PI) * r;
}




function getDistance(x1, y1, x2, y2)
{
	var dX = x2 - x1;
	var dY = y2 - y1;
	return Math.sqrt(dX * dX + dY * dY);
}




function round(number, decimalPoints)
{
	var multiplier = Math.pow(10, decimalPoints);
	if (decimalPoints === 0)
	{
		return Math.round(number);
	}
	
	return Math.round(number * multiplier) / multiplier;
}



