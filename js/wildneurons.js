/** 
 * Wild Neurons Class
 *
 * Keyword keys :
 *	F : enable/disable switch in speed mode
 *	left and down keys : slow speed mode
 *	right and top keys : accelerate speed mode
 *	P : pause/play
 *
 * @class
 * @version 0.4.2
 * @author Alexandre Keller
 * @since 2014
 */

/** @namespace */
var artificial = artificial || {};
 
(function($, a) {

	var settings = null;
	
	var world = null;
	var generationIndex = null;
	var generations = [];
	var roundIndex = null;
	var rounds = [];
	
	var interval = null;
	var intervalTime = null;
	
	var fastModeEnable = a.config.fastModeEnable;
	var fastSpeed = a.config.fastSpeed;
	var maxSpeed = a.config.maxSpeed;
	var minSpeed = a.config.minSpeed;
	var isPlaying = a.config.isPlaying;
	
	function init(settingsParam) {
	
		document.onkeydown = keyActivated;
		
		settings = $.extend({
			generationDuration: a.config.generationDuration,
			roundsNumberByGeneration: a.config.roundsNumberByGeneration,
			loopTime: a.config.loopTime
		}, settingsParam);
		
		world = new a.World();
		graphicCore = new a.GraphicCore();
		
		//	Actual generation
		newGeneration();
		
		//	Graphic Core
		graphicCore.init('neuronal_network', world);
		var UI = {
			fastSpeed: fastSpeed,
			isPlaying: isPlaying
		};
		graphicCore.updateUI(UI);
		graphicCore.draw();
		
		// set interval
		interval = setInterval(loop, settings.loopTime);
	}
	
	function keyActivated(keyEvent) {
	
		// --- IE explorer
		if ( window.event ) {
			keyEvent = window.event;
		}
		
		//	Which key ?
		var keyCode = keyEvent.keyCode;
		switch ( keyCode ) {
			case 38:
			case 39:
				accelerateFastSpeed();
				break;
			case 37:
			case 40:
				slowFastSpeed();
				break;
			case 70:
				switchFastMode();
				break;
			case 76:
				logGenomes();
				break;
			case 80:
				switchPausePlay();
				break;
		}
	}
	
	function slowFastSpeed() {
		
		fastSpeed = fastSpeed/2;
		if ( fastSpeed < minSpeed ) {
			fastSpeed = minSpeed;
		}
		var UI = { fastSpeed: fastSpeed};
		graphicCore.updateUI(UI);
	}
	
	function accelerateFastSpeed() {
		
		fastSpeed = fastSpeed*2;
		if ( fastSpeed > maxSpeed ) {
			fastSpeed = maxSpeed;
		}
		var UI = { fastSpeed: fastSpeed};
		graphicCore.updateUI(UI);
	}
	
	function switchFastMode() {
		
		fastModeEnable = !fastModeEnable;
		var UI = { fastMode: fastModeEnable};
		graphicCore.updateUI(UI);
	}
	
	function switchPausePlay() {
	
		isPlaying = isPlaying ? false : true;
		var UI = { isPlaying: isPlaying};
		graphicCore.updateUI(UI);
	}
	
	function logGenomes() {
		
		var squirrels = world.getSquirrels();
		for ( var w=0, len=squirrels.length; w<len; w++ ) {
		
			var synapses = squirrels[w].getNeuronalNetwork().getSynapses();
			var chaineGenome = "";
			for ( var s=0, lenS=synapses.length; s<lenS; s++ ) {
				if ( chaineGenome != '' ) {
					chaineGenome += ", ";
				}
				chaineGenome += synapses[s].weight;
			}
			console.log('squirrel['+w+']: '+chaineGenome);
		}
		
		var wolves = world.getWolves();
		for ( var w=0, len=wolves.length; w<len; w++ ) {
		
			var synapses = wolves[w].getNeuronalNetwork().getSynapses();
			var chaineGenome = "";
			for ( var s=0, lenS=synapses.length; s<lenS; s++ ) {
				if ( chaineGenome != '' ) {
					chaineGenome += ", ";
				}
				chaineGenome += synapses[s].weight;
			}
			console.log('wolf['+w+']: '+chaineGenome);
		}
	}
	
	function loop() {
		
		if ( isPlaying ) {
			if ( fastModeEnable ) {
				for ( var i=0; i<fastSpeed; i++ ) {
					subLoop();
				}
			}
			else {
				subLoop();
			}
		}
		graphicCore.draw();
	}
	
	function subLoop() {
	
		roundProgress();
		
		world.loop();
	}
	
	function stopLoop() {
	
		clearInterval(interval);
	}
	
	/**
	 *	Does generation duration expired ?
	 */
	function roundProgress() {
		
		duration = rounds[roundIndex].getDuration(settings.loopTime);
		var UI = { duration: duration};
		graphicCore.updateUI(UI);
		if ( settings.generationDuration <= Number(duration/1000) ) {
		
			newRound(false);
		}
	}
	
	function newGeneration() {
	
		if ( generationIndex == null ) {
			generationIndex = 0;
		}
		else {
			generations[generationIndex].end();
			generationIndex++;
			var UI = { generation: generationIndex};
			graphicCore.updateUI(UI);
			
			//	Free memory
			if ( generationIndex >= 2 ) {
				generations[generationIndex-2].deleteInner();
				generations[0] = null;
			}
		}
		generations[generationIndex] = new a.Generation();
		generations[generationIndex].start();
		newRound(true);
	}
	
	function newRound(restartGeneration) {
		
		if ( !restartGeneration ) {
			storeRoundGenomes();
			//	previous round is ending now
			rounds[roundIndex].end(0);
			roundIndex++;
		}
		else {
			//	First generation round
			roundIndex = 0;
			rounds = [];
		}
		
		if ( roundIndex < settings.roundsNumberByGeneration ) {
		
			//	A new round is instanciate for the same generation
			rounds[roundIndex] = new a.Round();
			rounds[roundIndex].start();
			
			//	UI update
			var UI = { round: roundIndex};
			graphicCore.updateUI(UI);
			
			//	World initializing
			world.init();
			buildRoundGenomes();
		}
		else {
			//	This generation is over, a new one start
			newGeneration();
		}
	}
	
	/**
	 *	Update last generation genome
	 */
	function storeRoundGenomes() {
	
		var squirrelGenome = generations[generationIndex].getLastSquirrelGenome();
		var squirrels = world.getSquirrels();
		
		squirrelGenome.nbNutsStored = squirrels[0].getNbNutsStored();
		squirrelGenome.nbDeath = squirrels[0].getNbDie();
		squirrelGenome.nutHolded = squirrels[0].isHoldingANut(); 
		
		var wolvesGenomes = generations[generationIndex].getWolfGenomes();
		var wolves = world.getWolves();
		for ( var w=0, len=wolves.length; w<len; w++ ) {
		
			wolvesGenomes[wolves.length-1-w].nbFeast = wolves[w].getNbFeast();
			wolvesGenomes[wolves.length-1-w].nbPackFeast = wolves[w].getNbPackFeast();
		}
	}
	
	/**
	 *	Update last generation genome
	 */
	function buildRoundGenomes() {
		
		var squirrelGenome = new SquirrelGenome();
		var wolfGenomes = [];
		for ( i=0, len=a.config.wolvesNumber; i<len; i++ ) {
			wolfGenomes[i] = new WolfGenome();
		}
		
		if ( generationIndex == 0 ) {
		
			//	Genome is build radomly
			var synapses = world.getSquirrels()[0].getNeuronalNetwork().getSynapses();
			squirrelGenome.chromosomes = [];
			for ( var i=0, len=synapses.length; i<len; i++ ) {
				squirrelGenome.chromosomes[i] = (Math.floor(Math.random()*20001)-10000)/10000;
				synapses[i].weight = squirrelGenome.chromosomes[i];
			}
			
			for ( var w=0, lenW=wolfGenomes.length; w<lenW; w++ ) {
				
				var synapses = world.getWolves()[w].getNeuronalNetwork().getSynapses();
				wolfGenomes[w].chromosomes = [];
				for ( var y=0, lenY=synapses.length; y<lenY; y++ ) {
					wolfGenomes[w].chromosomes[y] = (Math.floor(Math.random()*20001)-10000)/10000;
					synapses[y].weight = wolfGenomes[w].chromosomes[y];
				}
			}
		}
		else {
			
			//	Genome is improved
			var synapses = world.getSquirrels()[0].getNeuronalNetwork().getSynapses();
			squirrelGenome.chromosomes = generations[generationIndex-1].squirrelCrossOver(synapses);
			
			for ( var w=0, len=wolfGenomes.length; w<len; w++ ) {
			
				var synapses = world.getWolves()[w].getNeuronalNetwork().getSynapses();
				wolfGenomes[w].chromosomes = generations[generationIndex-1].wolfCrossOver(synapses);
			}
		}
		
		generations[generationIndex].putSquirrelGenome(squirrelGenome);
		for ( var i=0, len=wolfGenomes.length; i<len; i++ ) {
			generations[generationIndex].putWolfGenome(wolfGenomes[i]);
		}
	}
	
	init();
	
})(jQuery, artificial);
