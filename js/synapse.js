/** 
 * Synapse Class
 *
 * @class
 * @author Alexandre Keller
 * @since 2014
 */

function Synapse() {

    this.weigth = null;
	this.axon = null;
	this.dendrite = null;
	
	this.deleteInner = function() {
		
		this.axon = null;
		this.dendrite = null;
    };
}

Synapse.prototype = {

	deleteInner: function(){
        this.axon = null;
		this.dendrite = null;
	}
}
