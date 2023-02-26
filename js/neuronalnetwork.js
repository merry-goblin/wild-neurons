/** 
 * artificial/NeuronalNetwork Class
 * 
 * @class
 * @author Alexandre Keller
 * @since 2014
 */

/** @namespace */
var artificial = artificial || {};

(function($, a) {

	a.NeuronalNetwork = function(settings) {
	
		/*** Private properties ***/
		
		settings = $.extend({
			inputNeuronNumber: 0,
			hiddenNeuronNumber: 0,
			outputNeuronNumber: 0
		}, settings);
		
		//	Threeshold
		settings.inputNeuronNumber++;
		
		var inputNeurons = null;
		var threshold = null;
		var hiddenNeurons = null;
		var outputNeurons = null;
		var synapses = null;
		
		var scope = {
			
			init: function() {
				
				//	Builds neuronal network
				inputNeurons = [];
				hiddenNeurons = [];
				outputNeurons = [];
				synapses = [];
				
				var z = 0;
				
				for ( var y=0; y<settings.hiddenNeuronNumber; y++ ) {
					hiddenNeurons[y] = new Neuron();
				}
				for ( var y=0; y<settings.outputNeuronNumber; y++ ) {
					outputNeurons[y] = new Neuron();
				}
				for ( var i=0; i<settings.inputNeuronNumber; i++ ) {
					inputNeurons[i] = new Neuron();
					for ( var y=0; y<settings.hiddenNeuronNumber; y++ ) {
						synapses[z] = new Synapse();
						synapses[z].weight = 0.0;
						inputNeurons[i].addToDendrites(synapses[z]);
						hiddenNeurons[y].addToAxons(synapses[z]);
						z++;
					}
				}
				//	Last input is the threshold 'cause inputNeuronNumber has been increment in constructor
				if ( settings.inputNeuronNumber > 0 ) {
					threshold = inputNeurons[settings.inputNeuronNumber-1];
				}
				for ( var i=0; i<settings.hiddenNeuronNumber; i++ ) {
					for ( var y=0; y<settings.outputNeuronNumber; y++ ) {
						synapses[z] = new Synapse();
						synapses[z].weight = 0.0;
						hiddenNeurons[i].addToDendrites(synapses[z]);
						outputNeurons[y].addToAxons(synapses[z]);
						z++;
					}
				}
			},
			
			getInputNeurons: function() {
			
				return inputNeurons;
			},
			
			getOutputNeurons: function() {
			
				return outputNeurons;
			},
			
			getSynapses: function() {
				
				return synapses;
			},
			
			setSynapses: function(synapses) {
				
				return synapses;
			},
			
			activate: function() {
				
				threshold.forceOutput(-1);
				
				//	Calculate hidden neurons's output
				z = 0;
				for ( var i=0, lenI=hiddenNeurons.length; i<lenI; i++ ) {
					var axons = hiddenNeurons[i].axons;
					var activation = 0;
					for ( var y=0, lenY=axons.length; y < lenY; y++ ) {
						activation += axons[y].weight*axons[y].dendrite.output;
						z++;
					}
					hiddenNeurons[i].output = activation;
				}
				
				//	Calculate output neurons's output
				z = 0;
				for ( var i=0, lenI=outputNeurons.length; i<lenI; i++ ) {
					var axons = outputNeurons[i].axons;
					var activation = 0;
					for ( var y=0, lenY=axons.length; y < lenY; y++ ) {
						activation += axons[y].weight*axons[y].dendrite.output;
						z++;
					}
					outputNeurons[i].output = a.sigmoid(activation);
				}
			},

			deleteInner: function() {
				
				for (var i, len=synapses.length; i<len; i++) {
					synapses[i].deleteInner();
					synapses[i] = null;
				}
				for (var i, len=inputNeurons.length; i<len; i++) {
					inputNeurons[i].deleteInner();
					inputNeurons[i] = null;
				}
				for (var i, len=hiddenNeurons.length; i<len; i++) {
					hiddenNeurons[i].deleteInner();
					hiddenNeurons[i] = null;
				}
				for (var i, len=outputNeurons.length; i<len; i++) {
					outputNeurons[i].deleteInner();
					outputNeurons[i] = null;
				}
			}
		}
		return scope;
	}
	
})(jQuery, artificial);
