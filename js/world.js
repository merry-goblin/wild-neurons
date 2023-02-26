/** 
 * artificial/World Class
 *
 * @class
 * @author Alexandre Keller
 * @since 2014
 */

/** @namespace */
var artificial = artificial || {};

(function($, a) {

	a.World = function(settings) {
		
		/*** Private properties ***/
		settings = $.extend({
			width: a.config.worldWidth,
			height: a.config.worldHeight,
			safeZoneRadius: a.config.safeZoneRadius,
			wolvesMinRadius: a.config.wolvesMinRadius,
			wolvesMaxRadius: a.config.wolvesMaxRadius,
			nutsMinRadius: a.config.nutsMinRadius,
			nutsMaxRadius: a.config.nutsMaxRadius,
			worldZoneRadius: a.config.worldZoneRadius,
			nutsNumber: a.config.nutsNumber,
			squirrelsNumber: a.config.squirrelsNumber,
			wolvesNumber: a.config.wolvesNumber
		}, settings);
		
		var width = settings.width;
		var height = settings.height;
		var maxDistance = 0;
		
		var wolves = null;
		var squirrels = null;
		var safeZone = null;
		var nuts = null;
		
		var score = 0;
		
		function closestNut(x, y) {
		
			var distanceMin = 99999;
			var indexMin = null;
			for ( var i=0, len=nuts.length; i<len; i++ ) {
				if ( nuts[i].getIsCarried() == false ) {
					nutDistance = a.distance(x, y, nuts[i].getX(), nuts[i].getY());
					if ( nutDistance < distanceMin ) {
						indexMin = i;
						distanceMin = nutDistance;
					}
				}
			}
			if ( indexMin != null ) {
				return nuts[indexMin];
			}
			return false;
		}
		
		function inputsModifier() {
			
			/**
			 *	Needs
			 */
			
			//	Squirrel direction
			var squirrelDirectionVector = a.vector(squirrels[0].getAngle(), 1);
			
			//	Closest nut direction
			var nut = closestNut(squirrels[0].getX(), squirrels[0].getY());
			var useNutDirection = true;
			if ( !nut ) {
				useNutDirection = false;
			}
			else if ( nut.getIsCarried() ) {
				useNutDirection = false;
			}
			
			//	Safe zone direction
			var safeZoneDirectionVector = a.vector(a.angleBetween2Points(squirrels[0].getX(), squirrels[0].getY(), safeZone.x, safeZone.y), 1);
			
			//	Does the squirrel hold a nut
			var squirrelIsHoldedANut = (squirrels[0].isHoldingANut()) ? 1 : 0;
			
			//	Does the squirrel is in the safe zone
			var distanceSquirrelSafeZone = a.distance(squirrels[0].getX(), squirrels[0].getY(), safeZone.x, safeZone.y);
			var squirrelIsInTheSafeZone = (distanceSquirrelSafeZone < safeZone.radius) ? 1 : 0;
			
			//	Wolves direction
			var wolfDirectionSquirrelVector = [];
			for ( var i=0, len=wolves.length; i<len; i++ ) {
				var angleWolfSquirrel = a.angleBetween2Points(squirrels[0].getX(), squirrels[0].getY(), wolves[i].getX(), wolves[i].getY());
				if ( angleWolfSquirrel > 180 ) {
					angleWolfSquirrel -= 360;
				}
				else if ( angleWolfSquirrel < -180 ) {
					angleWolfSquirrel += 360;
				}
				wolfDirectionSquirrelVector[i] = a.vector(angleWolfSquirrel, 1);
			}
			
			/**
			 *	Squirrel inputs
			 */
			var squirrelInputs = squirrels[0].getNeuronalNetwork().getInputNeurons();
			for ( var i=0, len=squirrelInputs.length; i<len; i++ ) {
				squirrelInputs[i].forceOutput(1);
			}
			
			squirrelInputs[0].forceOutput(squirrelDirectionVector.x);
			squirrelInputs[1].forceOutput(squirrelDirectionVector.y);
			if ( useNutDirection ) {
				var nutDirectionVector = a.vector(a.angleBetween2Points(squirrels[0].getX(), squirrels[0].getY(), nut.getX(), nut.getY()), 1);
				squirrelInputs[2].forceOutput(nutDirectionVector.x);
				squirrelInputs[3].forceOutput(nutDirectionVector.y);
			}
			else {
				squirrelInputs[2].forceOutput(squirrelDirectionVector.x);
				squirrelInputs[3].forceOutput(squirrelDirectionVector.y);
			}
			squirrelInputs[4].forceOutput(safeZoneDirectionVector.x);
			squirrelInputs[5].forceOutput(safeZoneDirectionVector.y);
			squirrelInputs[6].forceOutput(squirrelIsHoldedANut);
			squirrelInputs[7].forceOutput(squirrelIsInTheSafeZone);
			
			var y = 7;
			for ( var i=0, len=wolves.length; i<len; i++ ) {
				squirrelInputs[++y].forceOutput(wolfDirectionSquirrelVector[i].x);
				squirrelInputs[++y].forceOutput(wolfDirectionSquirrelVector[i].y);
			} // y = 13
			
			/**
			 *	Wolves inputs
			 */
			for ( var w=0, lenW=wolves.length; w<lenW; w++ ) {
				
				var y = 0;
				var wolfInputs = wolves[w].getNeuronalNetwork().getInputNeurons();
				for ( var i=0, lenI=wolfInputs.length; i<lenI; i++ ) {
					wolfInputs[i].forceOutput(1);
				}
				
				//	Wolf direction
				var wolfDirectionVector = a.vector(wolves[w].getAngle(), 1);
				
				wolfInputs[y++].forceOutput(wolfDirectionVector.x);
				wolfInputs[y++].forceOutput(wolfDirectionVector.y);
				wolfInputs[y++].forceOutput(wolfDirectionSquirrelVector[w].x);
				wolfInputs[y++].forceOutput(wolfDirectionSquirrelVector[w].y);
				
				/*wolfInputs[y++].forceOutput(squirrelDirectionVector.x);
				wolfInputs[y++].forceOutput(squirrelDirectionVector.y);*/
				/*wolfInputs[y++].forceOutput(safeZoneDirectionVector.x);
				wolfInputs[y++].forceOutput(safeZoneDirectionVector.y);*/
				/*
				var squirrelDistance = a.distance(wolves[w].getX(), wolves[w].getY(), squirrels[0].getX(), squirrels[0].getY());
				var relativeDistance = squirrelDistance/maxDistance;
				wolfInputs[y++].forceOutput(relativeDistance);*/
				
				/*
				for ( var i=0, len=wolves.length; i<len; i++ ) {
					if ( i != w ) {
						wolfInputs[y++].forceOutput(wolfDirectionVector[i].x);
						wolfInputs[y++].forceOutput(wolfDirectionVector[i].y);
					}
				}*/
			}
		}
		
		var scope = {
	    
			/**
			  * @method
			  */
			init: function() {
			
				safeZone = {
					x: 0,
					y: 0,
					radius: settings.safeZoneRadius
				};
				
				maxDistance = settings.worldZoneRadius*2;
				
				nuts = [];
				for ( var i=0; i<settings.nutsNumber; i++ ) {
					var nutDistance = a.getRandomInteger(settings.nutsMinRadius, settings.nutsMaxRadius);
					var nutAngle = a.getRandomInteger(0, 360);
					var posNut = a.vector(nutAngle, nutDistance);
					nuts[i] = new a.Nut(posNut);
				}
				
				squirrels = [];
				squirrels[0] = new a.Squirrel({x: 0, y: 0, angle: 0});
				squirrels[0].init();
				
				wolves = [];
				for ( var i=0; i<settings.wolvesNumber; i++ ) {
					var wolfDistance = a.getRandomInteger(settings.wolvesMinRadius, settings.wolvesMaxRadius);
					var wolfAngle = a.getRandomInteger(0, 360);
					var wolfPos = a.vector(wolfAngle, wolfDistance);
					wolves[i] = new a.Wolf(wolfPos);
					wolves[i].init();
				}
			},
			
			getSettings: function() {
			
				return settings;
			},
			
			loop: function() {
				
				this.worldInteraction();
				inputsModifier();
				
				squirrels[0].activate();
				
				for ( var i=0, len=wolves.length; i<len; i++ ) {
					wolves[i].activate();
				}
			},
			
			/**
			 *	Actually public to access to utils.js functions
			 *	!Todo: Utils should be available for private functions
			 */
			worldInteraction: function() {
				
				//	Does Squirrel is out of the world ?
				var dist = a.distance(0, 0, squirrels[0].getX(), squirrels[0].getY());
				if ( dist >= settings.worldZoneRadius ) {
					
					var angle = a.angleBetween2Points(squirrels[0].getX(), squirrels[0].getY(), 0, 0);
					squirrels[0].moveToPoint(squirrels[0].getX()*-1, squirrels[0].getY()*-1, squirrels[0].getAngle());
					squirrels[0].moveToward(squirrels[0].getSettings().speed, angle);
				}
				
				//	Does squirrel is actually holding a nut ?
				if ( squirrels[0].isHoldingANut() ) {
					var distanceSquirrelSafeZone = a.distance(squirrels[0].getX(), squirrels[0].getY(), safeZone.x, safeZone.y);
					if ( distanceSquirrelSafeZone < safeZone.radius ) {
						nut = squirrels[0].getHoldedNut();
						squirrels[0].storeNut();
						nuts.splice(nuts.indexOf(nut), 1);
					}
				}
				else {
				
					var nut = closestNut(squirrels[0].getX(), squirrels[0].getY());
					if ( nut != false ) {
						var distanceSquirrelNut = a.distance(squirrels[0].getX(), squirrels[0].getY(), nut.getX(), nut.getY());
						
						if ( distanceSquirrelNut < 21 ) {
							squirrels[0].holdNut(nut);
						}
					}
				}
				
				for ( var w=0, len=wolves.length; w<len; w++ ) {
				
					//	Does Wolf is out of the world or in the saze zone ?
					var dist = a.distance(0, 0, wolves[w].getX(), wolves[w].getY());
					if ( dist >= settings.worldZoneRadius-10 ) {
						var angle = a.angleBetween2Points(wolves[w].getX(), wolves[w].getY(), 0, 0);
						wolves[w].moveToPoint(wolves[w].getX()*-1, wolves[w].getY()*-1, wolves[w].getAngle());
						wolves[w].moveToward(wolves[w].getSettings().speed, angle);
					}/*
					else if ( dist <= settings.safeZoneRadius+10 ) {
						var angle = a.angleBetween2Points(wolves[w].getX(), wolves[w].getY(), 0, 0);
						wolves[w].moveToward(wolves[w].getSettings().speed, angle);
					}*/
					
					//	Does this Wolf eat the squirrel ?
					if ( dist > settings.safeZoneRadius+10 ) {
						var distanceSquirrelWolf = a.distance(wolves[w].getX(), wolves[w].getY(), squirrels[0].getX(), squirrels[0].getY());
						if ( distanceSquirrelWolf < 22 ) {
							wolves[w].eatsSquirrel(squirrels[0]);
							for ( var wo=0, lenWo=wolves.length; wo<lenWo; wo++ ) {
								wolves[wo].packEatsSquirrel();
							}
						}
					}
				}
			},
			
			getWidth: function() {
			
				return width;
			},
			
			getHeight: function() {
			
				return height;
			},
			
			getWolves: function() {
			
				return wolves;
			},
			
			getSquirrels: function() {
			
				return squirrels;
			},
			
			getSafeZone: function() {
				
				return safeZone;
			},
			
			getNuts: function() {
				
				return nuts;
			},
			
			getScore: function() {
			
				score += Math.ceil(Math.random() * 50);
				return score;
			},
			
			resetScore: function() {
			
				score = 0;
			},
			
			getSettings: function() {
			
				return settings;
			}
		}
		return scope;
	}
	
})(jQuery, artificial);
