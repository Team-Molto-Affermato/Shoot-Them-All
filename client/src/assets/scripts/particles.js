import "../../../node_modules/canvas-particle-network/particle-network.min"

export function drawParticles(canvasDiv) {
  var options = {
    particleColor: '#00c62b',
    background: '#303030',
    interactive: false,
    speed: 'medium',
    density: 'high'
  };
  var particleCanvas = new ParticleNetwork(canvasDiv, options);
}

