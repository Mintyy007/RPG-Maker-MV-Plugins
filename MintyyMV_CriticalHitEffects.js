//----------------------------------------------------------------------------------
// MintyyMV_CriticalHitEffects.js
// Author: Mintyy
//----------------------------------------------------------------------------------
/*:
* @plugindesc v1.0 Creates a flash or plays an SE when a critical hit is inflicted.
* @author Mintyy
*
* @help

Critical Hit Effects
A plugin coded by Mintyy

This plugin does not have any plugin commands.

You can use this for your commercial / non commercial or IGMC games
as long as Mintyy is credited.

* @param -- FLASH SETTINGS --
*
* @param Actor Flash Color
* @desc An array that contains the flash color for enemy. [R, G, B, Opacity]
* @default 255, 0, 0, 128
*
* @param Actor Flash Duration
* @desc The duration of the flash for actor.
* @default 8
*
* @param Enemy Flash Color
* @desc An array that contains the flash color for enemy. [R, G, B, Opacity]
* @default 255, 0, 0, 128
*
* @param Enemy Flash Duration
* @desc The duration of the flash for enemy.
* @default 8
*
* @param -- SE SETTINGS --
*
* @param Actor Critical SE
* @desc The SE played when an actor inflicts a critical damage.
* @default Break
*
* @param Actor SE Volume
* @desc The volume of the SE for the actor.
* @default 100
*
* @param Actor SE Pitch
* @desc The pitch of the SE for the actor.
* @default 100
*
* @param Enemy Critical SE
* @desc The SE played when an enemy inflicts a critical damage.
* @default Break
*
* @param Enemy SE Volume
* @desc The volume of the SE for the enemy.
* @default 100
*
* @param Enemy SE Pitch
* @desc The pitch of the SE for the enemy.
* @default 100
*
*/
(function(){
    var MintyyMV = MintyyMV || {};
    MintyyMV.CriticalHitFlash = MintyyMV.CriticalHitFlash || {};
    MintyyMV.CriticalHitFlash.params = PluginManager.parameters('MintyyMV_CriticalHitEffects');
    MintyyMV.CriticalHitFlash.actorFlashColor = MintyyMV.CriticalHitFlash.params['Actor Flash Color'].split(/\s*,\s*/).filter(function(value) { return !!value; });
    MintyyMV.CriticalHitFlash.actorFlashDuration = Number(MintyyMV.CriticalHitFlash.params['Actor Flash Duration'] || 8);
    MintyyMV.CriticalHitFlash.enemyFlashColor = MintyyMV.CriticalHitFlash.params['Enemy Flash Color'].split(/\s*,\s*/).filter(function(value) { return !!value; });
    MintyyMV.CriticalHitFlash.enemyFlashDuration = Number(MintyyMV.CriticalHitFlash.params['Enemy Flash Duration'] || 8);

    MintyyMV.CriticalHitFlash.actorCriticalSE = String(MintyyMV.CriticalHitFlash.params['Actor Critical SE'] || 'Break');
    MintyyMV.CriticalHitFlash.actorCriticalVol = String(MintyyMV.CriticalHitFlash.params['Actor SE Volume'] || 100);
    MintyyMV.CriticalHitFlash.actorCriticalPitch = String(MintyyMV.CriticalHitFlash.params['Actor SE Pitch'] || 100);
    MintyyMV.CriticalHitFlash.enemyCriticalSE = String(MintyyMV.CriticalHitFlash.params['Enemy Critical SE'] || 'Break');
    MintyyMV.CriticalHitFlash.enemyCriticalVol = String(MintyyMV.CriticalHitFlash.params['Enemy SE Volume'] || 100);
    MintyyMV.CriticalHitFlash.enemyCriticalPitch = String(MintyyMV.CriticalHitFlash.params['Enemy SE Pitch'] || 100);    
    Game_Action.prototype.makeDamageValue = function(target, critical) {
        var item = this.item();
        var baseValue = this.evalDamageFormula(target);
        var value = baseValue * this.calcElementRate(target);
        if (this.isPhysical()) {
            value *= target.pdr;
        }
        if (this.isMagical()) {
            value *= target.mdr;
        }
        if (baseValue < 0) {
            value *= target.rec;
        }
        if (critical) {
            if (target instanceof Game_Enemy) {
                $gameScreen.criticalFlashForDamageActor();
                value = this.applyCritical(value);
            } else {
                $gameScreen.criticalFlashForDamageEnemy();
                value = this.applyCritical(value);
            }
            
        }
        value = this.applyVariance(value, item.damage.variance);
        value = this.applyGuard(value, target);
        value = Math.round(value);
        return value;
    };

    Game_Screen.prototype.criticalFlashForDamageActor = function() {
        var audio = {
            name: MintyyMV.CriticalHitFlash.actorCriticalSE,
            volume: MintyyMV.CriticalHitFlash.actorCriticalVol,
            pitch: MintyyMV.CriticalHitFlash.actorCriticalPitch,
            pan: 0
        };
        AudioManager.playSe(audio);
        var red = MintyyMV.CriticalHitFlash.actorFlashColor[0];
        var green = MintyyMV.CriticalHitFlash.actorFlashColor[1];
        var blue = MintyyMV.CriticalHitFlash.actorFlashColor[2];
        var alpha = MintyyMV.CriticalHitFlash.actorFlashColor[3];
        var duration = MintyyMV.CriticalHitFlash.actorFlashDuration;
        this.startFlash([Number(red), Number(green), Number(blue), Number(alpha)], MintyyMV.CriticalHitFlash.actorFlashDuration);
    };   
    Game_Screen.prototype.criticalFlashForDamageEnemy = function() {
        var audio = {
            name: MintyyMV.CriticalHitFlash.enemyCriticalSE,
            volume: MintyyMV.CriticalHitFlash.enemyCriticalVol,
            pitch: MintyyMV.CriticalHitFlash.enemyCriticalPitch,
            pan: 0
        };
        AudioManager.playSe(audio);        
        var red = MintyyMV.CriticalHitFlash.enemyFlashColor[0];
        var green = MintyyMV.CriticalHitFlash.enemyFlashColor[1];
        var blue = MintyyMV.CriticalHitFlash.enemyFlashColor[2];
        var alpha = MintyyMV.CriticalHitFlash.enemyFlashColor[3];
        var duration = MintyyMV.CriticalHitFlash.enemyFlashDuration;
        this.startFlash([Number(red), Number(green), Number(blue), Number(alpha)], MintyyMV.CriticalHitFlash.actorFlashDuration);
    };     
})();
