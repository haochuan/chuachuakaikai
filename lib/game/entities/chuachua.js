ig.module(
    'game.entities.chuachua'
)
.requires(
    'impact.entity'
)
.defines(function(){
    EntityPlayer = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/chuachua.png', 32, 32 ),
        size: {x: 30, y:30},
        offset: {x: 2, y: 2},
        flip: false,
        //maxVel: {x: 100, y: 150},
        //friction: {x: 0, y: 0},
        accelGround: 400,
        accelAir: 200,
        health: 3,
        //jump: 0,
        
        //collision
            
        type: ig.Entity.TYPE.A,
		checkAgainst: ig.Entity.TYPE.NONE, 
		collides: ig.Entity.COLLIDES.PASSIVE,
        
        init: function( x, y, settings ) {
        	this.parent( x, y, settings );
        	this.addAnim( 'front', 0.1, [11, 9, 10] );
        	this.addAnim( 'back', 0.1, [8, 7, 6] );
        	this.addAnim( 'left', 0.1, [5, 4, 2] );
        	this.addAnim( 'right', 0.1, [0, 3, 1] );
        	this.addAnim( 'free', 0.1, [11] );
        },
        update: function() {
              // move left or right
        	var accel = 200;
        	
        	if( ig.input.state('left') ) {
        		this.vel.x = -accel;
        		this.flip = true;
        	}else if( ig.input.state('right') ) {
        		this.vel.x = accel;
        		this.flip = false;
        	}else if( ig.input.state('up') ) {
        		this.vel.y = -accel;
        		this.flip = false;
        	}else if( ig.input.state('down') ) {
        		this.vel.y = accel;
        		this.flip = false;
        	}else {
        		this.vel.x = 0;
        		this.vel.y = 0;
        	}
        	// jump
        	//if( this.standing && ig.input.pressed('jump') ) {
        	//	this.vel.y = -this.jump;
        	//}
            // set the current animation, based on the player's speed
             if(( this.vel.y == 0 ) && (this.vel.x == 0)) {
            	this.currentAnim = this.anims.free;
            }else if( this.vel.y > 0 ) {
            	this.currentAnim = this.anims.front;
            }else if( this.vel.x > 0 ) {
            	this.currentAnim = this.anims.left;
             }else if( this.vel.x < 0 ) {
            	this.currentAnim = this.anims.right;
            } else if( this.vel.y < 0 ) {
            	this.currentAnim = this.anims.back;
            }
            
            // shoot
			if( ig.input.pressed('shoot') ) {
				ig.game.spawnEntity( EntityBullet, this.pos.x, this.pos.y, {flip:this.flip} ); 
			}
            

           
            /*}else if( this.vel.x != 0 ) {
            	this.currentAnim = this.anims.run;
            }else{
            	this.currentAnim = this.anims.idle;
            }
            this.currentAnim.flip.x = this.flip;
            */
        	// move!
        	this.parent();
        },
        

    });
    
    EntityBullet = ig.Entity.extend({
    
    size: {x: 5, y: 3},
	animSheet: new ig.AnimationSheet( 'media/sperm.png', 6, 3 ), 
	maxVel: {x: 200, y: 200},
	type: ig.Entity.TYPE.NONE, 
	checkAgainst: ig.Entity.TYPE.B, 
	collides: ig.Entity.COLLIDES.PASSIVE,
	
	init: function( x, y, settings ) {
		this.parent( x + (settings.flip ? -4 : 8) , y+8, settings );
		this.vel.x = this.accel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x); 
		this.addAnim( 'right', 0.2, [0] );
	},
	
	handleMovementTrace: function( res ) { 
		this.parent( res );
		if( res.collision.x || res.collision.y ){
			this.kill(); 
		}
	},
	
	check: function( other ) { 
		other.receiveDamage( 1, this ); 
		this.kill();
	}
	
	});
	
});
