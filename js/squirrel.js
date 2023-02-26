/** 
 * artificial/Squirrel Class
 *
 * i0: squirrel vector x
 * i1: squirrel vector y
 * i2: nut position x
 * i3: nut position y
 * i4: safe zone vector x
 * i5: safe zone vector y
 * i6: nut holded
 * i7: in safe zone
 * i8: wolf1 vector x
 * i9: wolf1 vector y
 * i10: wolf2 vector x
 * i11: wolf2 vector y
 * i12: wolf3 vector x
 * i13: wolf3 vector y
 *
 * @class
 * @author Alexandre Keller
 * @since 2014
 */

/** @namespace */
var artificial = artificial || {};

(function($, a) {

	a.Squirrel = function(settings) {
	
		/*** Private properties ***/
		
		settings = $.extend({
			x: 0.0,
			y: 0.0,
			angle: 0.0,
			inputNeuronNumber: a.config.squirrelInputNeuronNumber+a.config.wolvesNumber*2,
			hiddenNeuronNumber: a.config.squirrelHiddenNeuronNumber,
			outputNeuronNumber: a.config.squirrelOutputNeuronNumber,
			maxRotation: a.config.squirrelMaxRotation,
			speed: a.config.squirrelSpeed
		}, settings);
		
		var x = settings.x;
		var y = settings.y;
		var angle = settings.angle;
		var holdedNut = null;
		var neuronalNetwork = null;
		var score = 0;
		
		var nbNutsStored = 0;
		var nbDie = 0;
		
		function limitRotation(rotation) {
		
			if ( rotation < (-1*settings.maxRotation) ) {
				rotation = (-1*settings.maxRotation);
			}
			else if ( rotation > (settings.maxRotation) ) {
				rotation = (settings.maxRotation);
			}
			return rotation;
		}
		
		var scope = {
		
			init: function() {
			
				if ( neuronalNetwork != null ) {
					neuronalNetwork.deleteInner();
					neuronalNetwork = null;
					holdedNut = null;
				}
				neuronalNetwork = new a.NeuronalNetwork({
					inputNeuronNumber: settings.inputNeuronNumber,
					hiddenNeuronNumber: settings.hiddenNeuronNumber,
					outputNeuronNumber: settings.outputNeuronNumber
				});
				neuronalNetwork.init();
			},
			
			getX: function() {
				
				return x;
			},
			
			getY: function() {
				
				return y;
			},
			
			getAngle: function() {
				
				return angle;
			},
			
			getSettings: function() {
			
				return settings;
			},
			
			isHoldingANut: function() {
			
				if ( holdedNut == null ) {
					return false;
				}
				return true;
			},
			
			eaten: function() {
			
				this.moveToPoint(0, 0, this.getAngle());
				nbDie++;
			},
			
			getHoldedNut: function() {
				
				return holdedNut;
			},
			
			storeNut: function() {
			
				score++;
				nbNutsStored++;
				holdedNut = null;
			},
			
			holdNut: function(nut) {
			
				score++;
				holdedNut = nut;
				nut.setIsCarried();
			},
			
			getScore: function() {
			
				return score;
			},
			
			getNbNutsStored: function() {
			
				return nbNutsStored;
			},
			
			getNbDie: function() {
			
				return nbDie;
			},
			
			getNeuronalNetwork: function() {
				
				return neuronalNetwork;
			},
			
			moveToPoint: function(xParam, yParam, angleParam) {
			
				x = xParam;
				y = yParam;
				angle = angleParam;
			},
			
			moveToward: function(distance, angleParam) {
			
				directionVector = a.vector(angleParam, distance);
				
				x += directionVector.x;
				y += directionVector.y;
				angle = angleParam;
			},
			
			activate: function() {
				
				neuronalNetwork.activate();
				var outputNeurons = neuronalNetwork.getOutputNeurons();
				
				var leftMove = outputNeurons[0].output;
				var rightMove = outputNeurons[1].output;
				
				var rotationRadians = limitRotation(leftMove-rightMove);
				var rotationDegrees = a.radianToAngle(rotationRadians);
				
				var newAngle = angle+rotationDegrees;
				var distance = (leftMove + rightMove)*settings.speed;
				
				this.moveToward(distance, newAngle);
			}
		}
		return scope;
	}
	
})(jQuery, artificial);
