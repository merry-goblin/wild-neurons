/** 
 * artificial/Generation Class
 *
 * Store & provide a genome modification
 *
 * @class
 * @author Alexandre Keller
 * @since 2014
 */

/** @namespace */
var artificial = artificial || {};

(function($, a) {

	a.Generation = function(settings) {
	
		/*** Private properties ***/
		var settings = $.extend({
			mutationRate: a.config.mutationRate
		}, settings);
		var score = 0;
		var isCurrent = false;
		
		var squirrelGenomes = [];
		var wolfGenomes = [];
		
		//	Used to calculate squirrel genetic scores
		var squirrelGeneticValues = {
			nbMinNutsStored: 999,
			nbMaxNutsStored: 0,
			averageNutsStored: 0,
			nbMinDeath: 999,
			nbMaxDeath: 0,
			averageDeath: 0,
			totalScoreGenomes: 0
		};
		
		//	Used to calculate wolf genetic scores
		var wolfGeneticValues = {
			nbMinFeast: 999,
			nbMaxFeast: 0,
			averageFeast: 0,
			nbMinPackFeast: 999,
			nbMaxPackFeast: 0,
			averagePackFeast: 0,
			totalScoreGenomes: 0
		};

		/**
		 *  Even the worse genome can't have less than 1 point
		 *  A bonus can be multiplied by another if conditions are validate
		 *
		 *		Squirrel                         | Bonus
		 *      ----------------------------------------------
		 *      default                          | (+)1pt
		 *      nut holded                       | (+)1pt
		 *      nuts stored                      | (+)5pt/nut
		 *      min nb nuts stored               | (*)0.5
		 *      nb nuts stored < average         | (*)0.5
		 *      nb nuts stored = average         | (*)1
		 *      nb nuts stored > average         | (*)2
		 *      max nb nuts stored               | (*)2
		 *      nb eaten = max                   | (*)0.25
		 *      nb eaten > average               | (*)0.5
		 *      nb eaten = average               | (*)1
		 *      nb eaten < average               | (*)2
		 *      nb eaten = min                   | (*)2
		 *
		 */
		function calculateSquirrelGeneticScores() {
		
			var totalNutsStored = 0;
			var totalDeath = 0;
			
			for ( var i=0, len=squirrelGenomes.length; i<len; i++ ) {
				totalNutsStored += squirrelGenomes[i].nbNutsStored;
				totalDeath += squirrelGenomes[i].nbDeath;
				
				if ( squirrelGenomes[i].nbNutsStored < squirrelGeneticValues.nbMinNutsStored ) {
					squirrelGeneticValues.nbMinNutsStored = squirrelGenomes[i].nbNutsStored;
				}
				if ( squirrelGenomes[i].nbNutsStored > squirrelGeneticValues.nbMaxNutsStored ) {
					squirrelGeneticValues.nbMaxNutsStored = squirrelGenomes[i].nbNutsStored;
				}
				
				if ( squirrelGenomes[i].nbDeath < squirrelGeneticValues.nbMinDeath ) {
					squirrelGeneticValues.nbMinDeath = squirrelGenomes[i].nbDeath;
				}
				if ( squirrelGenomes[i].nbDeath > squirrelGeneticValues.nbMaxDeath ) {
					squirrelGeneticValues.nbMaxDeath = squirrelGenomes[i].nbDeath;
				}
			}
			
			squirrelGeneticValues.averageNutsStored = Math.round(totalNutsStored/squirrelGenomes.length);
			squirrelGeneticValues.averageDeath = Math.round(totalDeath/squirrelGenomes.length);
			
			for ( var i=0, len=squirrelGenomes.length; i<len; i++ ) {
				
				var nutsBonus = 1;
				var totalScore;
				var nutsScore;
				
				// default
				totalScore = 1;
				
				// nut holded
				totalScore += squirrelGenomes[i].nutHolded;
				
				// nuts stored
				nutsScore = 5*squirrelGenomes[i].nbNutsStored;
				
				// min nb nuts stored
				if ( squirrelGenomes[i].nbNutsStored == squirrelGeneticValues.nbMinNutsStored ) {
					nutsBonus = nutsBonus*0.5;
				}
				
				// nb nuts stored < average
				if ( squirrelGenomes[i].nbNutsStored < squirrelGeneticValues.averageNutsStored ) {
					nutsBonus = nutsBonus*0.5;
				}
				
				// nb nuts stored = average
				if ( squirrelGenomes[i].nbNutsStored == squirrelGeneticValues.averageNutsStored ) {
					nutsBonus = nutsBonus*1;
				}
				
				// nb nuts stored > average
				if ( squirrelGenomes[i].nbNutsStored > squirrelGeneticValues.averageNutsStored ) {
					nutsBonus = nutsBonus*2;
				}
				
				// max nb nuts stored
				if ( squirrelGenomes[i].nbNutsStored == squirrelGeneticValues.nbMaxNutsStored ) {
					nutsBonus = nutsBonus*2;
				}
				
				// nb eaten = max
				if ( squirrelGenomes[i].nbDeath == squirrelGeneticValues.nbMaxDeath ) {
					nutsBonus = nutsBonus*0.25;
				}
				
				// nb eaten > average
				if ( squirrelGenomes[i].nbDeath > squirrelGeneticValues.averageDeath ) {
					nutsBonus = nutsBonus*0.5;
				}
				
				// nb eaten = average
				if ( squirrelGenomes[i].nbDeath == squirrelGeneticValues.averageDeath ) {
					nutsBonus = nutsBonus*1;
				}
				
				// nb eaten < average
				if ( squirrelGenomes[i].nbDeath < squirrelGeneticValues.averageDeath ) {
					nutsBonus = nutsBonus*2;
				}
				
				// nb eaten = min
				if ( squirrelGenomes[i].nbDeath == squirrelGeneticValues.nbMinDeath ) {
					nutsBonus = nutsBonus*2;
				}
				
				totalScore += (nutsScore*nutsBonus);
				totalScore = Math.round(totalScore);
				if ( totalScore < 1 ) {
					totalScore = 1;
				}
				
				squirrelGenomes[i].score = totalScore;
				squirrelGeneticValues.totalScoreGenomes += totalScore;
			}
		}
		
		/**
		 *  Even the worse genome can't have less than 1 point
		 *  A bonus can be multiplied by another if conditions are validate
		 *
		 *		Wolf                             | Bonus
		 *      ----------------------------------------------
		 *      default                          | (+)1pt
		 *      feast                            | (+)2pt/feast
		 *      pack feast                       | (+)2pt/pack feast
		 *      nb feast = min                   | (*)0.5
		 *      nb feast < average               | (*)0.5
		 *      nb feast = average               | (*)1
		 *      nb feast > average               | (*)2
		 *      nb feast = max                   | (*)2
		 *      nb pack feast = min              | (*)0.5
		 *      nb pack feast < average          | (*)0.5
		 *      nb pack feast = average          | (*)1
		 *      nb pack feast > average          | (*)2
		 *      nb pack feast = max              | (*)2
		 *
		 */
		function calculateWolfGeneticScores() {
			
			var totalFeast = 0;
			var totalPackFeast = 0;
			
			for ( var i=0, len=wolfGenomes.length; i<len; i++ ) {
				totalFeast += wolfGenomes[i].nbFeast;
				totalPackFeast += wolfGenomes[i].nbPackFeast;
				
				if ( wolfGenomes[i].nbFeast < wolfGeneticValues.nbMinFeast ) {
					wolfGeneticValues.nbMinFeast = wolfGenomes[i].nbFeast;
				}
				if ( wolfGenomes[i].nbFeast > wolfGeneticValues.nbMaxFeast ) {
					wolfGeneticValues.nbMaxFeast = wolfGenomes[i].nbFeast;
				}
				
				if ( wolfGenomes[i].nbPackFeast < wolfGeneticValues.nbMinPackFeast ) {
					wolfGeneticValues.nbMinPackFeast = wolfGenomes[i].nbPackFeast;
				}
				if ( wolfGenomes[i].nbPackFeast > wolfGeneticValues.nbMaxPackFeast ) {
					wolfGeneticValues.nbMaxPackFeast = wolfGenomes[i].nbPackFeast;
				}
			}
			
			wolfGeneticValues.averageFeast = Math.round(totalFeast/wolfGenomes.length);
			wolfGeneticValues.averagePackFeast = Math.round(totalPackFeast/wolfGenomes.length);
			
			for ( var i=0, len=wolfGenomes.length; i<len; i++ ) {
				
				var feastBonus = 1;
				var packFeastBonus = 0;
				var totalScore;
				var feastScore;
				var packFeastScore;
				
				// default
				totalScore = 1;
				
				// feast
				feastScore = 2*wolfGenomes[i].nbFeast;
				
				// pack feast
				packFeastScore = 2*wolfGenomes[i].nbPackFeast;
				
				// nb feast = min
				if ( wolfGenomes[i].nbFeast == wolfGeneticValues.nbMinFast ) {
					feastBonus = feastBonus*0.5;
				}
				
				// nb feast < average
				if ( wolfGenomes[i].nbFeast < wolfGeneticValues.averageFeast ) {
					feastBonus = feastBonus*0.5;
				}
				
				// nb feast = average
				if ( wolfGenomes[i].nbFeast == wolfGeneticValues.averageFeast ) {
					feastBonus = feastBonus*1;
				}
				
				// nb feast > average
				if ( wolfGenomes[i].nbFeast > wolfGeneticValues.averageFeast ) {
					feastBonus = feastBonus*2;
				}
				
				// nb feast = max
				if ( wolfGenomes[i].nbFeast == wolfGeneticValues.nbMaxFeast ) {
					feastBonus = feastBonus*2;
				}
				
				// nb pack feast = min
				if ( wolfGenomes[i].nbPackFeast == wolfGeneticValues.nbMinPackFast ) {
					packFeastBonus = packFeastBonus*0.5;
				}
				
				// nb pack feast < average
				if ( wolfGenomes[i].nbPackFeast < wolfGeneticValues.averagePackFeast ) {
					packFeastBonus = packFeastBonus*0.5;
				}
				
				// nb pack feast = average
				if ( wolfGenomes[i].nbPackFeast == wolfGeneticValues.averagePackFeast ) {
					packFeastBonus = packFeastBonus*1;
				}
				
				// nb pack feast > average
				if ( wolfGenomes[i].nbPackFeast > wolfGeneticValues.averagePackFeast ) {
					packFeastBonus = packFeastBonus*2;
				}
				
				// nb pack feast = max
				if ( wolfGenomes[i].nbPackFeast == wolfGeneticValues.nbMaxPackFeast ) {
					packFeastBonus = packFeastBonus*2;
				}
				
				feastScore = feastBonus*feastScore;
				packFeastScore = packFeastBonus*packFeastScore;
				
				totalScore += feastScore+packFeastScore;
				totalScore = Math.round(totalScore);
				if ( totalScore < 1 ) {
					totalScore = 1;
				}
				
				wolfGenomes[i].score = totalScore;
				wolfGeneticValues.totalScoreGenomes += totalScore;
			}
		}
		
		var scope = {
			
			start: function() {
			
				isCurrent = true;
			},
			
			end: function() {
			
				isCurrent = false;
				calculateSquirrelGeneticScores();
				calculateWolfGeneticScores();
			},
			
			getScore: function() {
				
				return score;
			},
			
			addScore: function(scoreParam) {
			
				score += scoreParam;
			},
			
			getIsCurrent: function() {
			
				return isCurrent;
			},
			
			putSquirrelGenome: function(squirrelGenomeParam) {
			
				squirrelGenomes[squirrelGenomes.length] = squirrelGenomeParam;
			},
			
			getSquirrelGenomes: function() {
			
				return squirrelGenomes;
			},
			
			getLastSquirrelGenome: function() {
			
				return squirrelGenomes[squirrelGenomes.length-1];
			},
			
			putWolfGenome: function(wolfGenomeParam) {
			
				wolfGenomes[wolfGenomes.length] = wolfGenomeParam;
			},
			
			getWolfGenomes: function() {
			
				return wolfGenomes;
			},
			
			selectSquirrelGenomeByRouletteWheel: function() {
			
				var alea = a.getRandomInteger(0, squirrelGeneticValues.totalScoreGenomes-1);
				
				currentScore = 0;
				for ( var i=0, len=squirrelGenomes.length; i<len; i++ ) {
					currentScore += squirrelGenomes[i].score;
					if ( currentScore > alea ) {
						return squirrelGenomes[i];
					}
				}
				return false;
			},
			
			selectWolfGenomeByRouletteWheel: function() {
			
				var alea = a.getRandomInteger(0, wolfGeneticValues.totalScoreGenomes-1);
				
				currentScore = 0;
				for ( var i=0, len=wolfGenomes.length; i<len; i++ ) {
					currentScore += wolfGenomes[i].score;
					if ( currentScore > alea ) {
						return wolfGenomes[i];
					}
				}
				return false;
			},
			
			squirrelCrossOver: function(child) {
				
				var mother = this.selectSquirrelGenomeByRouletteWheel();
				var father = this.selectSquirrelGenomeByRouletteWheel();
				
				var j=0;
				var max=5;
				while ( mother == father && j < max ) {
					// Another chance to not mate the same genome with himself
					j++;
					father = this.selectSquirrelGenomeByRouletteWheel();
				}
				
				var len = child.length;
				var alea = a.getRandomInteger(1, len-1);
				
				var childChromosomes = [];
				
				for ( var i=0; i<alea; i++ ) {
					child[i].weight = Math.floor(this.applyMutation(mother.chromosomes[i])*1000)/1000;
					childChromosomes[i] = child[i].weight;
				}
				for ( var i=alea; i<len; i++ ) {
					child[i].weight = Math.floor(this.applyMutation(father.chromosomes[i])*1000)/1000;
					childChromosomes[i] = child[i].weight;
				}
				
				return childChromosomes;
			},
			
			wolfCrossOver: function(child) {
				
				var mother = this.selectWolfGenomeByRouletteWheel();
				var father = this.selectWolfGenomeByRouletteWheel();
				
				var j=0;
				var max=3;
				while ( mother == father && j < max ) {
					// Another chance to not mate the same genome with himself
					j++;
					father = this.selectWolfGenomeByRouletteWheel();
				}
				
				var len = child.length;
				var alea = a.getRandomInteger(1, len-1);
				
				var childChromosomes = [];
				
				for ( var i=0; i<alea; i++ ) {
					child[i].weight = Math.floor(this.applyMutation(mother.chromosomes[i])*1000)/1000;
					if ( child[i].weight > 1 ) {
						child[i].weight -= 1;
					}
					else if ( child[i].weight < -1 ) {
						child[i].weight += 1;
					}
					childChromosomes[i] = child[i].weight;
				}
				for ( var i=alea; i<len; i++ ) {
					child[i].weight = Math.floor(this.applyMutation(father.chromosomes[i])*1000)/1000;
					childChromosomes[i] = child[i].weight;
				}
				
				return childChromosomes;
			},
			
			applyMutation: function(weight) {
				
				var alea = a.getRandomFloat(0, 1, 4);
				if ( alea < settings.mutationRate ) {
					weight += a.getRandomFloat(-0.5, 0.5, 4);
				}
				
				return weight;
			},
			
			deleteInner: function() {
				
				for ( var i=0, len=squirrelGenomes.length; i<len; i++ ) {
					squirrelGenomes[i].deleteInner();
					squirrelGenomes[i] = null;
				}
				squirrelGenomes = null;
				for ( var i=0, len=wolfGenomes.length; i<len; i++ ) {
					wolfGenomes[i].deleteInner();
					wolfGenomes[i] = null;
				}
				wolfGenomes = null;
				
				squirrelGeneticScores = null;
				squirrelGeneticValues = null;
				
				wolfGeneticScores = null;
				wolfGeneticValues = null;
			}
		}
		return scope;
	}
	
})(jQuery, artificial);
