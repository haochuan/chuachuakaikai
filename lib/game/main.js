ig.module( 
	'game.main' 
)
.requires(
    'impact.game',
    'game.levels.town',
    'game.entities.player'
)

.defines(function(){

MyGame = ig.Game.extend({
    gravity: 0,
	init: function() {
        this.loadLevel( LevelTown );

        // Bind keys
        ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
        ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
        ig.input.bind( ig.KEY.UP_ARROW, 'up' );
        ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
        ig.input.bind( ig.KEY.SPACE, 'shoot' );

	},
	
	
	update: function() {
// screen follows the player
		var player = this.getEntitiesByType( EntityPlayer )[0]; 
		if( player ) {
			this.screen.x = player.pos.x - ig.system.width/2;
			this.screen.y = player.pos.y - ig.system.height/2;
		}
// Update all entities and BackgroundMaps
	this.parent(); 
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
	}
});

StartScreen = ig.Game.extend({
	instructText: new ig.Font( 'media/04b03.font.png' ), 
	background: new ig.Image('media/screen-bg.png'), 

	
	init: function() {
		ig.input.bind( ig.KEY.SPACE, 'start'); 
	},
	
	update: function() { 
		if(ig.input.pressed ('start')){
			ig.system.setGame(MyGame) 
		}
		this.parent(); 
	},
	
	draw: function() { 
		this.parent();
		this.background.draw(0,0);
		var x = ig.system.width/2,
		y = ig.system.height - 20;
		this.background.draw(0,0);
		this.instructText.draw( 'Please shoot on my face', x+40, y,
		ig.Font.ALIGN.CENTER ); 
		this.instructText.draw( 'Press Space to Start', x+40, y + 10,
		ig.Font.ALIGN.CENTER ); 
	},

});

// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', StartScreen, 60, 320, 240, 2 );
});
