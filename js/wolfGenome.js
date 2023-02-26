/** 
 * Genome Class
 *
 * @class
 * @author Alexandre Keller
 * @since 2014
 */

function WolfGenome() {

    this.chromosomes = [];
	this.score = 0;
	
	this.nbFeast = 0;
	this.nbPackFeast = 0;
}

WolfGenome.prototype = {

	deleteInner: function(){
	
        this.chromosomes = null;
		this.score = null;
	}
}

