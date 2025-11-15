import AFRAME from 'aframe'
// const THREE = window.AFRAME.THREE;
import {globalWorkerRef} from '@ucl-nuee/rapier-worker'

AFRAME.registerComponent('rapier-fix-by-sucker', {
  schema: {
    // unique: {type: 'string', default: ''},
    hand: {type: 'string', default: 'nova2Sucker'},
    // object: {type: 'string', default: 'cylinder1'},
  },
  init: function() {
    // const fixId = this.data.unique ? this.data.unique :
    // 	  'fix-' + Math.random().toString(36).slice(2,7);// use ramdom string
    this.el.addEventListener('gripdown', (evt) => {
      globalWorkerRef?.current?.postMessage({
        type: 'call',
	name: 'rayCastFix',
	args: { name: this.data.hand },
      });
    });
    this.el.addEventListener('gripup', (evt) => {
      globalWorkerRef?.current?.postMessage({
        type: 'call',
        name: 'clearFixedRB',
	args: { name: this.data.hand },
      });
    });
  },
});
