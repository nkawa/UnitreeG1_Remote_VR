import AFRAME from 'aframe';

// thumbstick イベントを el.thumbxy に反映するコンポーネント
AFRAME.registerComponent('thumb-stick-control', {
  init: function () {
    console.log("### thumb-stick-control init:", this.el);
    this.el.thumbstick = [0,0]; 
    this.el.addEventListener('thumbstickmoved', (evt) => {
        this.el.thumbstick[0] = evt.detail.x;
        this.el.thumbstick[1] = evt.detail.y;
    });
  }
});


