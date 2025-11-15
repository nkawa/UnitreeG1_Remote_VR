import AFRAME from 'aframe'

// These components must be attached to the same element(a-entity) as
// the rapier-hand1-motion-ui and rapier-func-controller components.

AFRAME.registerComponent('rapier-register', {
  // DUMMY ROBOT registration. alternative to robot-loader
  init: function () {
    const sceneEl = this.el?.sceneEl;
    const registerFunc = ()=>{
      const id = this.el?.id;
      const robotRegistryComp = sceneEl?.robotRegistryComp;
      if (id && sceneEl && robotRegistryComp) {
	robotRegistryComp.add(id,
			      {el: this.el, axes: [], endLink: this.el});
	this.registered = true;
      }
    };
    if (sceneEl?.hasLoaded) {
      registerFunc();
    } else {
      sceneEl.addEventListener('loaded', registerFunc, {once: true});
    }
  },
  remove: function() {
    if (this.registered) {
      const robotRegistry = this.el.sceneEl.robotRegistryComp;
      // const robotRegistry = document.getElementById('robot-registry');
      if (robotRegistry) {
	robotRegistry.remove(this.data.robotId);
	this.registered = false;
      }
    }
  }
});

AFRAME.registerComponent('rapier-selector', {
  init: function () {
    this.el.addEventListener('thumbmenu-select', (evt) => {
      console.log('### rapier-selector: thumbmenu-select event:',
		  evt.detail.index);
      let distributorEl = null;
      if (this.el.getAttribute('event-distributor')) {
	distributorEl = this.el;
      } else if (this.el.sceneEl.getAttribute('event-distributor')) {
	distributorEl = this.el.sceneEl;
      }
      const robotRegistryComp = this.el.sceneEl.robotRegistryComp;
      const menuText = evt.detail?.texts[evt.detail?.index];
      if (distributorEl && robotRegistryComp && menuText) {
	if (menuText === 'rapier') { // select rapier (rapier 'hand1')
	  console.log('### select rapier');
          robotRegistryComp.eventDeliveryOneLocation('rapier-controller', distributorEl);
	}
      }
    });
  }
});
