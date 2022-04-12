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
const num_particles = 50
const fps = 30

var dead_particles = []
var particles = []
var particle_color = "#FFFFFFAA"
var last_time = new Date();

for (var i = 0; i < num_particles; i++)
  dead_particles.push(new Particle());


function dummy_func(x, y, z) {return false;};
spawn_particle_func = dummy_func;
tick_particle_func = dummy_func;
draw_particle_func = dummy_func;

function particle_drawer() {
  window.setTimeout(function() {window.requestAnimationFrame(particle_drawer)}, 1000/fps);

  var height = Math.max(canvas.parentElement.clientHeight, document.children[0].scrollHeight)
  var width = Math.max(canvas.parentElement.clientWidth, document.children[0].scrollWidth)
  if (width != canvas.width)
    canvas.width = width;
  if (height != canvas.height)
    canvas.height = height;

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
  }
  for (var i = 0; i < particles.length; i++) {
    remove = tick_particle_func(particles[i], dt);

    if (remove) {
      dead_particles.push(particles.splice(i, 1)[0]);
      i--;
    } else {
      draw_particle_func(particles[i], ctx, false);
    }
  }
}
window.requestAnimationFrame(particle_drawer);



function top_and_left_spawn(p) {
  if (Math.random() < 0.90) 
    return false;

  p.dx = 0.2 + Math.random() * 0.4;
  p.dy = 1 + Math.random() * 1;
  p.radius = Math.floor(2 * Math.random()) + 3
  p.opacity = 0.5 + Math.random() / 2

  var height_weight = p.dx * canvas.height;
  var width_weight = p.dy * canvas.width;

  var start = Math.random() * (height_weight + width_weight);
  if (start < height_weight) {
    p.x = 0;
    p.y = (start/height_weight) * canvas.height;
  } else {
    p.x = ((start - height_weight)/width_weight) * canvas.width;
    p.y = 0;
  }
  return true;
}

function draw_circle(p, ctx, undraw) {
  if (undraw) {
    var extra = 1;
    var edge = p.radius + extra
    ctx.clearRect(p.x - edge, p.y - edge, edge * 2, edge * 2);
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

spawn_particle_func = top_and_left_spawn
tick_particle_func = constant_speed;
draw_particle_func = draw_circle;
