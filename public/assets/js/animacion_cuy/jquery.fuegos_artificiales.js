
(function ($) {
	$.fn.fireworks = function(options) {

// VARIABLEZ
		// play with them
				// var canvas = document.querySelector('canvas');
				// var ctx = canvas.getContext('2d');
    var elemento = this;

				    var canvas = document.createElement('canvas');
				    canvas.id = 'fireworksField';
					canvas.style.position = 'absolute';
					canvas.style.top = '0px';
					canvas.style.left = '0px';
			        canvas.style.zIndex="-1";
				    // canvas.style.opacity = options.opacity;



				var fw1, fw2;
				var defaults={
					opacity:0,
						width : canvas.width = $(this).width(),
						height : canvas.height =$(this).height(),
						n_stars : 0, //num of stars
						stars : [], //array to store generated stars
						twinkleFactor : .4, //how much stars 'twinkle'
						maxStarRadius : 3,
						 //firework objects
						minStrength : 1.5, //lowest firework power
						maxStrength : 7, //highest firework power
						minTrails : 7, //min particles
						maxTrails : 30, //max particles
						particleRadius : 2,
						trailLength : 15, //particle trail length
						delay : .5, // number of LIFEs between explosions
						LIFE : 150, //life time of firework
						g : 5e-2, //strength of gravity
						D : 1e-3 //strength of drag (air resistance)

				}
    				

				var opciones = $.extend({}, defaults, options);

					canvas.style.opacity = opciones.opacity;
				    var ctx = canvas.getContext('2d');

				// Particle Class
				var Particle = function(x, y, vx, vy, ax, ay, colour) {
						this.x = x;
						this.y = y;
						this.vx = vx;
						this.vy = vy;
						this.ax = ax;
						this.ay = ay;
						this.life = opciones.LIFE; //only here for opacity in .draw() method
						this.path = [];
						this.colour = colour;
						this.r = opciones.particleRadius;
						this.update = function() {
							this.life--;
							// add point to path but if full, remove a point first
							if (this.path.length >= opciones.trailLength) this.path.shift();
							this.path.push([this.x, this.y])
							// update speed n position n stuff
							this.vy += this.ay;
							this.vx += this.ax;
							this.x += this.vx;
							this.y += this.vy;
						}
						this.draw = function() {
							var opacity = ~~(this.life * 100 / opciones.LIFE) / 100;
							// tail      
							ctx.fillStyle = 'rgba(' + this.colour + (opacity * 0.4) + ')';
							if (this.life > opciones.LIFE * 0.95) ctx.fillStyle = '#fff';
							ctx.lineWidth = 1;
							ctx.beginPath();
							ctx.moveTo(this.x - this.r, this.y);
							var i = this.path.length - 1;
							ctx.lineTo(this.path[0][0], this.path[0][1]);
							ctx.lineTo(this.x + this.r, this.y);
							ctx.closePath();
							ctx.fill();
							// main dot
							ctx.fillStyle = 'rgba(' + this.colour + opacity + ')';
							if (this.life > opciones.LIFE * 0.95) ctx.fillStyle = '#fff';
							ctx.beginPath();
							ctx.arc(~~this.x, ~~this.y, this.r, 0, Math.PI * 2);
							ctx.fill();
							ctx.closePath();
						}
				}
			// Firework class
				var Firework = function() {
					this.x = opciones.width * (Math.random() * 0.8 + 0.1); // from 0.1-0.9 widths
					this.y = opciones.height * (Math.random() * 0.8 + 0.1); // from 0.1-0.9 heights
					this.strength = Math.random() * (opciones.maxStrength - opciones.minStrength) + opciones.minStrength;
					this.colour = ~~(Math.random() * 255) + ',' +
					~~(Math.random() * 255) + ',' +
					~~(Math.random() * 255) + ',';
					this.colour = "0,0,0,";
					this.life = 0;
					this.particles = (function(x, y, strength, colour) {
						var p = [];
						var n = ~~(Math.random() * (opciones.maxTrails - opciones.minTrails)) + opciones.minTrails;
						var ay = opciones.g;
						for (var i = n; i--;) {
						var ax = opciones.D;
						var angle = i * Math.PI * 2 / n;
						if (angle < Math.PI) ax *= -1;
						var vx = strength * Math.sin(angle);
						var vy = strength * Math.cos(angle);
						p.push(new Particle(x, y, vx, vy, ax, ay, colour));
						}
						return p;
					})(this.x, this.y, this.strength, this.colour);
					this.update = function() {
					this.life++;
					if (this.life < 0) return; //allows life to be delayed
					for (var i = this.particles.length; i--;) {
						this.particles[i].update();
						this.particles[i].draw();
						//wasn't bothered to make an extra draw function for firework class
						}
					}
				};
				var Star = function() {
					this.x = Math.random() * opciones.width;
					this.y = Math.random() * opciones.height;
					this.r = Math.random() * opciones.maxStarRadius;
					this.b = ~~(Math.random() * 100) / 100;
				}
				Star.prototype.draw = function() {
					this.b += opciones.twinkleFactor * (Math.random() - .5);
					ctx.fillStyle = 'rgba(255,255,255,' + this.b + ')';
					ctx.beginPath();
					ctx.arc(~~this.x, ~~this.y, this.r, 0, Math.PI * 2);
					ctx.fill();
					ctx.closePath();
				}
				function createStars() {
				for (var i = opciones.n_stars; i--;) opciones.stars.push(new Star);
				}
			   var animacion=null;
				function main() {
					// ctx.fillStyle = '#ffffff';///blanco

					// ctx.fillRect(0, 0, opciones.width, opciones.height);
						ctx.fillStyle = '#ffffff';
						ctx.fillRect(0, 0, opciones.width, opciones.height);
						ctx.clearRect(0,0,opciones.width, opciones.height);
					for (var i = opciones.n_stars; i--;) {
						opciones.stars[i].draw();
					}
					opciones.fw1.update();
					opciones.fw2.update();
					if (opciones.fw1.life == opciones.LIFE * opciones.delay) opciones.fw2 = new Firework;
					if (opciones.fw2.life == opciones.LIFE * opciones.delay) opciones.fw1 = new Firework;
					animacion=window.requestAnimationFrame(main);
				}
				function init() {
					opciones.fw1 = new Firework;
					opciones.fw2 = new Firework;
					opciones.fw2.life = -opciones.LIFE * opciones.delay;
					createStars();
					main();
				}
    $(elemento).append(canvas);

				init();



			     return {
			             datos : function(){
			                             return animacion; // Preserve the jQuery chainability 
			                            },
			             destruir : function(){
		             					cancelAnimationFrame(animacion);
		                                canvas.remove();
			                               //...
			                            return animacion;
			                            }
			           };


	}
})(jQuery);