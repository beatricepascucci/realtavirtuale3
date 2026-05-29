// ── 1. INFO-OBJECT: click → apre pannello info ──
AFRAME.registerComponent('info-object', {
  schema: {
    titolo: { type: 'string', default: 'Informazione' },
    testo:  { type: 'string', default: '' },
    audio:  { type: 'string', default: '' }
  },
  init: function () {
    const el = this.el, data = this.data;
    el.addEventListener('mouseenter', () => el.setAttribute('scale', '1.05 1.05 1.05'));
    el.addEventListener('mouseleave', () => el.setAttribute('scale', '1 1 1'));
    el.addEventListener('click', () => {
      if (typeof openInfoPanel === 'function') openInfoPanel(data.titolo, data.testo);
      if (data.audio) { const s = document.querySelector(data.audio); if (s) s.play(); }
    });
  }
});

// ── 2. PORTAL-LINK: naviga a un'altra scena con fade ──
AFRAME.registerComponent('portal-link', {
  schema: {
    url:   { type: 'string', default: '#' },
    label: { type: 'string', default: 'Entra' }
  },

  init: function () {
    const el   = this.el;
    const data = this.data;

    el.addEventListener('mouseenter', function() {
      const ring = el.querySelector('a-torus');
      if (ring) ring.setAttribute('color', '#e8cf85');
    });

    el.addEventListener('mouseleave', function() {
      const ring = el.querySelector('a-torus');
      if (ring) ring.setAttribute('color', '#c9a84c');
    });

    el.addEventListener('click', function(evt) {
      evt.stopPropagation();
      console.log('Portale cliccato → ' + data.url);
      setTimeout(function() {
        window.location.href = data.url;
      }, 100);
    });
  }
});

// ── 3. TOTEM-FRAME: cornice dorata decorativa ──
AFRAME.registerComponent('totem-frame', {
  init: function () {
    const el = this.el;
    [
      { pos: '0 0.72 0',  rot: '0 0 0',  w: 1.28, h: 0.04 },
      { pos: '0 -0.72 0', rot: '0 0 0',  w: 1.28, h: 0.04 },
      { pos: '-0.64 0 0', rot: '0 0 90', w: 1.40, h: 0.04 },
      { pos: '0.64 0 0',  rot: '0 0 90', w: 1.40, h: 0.04 },
    ].forEach(s => {
      const b = document.createElement('a-box');
      b.setAttribute('position', s.pos); b.setAttribute('rotation', s.rot);
      b.setAttribute('width', s.w); b.setAttribute('height', s.h);
      b.setAttribute('depth', 0.03); b.setAttribute('color', '#c9a84c');
      el.appendChild(b);
    });
    ['−0.64 0.72 0','0.64 0.72 0','−0.64 −0.72 0','0.64 −0.72 0'].forEach(pos => {
      const g = document.createElement('a-box');
      g.setAttribute('position', pos); g.setAttribute('rotation', '0 0 45');
      g.setAttribute('width', 0.06); g.setAttribute('height', 0.06);
      g.setAttribute('depth', 0.04); g.setAttribute('color', '#e8cf85');
      el.appendChild(g);
    });
  }
});

// ── 4. PORTAL-PARTICLES: sfere fluttuanti nel portale ──
AFRAME.registerComponent('portal-particles', {
  init: function () {
    const el = this.el;
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2;
      const r = 0.5 + Math.random() * 0.4;
      const x = Math.cos(angle) * r, y = Math.sin(angle) * r, z = (Math.random() - 0.5) * 0.2;
      const dot = document.createElement('a-sphere');
      dot.setAttribute('position', `${x} ${y} ${z}`);
      dot.setAttribute('radius', 0.015 + Math.random() * 0.02);
      dot.setAttribute('color', '#e8cf85'); dot.setAttribute('material', 'shader: flat');
      const dur = 1500 + Math.floor(Math.random() * 2000);
      dot.setAttribute('animation',
        `property: position; to: ${x*1.15} ${y*1.15} ${z+0.1}; dur: ${dur};
         loop: true; dir: alternate; easing: easeInOutSine`);
      el.appendChild(dot);
    }
  }
});

// ── 5. FLOAT-ANIMATION: fluttuazione verticale ──
AFRAME.registerComponent('float-animation', {
  schema: { speed: { type: 'number', default: 2000 }, amount: { type: 'number', default: 0.1 } },
  init: function () {
    const pos = this.el.getAttribute('position') || {x:0,y:0,z:0};
    this.el.setAttribute('animation',
      `property: position; to: ${pos.x} ${pos.y + this.data.amount} ${pos.z};
       dur: ${this.data.speed}; loop: true; dir: alternate; easing: easeInOutSine`);
  }
});

// ── 6. LOOK-AT-CAMERA: sempre rivolto verso la camera ──
AFRAME.registerComponent('look-at-camera', {
  init: function () { this.camera = document.querySelector('#camera'); },
  tick: function () {
    if (!this.camera) return;
    const c = this.camera.getAttribute('position'), e = this.el.getAttribute('position');
    if (c && e) this.el.object3D.lookAt(c.x, c.y, c.z);
  }
});