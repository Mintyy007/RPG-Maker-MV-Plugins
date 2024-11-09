// MintyyMV_ActorDeathGameover.js

/*:
* @plugindesc v1.0 Forces Gameover when a specific flagged actor is dead.
* @author Mintyy - mintyworks.itch.io
*
@help

MintyyMV_ActorDeathGameover.js
author: Mintyy

Date Created: 9:03AM, Monday, July 4, 2016

Description:
Create another difficulty condition in your game by flagging your actors
that if they die, then the game takes you quickly to gameover. This can
be actors that you think are very important to the game or that they
should die for the certain part of the quest. This plugin allows you
to flag an actor and force gameover upon their death.

Instructions:

Using this plugin is fairly simple. All you need to do is to
place the tag <gameover_on_death> on the actor's note box.

*/
var Imported = Imported || {};
Imported.MintyyMV_ActorDeathGameover = true;

var Mintyy = Mintyy || {};
Mintyy.ADG = Mintyy.ADG || {};

(function($){
	BattleManager.checkBattleEnd = function() {
	    if (this._phase) {
	        if (this.checkAbort()) {
	            return true;
	        } else if ($gameParty.isAllDead()) {
	            this.processDefeat();
	            return true;
	        } else if ($gameTroop.isAllDead()) {
	            this.processVictory();
	            return true;
	        }
	    }
	    return false;
		if(this.isFlaggedActorDead()) return SceneManager.push(Scene_Gameover);
	};

	BattleManager.isFlaggedActorDead = function() {
		for (var i = 0; i < $gameParty.battleMembers().length; i++) {
			if ($dataActors[$gameParty.battleMembers()[i]._actorId].note.match(/<gameover_on_death>/i) && $gameParty.battleMembers()[i].isStateAffected(Game_Battler.prototype.deathStateId())) {
				return true;
			}
		}
		return false;
	};	
})();
