
/** @namespace */
var artificial = artificial || {};

artificial.config = {
	//	General
	"fastModeEnable": false,
	"fastSpeed": "2048",
	"maxSpeed": "8192",
	"minSpeed": "2",
	"isPlaying": false,
	"generationDuration": 90,
	"roundsNumberByGeneration": 102,
	"loopTime": 20,
	
	//	World
	"worldWidth": 2300,
	"worldHeight": 1800,
	"safeZoneRadius": 80,
	"wolvesMinRadius": 250,
	"wolvesMaxRadius": 600,
	"nutsMinRadius": 300,
	"nutsMaxRadius": 650,
	"worldZoneRadius": 860,
	"nutsNumber": 10,
	"squirrelsNumber": 1, // Don't change this value, not handled
	"wolvesNumber": 1,    // You can change this one
	
	//	Squirrel
	"squirrelInputNeuronNumber": 8,
	"squirrelHiddenNeuronNumber": 9,
	"squirrelOutputNeuronNumber": 2,
	"squirrelMaxRotation": 0.1,
	"squirrelSpeed": 2,
	
	//	Wolf
	"wolfInputNeuronNumber": 4,
	"wolfHiddenNeuronNumber": 9,
	"wolfOutputNeuronNumber": 2,
	"wolfMaxRotation": 0.1,
	"wolfSpeed": 5,
	
	//	Generation
	"mutationRate": 0.01
}