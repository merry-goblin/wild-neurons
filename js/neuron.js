
function Neuron() {

    this.output = null;
	this.axons = [];
	this.dendrites = [];
}

Neuron.prototype = {

	/**
	 *	To use when ouput is not calculated
	 *	Output is calculated on the a sygmoid function result with the activation value
	 */
	forceOutput: function(output){
        this.output = output;
	},
	
	addToDendrites: function(synapse) {
		this.dendrites[this.dendrites.length] = synapse;
		synapse.dendrite = this;
	},
	
	addToAxons: function(synapse) {
		this.axons[this.axons.length] = synapse;
		synapse.axon = this;
	},
	
	deleteInner: function() {
		
		for (var i, len=this.axons.length; i<len; i++) {
			this.axons[i] = null;
		}
		for (var i, len=this.dendrites.length; i<len; i++) {
			this.dendrites[i] = null;
		}
    }
}