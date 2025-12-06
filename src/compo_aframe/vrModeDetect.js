import AFRAME from 'aframe';

// VR mode に入ったかどうかを保存する
// scene element で使うのが良い
AFRAME.registerComponent('vr-mode-detect', {
  init: function () {
    this.el.vrmode = false; // false からスタート
    this.el.addEventListener('enter-vr', () => this.el.vrmode = true);
    this.el.addEventListener('exit-vr',   () => this.el.vrmode= false);
  }
});


