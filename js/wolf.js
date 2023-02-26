/** 
 * artificial/Wolf Class
 *
 * i0: squirrel vector x
 * i1: squirrel vector y
 * i2: wolf vector x
 * i3: wolf vector y
 * i4: safe zone vector x
 * i5: safe zone vector y
 * i6: other wolf1 vector x
 * i7: other wolf1 vector y
 * i8: other wolf2 vector x
 * i9: other wolf2 vector y
 * 
 * @class
 * @author Alexandre Keller
 * @since 2014
 */

/** @namespace */
var artificial = artificial || {};

(function($, a) {

	a.Wolf = function(settings) {
	
		/*** Private properties ***/
		
		settings = $.extend({
			x: 0.0,
			y: 0.0,
			angle: 0.0,
			inputNeuronNumber: a.config.wolfInputNeuronNumber,
			hiddenNeuronNumber: a.config.wolfHiddenNeuronNumber,
			outputNeuronNumber: a.config.wolfOutputNeuronNumber,
			maxRotation: a.config.wolfMaxRotation,
			speed: a.config.wolfSpeed
		}, settings);
		
		var x = settings.x;
		var y = settings.y;
		var angle = settings.angle;
		var neuronalNetwork = null;
		var score = 0;
		
		var nbFeast = 0;
		var nbPackFeast = 0;
		
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
				}
				neuronalNetwork = a.NeuronalNetwork({
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
			
			eatsSquirrel: function(squirrel) {
			
				score++;
				nbFeast++;
				squirrel.eaten();
			},
			
			packEatsSquirrel: function() {
			
				nbPackFeast++;
			},
			
			getScore: function() {
			
				return score;
			},
			
			getNbFeast: function() {
			
				return nbFeast;
			},
			
			getNbPackFeast: function() {
			
				return nbPackFeast;
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
				
				var left = Number(outputNeurons[0].output);
				var right = Number(outputNeurons[1].output);
				
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
