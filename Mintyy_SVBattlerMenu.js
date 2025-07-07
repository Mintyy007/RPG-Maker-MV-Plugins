// -----------------------------------------------------------------------
// Mintyy_MV SV_Battler Menu.js
// -----------------------------------------------------------------------
/*:
 * @plugindesc v1.0 Uses SV_Battlers instead of faces in the Menu.
 * @author Mintyy Works Rosetta
 *
 * @param SV_Classic
 * @desc The SV_Battler is shown together with the face of the actor in the Menu Status Window.
 * @default true
 *
 * @param SV XOffset
 * @desc The x offset / axis of the battler when SV_Classic is false.
 * @default 73
 *
 * @param SV YOffset
 * @desc The y offset / axis of the battler added to the padding when SV_Classic is false.
 * @default 120
 *
 * @param Movement Timer
 * @desc This parameter sets the breath timer of each actor when it is refreshed in movement.
 * @default 20
 *
 * @param Timer Speed
 * @desc This parameter sets the breath timer speed of each battler.
 * @default 1
 *
*/
(function(){
	var Mintyy_MV = Mintyy_MV || {};
	var parametersZ = PluginManager.parameters('Mintyy_SVBattlerMenu');
	Mintyy_MV.SV_BattlerMenu = Mintyy_MV.SV_BattlerMenu || {};

	Mintyy_MV.SV_BattlerMenu.mode = parametersZ['SV_Classic'] === 'true' ? true : false;
	Mintyy_MV.SV_BattlerMenu.xOffset = Number(parametersZ['SV XOffset'] || 73);
	Mintyy_MV.SV_BattlerMenu.yOffset = Number(parametersZ['SV YOffset'] || 120);
	Mintyy_MV.SV_BattlerMenu.timer = Number(parametersZ['Movement Timer'] || 20);
	Mintyy_MV.SV_BattlerMenu.timerSpeed = Number(parametersZ['Timer Speed'] || 1);

    Window_MenuStatus.prototype.drawActorFace = function(actor, x, y, width, height) {
    	// if double is used, then derive the faces as well.
    	if (Mintyy_MV.SV_BattlerMenu.mode) {
    		Window_Base.prototype.drawActorFace.call(this,actor,x,y,width,height);
    	}
        var img = ImageManager.loadSvActor(actor._battlerName,0);
        var xIndex = this.breathAction();
        var yIndex = 0;
        var pw = img.width/9;
        var ph = img.height/6;
        var sx = xIndex * pw;
        var sy = yIndex * ph;
        if (Mintyy_MV.SV_BattlerMenu.mode) {
        	this.contents.blt(img, sx, sy, pw, ph, x+(width-pw)/2, y+(height-ph));
        } else {
        	this.contents.blt(img, sx, sy, pw, ph, Mintyy_MV.SV_BattlerMenu.xOffset, y+(height-Mintyy_MV.SV_BattlerMenu.yOffset));
        }
    };
    

    // this makes the breathing animation check the timer. This will animate the static battlers created during start.
    Window_MenuStatus.prototype.update = function() {
       Window_Selectable.prototype.update.call(this);
       if(this._breathTimer === undefined)
        this._breathTimer = 0;
       this._breathTimer = this._breathTimer += Mintyy_MV.SV_BattlerMenu.timerSpeed;
       if(this._breathTimer > Mintyy_MV.SV_BattlerMenu.timer){
        this._breathTimer = 0;
        if(this._breathAction === undefined)
        this._breathAction = 1;
        else
        this._breathAction = (this._breathAction + 1) % 4;
        this.refresh();
       }

    };

     
    Window_MenuStatus.prototype.breathAction = function(){
    	if (this._breathAction === undefined) {
    		return 0;
    	} else if (this._breathAction === 3){
    		return 1;
    	} else {
    		return this._breathAction;
    	}
    }	
})();