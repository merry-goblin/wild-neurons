/** 
 * Genome Class
 *
 * @class
 * @author Alexandre Keller
 * @since 2014
 */

function SquirrelGenome() {

    this.chromosomes = [];
	this.score = 0;	// calculated, don't update directly
	this.nbNutsStored = 0;
	this.nbDeath = 0;
	this.nutHolded = 0; 
}

SquirrelGenome.prototype = {

	deleteInner: function(){
	
        this.chromosomes = null;
		this.score = null;
	}
}

