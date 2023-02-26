/** 
 * artificial/Round Class
 *
 * @class
 * @author Alexandre Keller
 * @since 2014
 */

/** @namespace */
var artificial = artificial || {};

(function($, a) {

	a.Round = function(settings) {
	
		/*** Private properties ***/
		var settings = $.extend({}, settings);
		var score = 0;
		var duration = 0;
		var isCurrent = false;
		
		var scope = {
			
			start: function() {
			
				isCurrent = true;
			},
			
			end: function(scoreParam) {
			
				score = scoreParam;
				isCurrent = false;
			},
	    
			getScore: function() {
				
				return score;
			},
			
			getIsCurrent: function() {
			
				return isCurrent;
			},
			
			getDuration: function(time) {
			
				if ( isCurrent ) {
					if ( time == undefined ) {
						time = 0;
					}
					duration += time
				}
				return duration;
			}
		}
		return scope;
	}
	
})(jQuery, artificial);
