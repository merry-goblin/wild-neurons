/** 
 * Graphic Core Class
 * @class
 * @author Alexandre Keller
 * @since 2014
 */

/** @namespace */
var artificial = artificial || {};

(function($, a) {

	a.GraphicCore = function(settings) {
		
		/*** Private properties ***/
		
		var settings = $.extend({}, settings);
		
		//	Canvas
		var canvas = null;
		var context = null;
		
		var scaleX = null;
		var scaleY = null;
		
		//	Is enable
		var enable = false;
		
		//	Datas to draw
		var world = null;
		
		var plus = 0;
		
		var UI = {
			duration: 0,
			round: 0,
			generation: 0,
			fastMode: false,
			isPlaying: true
		}
		
		/**
		 *	Scale world to canvas dimensions
		 */
		function initScale() {
		
			if ( world.getWidth() == 0 || world.getHeight() == 0 ) {
				console.log("World's dimensions are invalid");
				return;
			}
			scaleX = canvas.width/world.getWidth();
			scaleY = canvas.height/world.getHeight();
			if ( scaleX > scaleY ) {
				scaleX = scaleY;
			}
			else {
				scaleY = scaleX;
			}
		}
		
		function transformWorldViewToUserFrame() {
			
			//	Translate (0, 0) to middle frame
			context.translate(canvas.width/2, canvas.height/2);
			
			//	Zoom and reverse y coordinates
			context.scale(scaleX, -scaleY);
		}
		
		function drawCircle(x, y, radius, style) {
		
			style = $.extend({
				fillStyle: '#98CE98', 
				strokeStyle: '#000',
				lineWidth: 1
			}, style);
			
			context.save();
				context.translate(x, y);
				context.beginPath();
				context.arc(0, 0, radius, 0, 2 * Math.PI, false);
				context.closePath();
				context.fillStyle = style.fillStyle;
				context.fill();
				context.lineWidth = style.lineWidth;
				context.strokeStyle = style.strokeStyle;
				context.stroke();
			context.restore();
		}
		
		function drawRect(x, y, width, height, style) {
		
			style = $.extend({
				fillStyle: '#fff', 
				strokeStyle: '#fff',
				lineWidth: 0
			}, style);
			
			context.save();
				context.beginPath();
				context.rect(x, y, width, height);
				context.closePath();
				context.fillStyle = style.fillStyle;
				context.fill();
				context.lineWidth = style.lineWidth;
				context.strokeStyle = style.strokeStyle;
				context.stroke();
			context.restore();
		}
		
		function drawNut(x, y, style) {
			
			style = $.extend({
				fillStyle: '#E87122', 
				strokeStyle: '#000'
			}, style);
			
			context.save();
				context.translate(x, y);
				context.rotate(45 * Math.PI / 180);
				context.beginPath();
				context.rect(-1*(15/2), -1*(15/2), 15, 15);
				context.closePath();
				context.fillStyle = style.fillStyle;
				context.fill();
				context.lineWidth = 1;
				context.strokeStyle = style.strokeStyle;
				context.stroke();
			context.restore();
		}
		
		function drawSquirrel(x, y, angle, style) {
			
			style = $.extend({
				fillStyle: '#398BBA', 
				strokeStyle: '#000'
			}, style);
			
			context.save();
				context.translate(x, y);
				context.rotate((angle-90) * Math.PI / 180);
				context.beginPath();
				context.moveTo(-10, -10);
				context.lineTo(10, -10);
				context.lineTo(0, 10);
				context.lineTo(-10, -10);
				context.closePath();
				context.fillStyle = style.fillStyle;
				context.fill();
				context.lineWidth = 1;
				context.strokeStyle = style.strokeStyle;
				context.stroke();
			context.restore();
		}
		
		function drawWolf(x, y, angle, style) {
		
			style = $.extend({
				fillStyle: '#f00', 
				strokeStyle: '#000'
			}, style);
			
			context.save();
				context.translate(x, y);
				context.rotate((angle-90) * Math.PI / 180);
				context.beginPath();
				context.moveTo(-11, -11);
				context.lineTo(11, -11);
				context.lineTo(0, 11);
				context.lineTo(-11, -11);
				context.closePath();
				context.fillStyle = style.fillStyle;
				context.fill();
				context.lineWidth = 1;
				context.strokeStyle = style.strokeStyle;
				context.stroke();
			context.restore();
		}
		
		function drawSafeZone(x, y, radius, style) {
		
			style = $.extend({
				fillStyle: '#98CE98', 
				strokeStyle: '#000'
			}, style);
			
			context.save();
				context.translate(x, y);
				context.beginPath();
				context.arc(0, 0, radius, 0, 2 * Math.PI, false);
				context.closePath();
				context.fillStyle = style.fillStyle;
				context.fill();
				context.lineWidth = 1;
				context.strokeStyle = style.strokeStyle;
				context.stroke();
			context.restore();
		}
		
		function clearWorld() {
		
			context.clearRect(0, 0, world.width, world.height);
		}
		
		function drawUI() {
		
			var duration = (Math.round(UI.duration/10))/100;
			var score = world.getSquirrels()[0].getScore();
			var death = world.getSquirrels()[0].getNbDie();
			var fastModeText = ( UI.fastMode ) ? 'enabled (*'+UI.fastSpeed+')' : 'disabled';
			
			context.font="13px Monospace";
			context.fillStyle = "rgba(255, 255, 255, 0.75)";
			context.fillText("Generation  "+UI.generation, 10, 15);
			context.fillText("Round       "+UI.round, 10, 30);
			context.fillText("Duration    "+duration, 10, 45);
			context.fillText("Score       "+score, 10, 60);
			context.fillText("Death       "+death, 10, 75);
			context.fillText("Fast mode   "+fastModeText, 10, 90);
			
			context.font="22px Arial";
			context.fillStyle = "rgba(255, 255, 255, 1)";
			context.strokeStyle = "rgba(30, 30, 30, 0.15)";
			context.lineWidth = 1;			
			if ( !UI.isPlaying ) {
				var backgroundStyle = {
					fillStyle: 'rgba(200, 200, 255, 0.75)'
				};
				drawRect(0, 0, canvas.width, canvas.height, backgroundStyle);
				context.fillText("PAUSE", canvas.width/2-36, canvas.height/2+10);
				context.strokeText("PAUSE", canvas.width/2-36, canvas.height/2+10);
				
				var keysBackgroundStyle = {
					fillStyle: 'rgba(60, 60, 60, 1)'
				};
				drawRect(5, 135, 180, 68, keysBackgroundStyle);
				context.font="bold 13px Courier New, Courier, monospace";
				context.fillStyle = "rgba(255, 255, 255, 1)";
				context.fillText("Pause/Play         "+"P ", 10, 150);
				context.fillText("Fast Mode          "+"F ", 10, 165);
				context.fillText("Boost Fast Speed   "+"->", 10, 180);
				context.fillText("Slow Fast Speed    "+"<-", 10, 195);
			}
		}
		
		function drawWorld() {
		
			plus += 1;
			
			clearWorld();
			
			context.save();
			
				transformWorldViewToUserFrame();
				
				//	Draw background();
				backgroundStyle = {
					fillStyle: '#204B63'
				};
				drawRect(-1*(world.getWidth()/2), -1*(world.getHeight()/2), world.getWidth(), world.getHeight(), backgroundStyle);
				
				//	Draw circular World
				worldStyle = {
					fillStyle: '#fff',
					strokeStyle: '#000',
					lineWidth: 2
				}
				drawCircle(0, 0, world.getSettings().worldZoneRadius, worldStyle);
				
				//	Draw Safe Zone
				safeZoneStyle = {
					fillStyle: '#82B282',
					strokeStyle: '#676',
					lineWidth: 3
				}
				drawCircle(0, 0, world.getSettings().safeZoneRadius, safeZoneStyle);
				
				//	Draw Nuts
				nuts = world.getNuts();
				for ( var i=0, len=nuts.length; i<len; i++) {
					if ( !nuts[i].getIsCarried() ) {
						drawNut(nuts[i].getX(), nuts[i].getY());
					}
				}
				
				//	Draw Squirrels
				squirrels = world.getSquirrels();
				for ( var i=0, len=squirrels.length; i<len; i++) {
					drawSquirrel(squirrels[i].getX(), squirrels[i].getY(), squirrels[i].getAngle());
				}
				
				//	Draw Wolwes
				wolves = world.getWolves();
				for ( var i=0, len=wolves.length; i<len; i++) {
				
					drawWolf(wolves[i].getX(), wolves[i].getY(), wolves[i].getAngle());
				}
				
			context.restore();
			
			//	UI
			drawUI();
		}
		
		var scope = {
	    
			/**
			  * Initialize the neuron.
			  * @method
			  */
			init: function(canvasId, worldParam) {
				
				//	Initialize canvas
				canvas = document.getElementById(canvasId);
				if ( !canvas ) {
					console.log("Canvas id not found");
					return;
				}
				context = canvas.getContext('2d');
				if ( !context ) {
					console.log("Context initialization has failed");
					return;
				}
				
				world = worldParam;
				
				initScale();
			},
			
			/**
			  * Draw in a loop
			  * @method
			  */
			draw: function() {
				
				enable = true;
				drawWorld();
			},
			
			/**
			  * Stop drawing
			  * @method
			  */
			clear: function() {
				
				clearWorld();
				enable = false;
			},
			
			updateUI: function(UIParam) {
				
				UI = $.extend(UI, UIParam);
			}
		}
		return scope;
	}
	
})(jQuery, artificial);
