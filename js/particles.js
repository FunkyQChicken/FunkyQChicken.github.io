// Particle class, just a bundle of data
class Particle {
  constructor () {
    this.x = 0;
    this.y = 0;

    this.dx = 0;
    this.dy = 0;
    this.radius = 1

    this.opacity = 1.0;
  }
}

const canvas = document.getElementById("canvas");
const num_particles = 30
const fps = 30

var dead_particles = []
var particles = []
var particle_color = "#FFFFFF"
var last_time = new Date();

for (var i = 0; i < num_particles; i++)
  dead_particles.push(new Particle());


function dummy_func(x, y, z) {return false;};
spawn_particle_func = dummy_func;
tick_particle_func = dummy_func;
draw_particle_func = dummy_func;

function particle_drawer() {
  canvas.width = canvas.parentElement.clientWidth
  canvas.height = canvas.parentElement.clientHeight

  if (dead_particles.length > 0) {
    var last_particle = dead_particles.length - 1;
    if (spawn_particle_func(dead_particles[last_particle])) {
      particles.push(dead_particles.pop());
    }
  }

  var ctx = canvas.getContext("2d");
  ctx.fillStyle = particle_color;
  ctx.globalCompositeOperation = 'destination-over';

  var new_time = new Date()
  var dt = new_time - last_time;
  last_time = new_time;

  for (var i = 0; i < particles.length; i++) {
    draw_particle_func(particles[i], ctx, true);
    remove = tick_particle_func(particles[i], dt);

    if (remove) {
      dead_particles.push(particles.splice(i, 1)[0]);
      i--;
    } else {
      draw_particle_func(particles[i], ctx, false);
    }
  }

  window.setTimeout(function() {window.requestAnimationFrame(particle_drawer)}, 1000/fps);
}
window.requestAnimationFrame(particle_drawer);



function top_spawn(p) {
  if (Math.random() < 0.90) 
    return false;
  p.x = Math.floor(Math.random() * canvas.width);
  p.y = 0;
  p.dx = 0.2 + Math.random() * 0.4;
  p.dy = 1 + Math.random() * 1;
  p.radius = Math.floor(2 * Math.random()) + 2
  p.opacity = 0.5 + Math.random() / 2
  return true;
}

function draw_circle(p, ctx, undraw) {
  if (undraw) {
    var extra = 2;
    ctx.clearRect(p.x - p.radius - extra, p.y - p.radius - extra, (p.radius + extra) * 2, (p.radius + extra) * 2);
  } else {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, true);
    ctx.fill();
  }
}


function constant_speed(p, dt) {
  var m = dt / 15;
  p.x += (p.dx * m);
  p.y += (p.dy * m);
  return p.y > canvas.height || p.x < 0 || p.x > canvas.width;
}

spawn_particle_func = top_spawn
tick_particle_func = constant_speed;
draw_particle_func = draw_circle;
