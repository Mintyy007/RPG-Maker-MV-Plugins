/*:
* @plugindesc v1.0 Creates a bonus level or a New Game Plus.
* @author Mintyy - mintyyworks.itch.io
*
* @help

Mintyy New Game Plus Plugin for RPG Maker MV

Description: This plugin allows you to create a bonus level or a new game plus,
depending on a situation created by the developer, triggered with events.

Q: What should I write as values on AutoShowOnScreen?
A: Should only be true or false. True means it is going to show the command
even if the switch that allows the game plus to be on is not turned on yet.
Write false if its going to be only showed when it is achieved.

Q: Where can I locate the x and y of the map where I want to be
transfered?
A: You can find it on the lower panel of your engine when you are in that map.
The two numbers after the viewpoint (%) and the Event Number are the x and y
of your map.

Q: What are the commands to set and deactivate the new game plus?
To set it, do this on a script call:
this.activateNewGamePlus();

To deactivate it, do this on a script call:
this.deactivateNewGamePlus();


* @param AutoShowOnScreen
* @desc New Game Plus Command options - true: shows the command, false: shows only when available.
* @default false
*
* @param NewGamePlusText
* @desc New Game Plus Command Text
* @default New Game +
* 
* @param NGMapNumber
* @desc Which id of the map do you want to be transferred when New Game Plus is selected?
* @default 2
* 
* @param MapX
* @desc Which x pos of the map do you want to be transferred when New Game Plus is selected?
* @default 0
* 
* @param MapY
* @desc Which y pos of the map do you want to be transferred when New Game Plus is selected?
* @default 0
* 
* @param MapFadeStyle
* @desc 0: Retain, 1: Down, 2: Left, 3: Right, 4: Up
* @default 0
*/
(function(){
    var Imported = Imported || {};
    Imported.NewGamePlus = true;
    var Mintyy = Mintyy || {};
    Mintyy.NewGamePlus = {};
    Mintyy.NewGamePlus.params = PluginManager.parameters('MintyyMV_NewGamePlus');   
    Mintyy.NewGamePlus.showCommand = String(Mintyy.NewGamePlus.params['AutoShowOnScreen'] || 'false');
    Mintyy.NewGamePlus.commandName = String(Mintyy.NewGamePlus.params['NewGamePlusText'] || 'New Game +');
    Mintyy.NewGamePlus.mapNumber = Number(Mintyy.NewGamePlus.params['NGMapNumber'] || 2);
    Mintyy.NewGamePlus.mapX = Number(Mintyy.NewGamePlus.params['MapX'] || 0);
    Mintyy.NewGamePlus.mapY = Number(Mintyy.NewGamePlus.params['MapY'] || 0);
    Mintyy.NewGamePlus.mapFadeStyle = Number(Mintyy.NewGamePlus.params['MapFadeStyle'] || 0);
    Mintyy.NewGamePlus.systemInitialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function(){
        Mintyy.NewGamePlus.systemInitialize.call(this);
        this._newGamePlus = false;
    }
    
    Game_System.prototype.activateNewGamePlus = function(){
        this._newGamePlus = true;
    }
    
    Game_System.prototype.deactivateNewGamePlus = function(){
        this._newGamePlus = false;
    }
    
    Game_Interpreter.prototype.activateNewGamePlus = function(){
        $gameSystem.activateNewGamePlus();
    }
    
    Game_Interpreter.prototype.deactivateNewGamePlus = function(){
        $gameSystem.deactivateNewGamePlus();
    }
    
    Window_TitleCommand.prototype.makeCommandList = function() {
        this.addCommand(TextManager.newGame,   'newGame');
        this.addCommand(TextManager.continue_, 'continue', this.isContinueEnabled());
        if (Mintyy.NewGamePlus.showCommand === 'true') {
            this.addCommand(Mintyy.NewGamePlus.commandName,   'newgameplus', this.isNewGamePlusEnabled());
        } else if (Mintyy.NewGamePlus.showCommand === 'false') {
            if (this.isNewGamePlusEnabled()) {
                this.addCommand(Mintyy.NewGamePlus.commandName,   'newgameplus',this.isNewGamePlusEnabled());
            }
        }
        this.addCommand(TextManager.options,   'options');
    };    
    Window_TitleCommand.prototype.isNewGamePlusEnabled = function() {
        return $gameSystem._newGamePlus;
    };    
    
    Scene_Title.prototype.createCommandWindow = function() {
        this._commandWindow = new Window_TitleCommand();
        this._commandWindow.setHandler('newGame',  this.commandNewGame.bind(this));
        this._commandWindow.setHandler('newgameplus', this.commandNewGamePlus.bind(this));
        this._commandWindow.setHandler('continue', this.commandContinue.bind(this));
        this._commandWindow.setHandler('options',  this.commandOptions.bind(this));
        this.addWindow(this._commandWindow);
    };

    Scene_Title.prototype.commandNewGamePlus = function() {
        this._commandWindow.close();
        this.fadeOutAll();
        $gamePlayer.reserveTransfer(2, Mintyy.NewGamePlus.mapX, Mintyy.NewGamePlus.mapY, 0, Mintyy.NewGamePlus.mapFadeStyle);
        $gameMap.autoplay();
        SceneManager.goto(Scene_Map);
    };    
    
})();