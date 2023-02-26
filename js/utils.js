
/** @namespace */
var artificial = artificial || {};

artificial.sigmoid = function(activation) {

	var exponent = -1*activation;
	var output = 1/(1+Math.pow(Math.E, exponent));
	return output;
}

artificial.vector = function(angle, distance) {
	
	var angle = angle % 360;
	var radian = artificial.angleToRadian(angle);
	
	var position = {
		x: Math.cos(radian)*distance,
		y: Math.sin(radian)*distance
	};
	
	return position;
}

artificial.angleBetween2Points = function(x1, y1, x2, y2) {

	return artificial.radianToAngle(Math.atan2(y1-y2, x1-x2)); 
}

artificial.angleToRadian = function(angle) {

	return angle * (Math.PI/180);
}

artificial.radianToAngle = function(radian) {

	return 180 * (radian/Math.PI);
}

artificial.distance = function(x1, y1, x2, y2) {
	
	var result = Math.sqrt( Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2) );
	return result;
}

artificial.getRandomInteger = function(min, max) {

	var alea = Math.random()*((max+1)-min)+min;
	return Math.floor(alea);
}

artificial.getRandomFloat = function(min, max, decimals) {
	
	if ( decimals == 0 ) {
		return artificial.getRandomInteger(min, max);
	}
	multiplier = Math.pow(10, decimals);
	min = Math.floor(min*multiplier);
	max = Math.floor(max*multiplier);
	var alea = artificial.getRandomInteger(min, max);
	alea = alea/multiplier;
	return alea;
}
