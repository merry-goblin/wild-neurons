/** 
 * artificial/Nut Class
 *
 * @class
 * @author Alexandre Keller
 * @since 2014
 */

/** @namespace */
var artificial = artificial || {};

(function($, a) {

	a.Nut = function(settings) {
	
		/*** Private properties ***/
		
		settings = $.extend({
			x: 0.0,
			y: 0.0,
			isCarried: false
		}, settings);
		
		var x = settings.x;
		var y = settings.y;
		var isCarried = settings.isCarried;
		
		var scope = {
	    
			getX: function() {
				
				return x;
			},
	    
			getY: function() {
				
				return y;
			},
			
			getIsCarried: function() {
				
				return isCarried;
			},
			
			setIsCarried: function() {
				
				isCarried = true;
			}
		}
		return scope;
	}
	
})(jQuery, artificial);
