ig.module(
	'game.entities.kaikai'
)

.requires(
	'impact.entity'
)

.defines(function(){
	EntityKaikai = ig.Entity.extend({
	
		animSheet: new ig.AnimationSheet( 'media/kaikai.png', 32, 32 ),
        size: {x: 30, y:30},
        offset: {x: 2, y: 2},
        health: 15,
        startPosition: null,
        invincible: true, 
        invincibleDelay: 2, 
        invincibleTimer:null,
        
        //collision
            
        type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.A, 
		collides: ig.Entity.COLLIDES.PASSIVE,
	
		init: function( x, y, settings ) {
        	this.parent( x, y, settings );
        	this.addAnim( 'dress', 0.5, [2], true );
        	this.addAnim( 'naked', 0.5, [0], true );
        	this.addAnim( 'under', 0.5, [1], true );
        	this.startPosition = {x:x,y:y};
        	this.invincibleTimer = new ig.Timer(); 
        	this.makeInvincible();

		},
		
		makeInvincible: function(){ 
			this.invincible = true; 
			this.invincibleTimer.reset();
		},
		
		receiveDamage: function(amount, from){ 
			if(this.invincible)
				return; 
			this.parent(amount, from);
		},
		
		draw: function(){
			if(this.invincible)
				this.currentAnim.alpha = this.invincibleTimer.delta()/this.invincibleDelay * 1 ;
			this.parent(); 
		},
		
		update: function() {
			if(this.health <= 15 && this.health >= 10) {
				this.currentAnim = this.anims.dress;
			}
			else if(this.health <= 10 && this.health >= 5 ) {
				this.currentAnim = this.anims.under;
			}
			else if(this.health <= 5 && this.health >= 1 ) {
				this.currentAnim = this.anims.naked;
			}
			
			if( this.invincibleTimer.delta() > this.invincibleDelay ) { 
				this.invincible = false;
				this.currentAnim.alpha = 1;
			}
			this.parent();
		},
		
		kill: function(){ 
			this.parent();
			ig.game.spawnEntity( EntityPlayer, this.startPosition.x, this.startPosition.y ); 
		}	
	});
	
	EntityDeathExplosionParticle = ig.Entity.extend({ 
		size: {x: 2, y: 2},
		maxVel: {x: 160, y: 200},
		lifetime: 2,
		fadetime: 1,
		bounciness: 0,
		vel: {x: 100, y: 30},
		friction: {x:100, y: 0},
		collides: ig.Entity.COLLIDES.LITE,
		colorOffset: 0,
		totalColors: 7,
		animSheet: new ig.AnimationSheet( 'media/blood.png', 2, 2 ), 
		
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			var frameID = Math.round(Math.random()*this.totalColors) + (this.colorOffset * (this.totalColors+1));
			this.addAnim( 'idle', 0.2, [frameID] );
			this.vel.x = (Math.random() * 2 - 1) * this.vel.x; 
			this.vel.y = (Math.random() * 2 - 1) * this.vel.y; 
			this.idleTimer = new ig.Timer();
		},
		
		kill: function(){ 
			this.parent();
			var x = this.startPosition.x;
			var y = this.startPosition.y; 
			ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y,
		{callBack:function(){ig.game.spawnEntity( EntityPlayer, x, y)}} );
		},

		update: function() {
			if( this.idleTimer.delta() > this.lifetime ) { 
			this.kill();
			return; 
		}
		this.currentAnim.alpha = this.idleTimer.delta().map( 
			this.lifetime - this.fadetime, this.lifetime,
			1, 0
		);
		this.parent();
		}
	});

});