// -------------------------------------------------------------------------------------------------------
// MintyyMV Confusion Fix.js
// Author: Mintyy
// -------------------------------------------------------------------------------------------------------
/*:
* @plugindesc v1.0 Changes the monotonous Confusion State to different actions for Actors and Enemies.
* @author Mintyy
*
* @param Confusion Skills
* @desc Skills randomly activated when an actor or enemy is confused. (SKILL ID)
* @default 1, 2, 6, 7
*
* @param Wait Skill
* @desc The skill ID that you use for the Wait Skill
* @default 7
*/
(function(){
	var MintyyMV = MintyyMV || {};
	var params = PluginManager.parameters('MintyyMV_ConfusionFix');
	MintyyMV.ConfusionFix = MintyyMV.ConfusionFix || {};
	MintyyMV.ConfusionFix.confuseAction = params['Confusion Skills'].split(/\s*,\s*/).filter(function(value) { return !!value; });
	MintyyMV.ConfusionFix.waitSkill = Number(params['Wait Skill'] || 7);

	Game_Action.prototype.setConfusion = function() {
		var confuseAction = Math.randomInt(4)+1;
		switch(confuseAction) {
			case 1: //use attack
				this.setAttack();
				break;
			case 2: // use guard
				this.setGuard();
				break;
			case 3: // Wait (7)
				this.setSkill(MintyyMV.ConfusionFix.waitSkill);
				break;
			case 4: //Random Skill
				var setskill = Number(MintyyMV.ConfusionFix.confuseAction[Math.randomInt(MintyyMV.ConfusionFix.confuseAction.length)]);
				this.setSkill(setskill);
				break;
		}
	};
})();