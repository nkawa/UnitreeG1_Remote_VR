import AFRAME from 'aframe';

AFRAME.registerComponent('finger-closer', {
  schema: {
    openEvent: {type: 'string', default: 'bbuttondown'},
    openStopEvent: {type: 'string', default: 'bbuttonup'},
    openSpeed: {type: 'number', default: 0.5}, // radian per second
    openMax: {type: 'number', default: 0}, // in degrees
    closeEvent: {type: 'string', default: 'abuttondown'},
    closeStopEvent: {type: 'string', default: 'abuttonup'},
    closeSpeed: {type: 'number', default: 0.5},// radian per second
    closeMax: {type: 'number', default: 45}, // in degrees
    stationaryJoints: {type: 'array', default: []}, // indices of joints that do not move
    interval: {type: 'number', default: 0.1}, // seconds
  },
  init: function() {
    this.start = Date.now();
    this.interval = this.data.interval;
    this.intervalTimer = null;
    this.opening = false;
    this.closing = false;
    this.openMaxRadian = this.data.openMax*Math.PI/180.0;
    this.closeMaxRadian = this.data.closeMax*Math.PI/180.0;
    this.stationaryJoints = this.data.stationaryJoints.map((i) => parseInt(i));
    if (this.closeMaxRadian >= this.openMaxRadian) {
      this.openDirection = 1;
    } else {
      this.openDirection = -1;
    }
    this.el.addEventListener(this.data.openEvent, () => {
      console.log('open event received:', this.el.id);
      this.opening = true;
      this.closing = false;
    });
    this.el.addEventListener(this.data.openStopEvent, () => {
      console.log('open stop event received:', this.el.id);
      this.opening = false;
    });
    this.el.addEventListener(this.data.closeEvent, () => {
      console.log('close event received:', this.el.id);
      this.closing = true;
      this.opening = false;
    });
    this.el.addEventListener(this.data.closeStopEvent, () => {
      console.log('close stop event received:', this.el.id);
      this.closing = false;
    });
    const axesUpdate = () => {
      // console.warn('finger-closer loop:',this?.el?.id,' in axesUpdate', Date.now()-this?.start);
      if (this.el?.axes) {
	if (this?.jointValues === undefined) {
	  this.jointValues = Array(this.el.axes.length).fill(0);
	  console.log('finger-closer: Initialized jointValues for',this.el.id, this.jointValues);
	} else {
	  if (this.opening || this.closing) {
	    const jointValues = this.jointValues;
	    const deltaRadianOpen = (this.data.openSpeed * this.interval);
	    const deltaRadianClose = (this.data.closeSpeed * this.interval);
	    for (let i = 0; i < jointValues.length; i++) {
	      if (!this.stationaryJoints.includes(i)) {
		// console.log(`joint ${i} value before: ${jointValues[i]}`);
		if (this.closing) {
		  // console.log('finger-closer:',this.el.id,Date.now()-this.start,
		  // 	      ' closing joint',i, 'value:', jointValues[i]);
		  if (this.openDirection * (jointValues[i] - this.closeMaxRadian) < 0) {
		    jointValues[i] += this.openDirection * deltaRadianClose;
		  } else {
		    jointValues[i] = this.closeMaxRadian; // limit
		  }
		}
		if (this.opening) {
		  // console.log('finger-closer:',this.el.id,Date.now()-this.start,
		  // 	      ' opening joint',i, 'value:', jointValues[i]);
		  if (this.openDirection * (jointValues[i] - this.openMaxRadian) > 0) {
		    jointValues[i] -= this.openDirection * deltaRadianOpen;
		  } else {
		    jointValues[i] = this.openMaxRadian; // limit
		  }
		}
	      }
	    }
	    this.el.axes.map((axisEl, idx) => {
	      const axis = axisEl.axis;
	      axisEl.object3D.setRotationFromAxisAngle(axis,
						       jointValues[idx]);
	    });
	  }
	}
      }
    };
    const initializeJoints = () => {
      // if (this.el.axes) {
      // 	this.jointValues = Array(this.el.axes.length).fill(0);
      // 	console.log('finger-closer: Initialized jointValues for',this.el.id, this.jointValues);
	this.intervalTimer = setInterval(axesUpdate, this.interval * 1000);
      // } else {
      // 	console.warn('finger-closer: No axes found on the entity.');
      // }
    };
    if (this.el?.axes) {
      initializeJoints();
    } else {
      this.el.addEventListener('attached', () => {
	console.log('finger-closer: attached event received for', this.el.id);
	initializeJoints();
      }, {once: true});
    }
    // this.timer = 10000;
  },
  // tick: function(time, timeDelta) {
  //   this.timer += timeDelta;
  //   if (this.timer > 1000) {
  //     console.log('tick:',this.el.id,' in tick', this.timer);
  //     this.timer = 0;
  //   }
  //   return;
  // },
  remove: function() {
    // Clean up event listeners if necessary
    if (this.intervalTimer) clearInterval(this.intervalTimer);
  },
  // axesUpdate: function(component) {
  //   console.warn('finger-closer loop:',component?.el?.id); // , Date.now()-component.start);
  //   console.warn(' component:', component);
  //   if (component.el?.axes && component.jointValues && (component.opening || component.closing)) {
  //     const jointValues = component.jointValues;
  //     const deltaRadianOpen = (component.data.openSpeed * component.interval);
  //     const deltaRadianClose = (component.data.closeSpeed * component.interval);
  //     for (let i = 0; i < jointValues.length; i++) {
  // 	if (!component.stationaryJoints.includes(i)) {
  // 	  // console.log(`joint ${i} value before: ${jointValues[i]}`);
  // 	  if (component.closing) {
  // 	    console.log('finger-closer:',component.el.id,Date.now()-component.start,' closing joint',i, 'value:', jointValues[i]);
  // 	    if (component.openDirection * (jointValues[i] - component.closeMaxRadian) < 0) {
  // 	      jointValues[i] += component.openDirection * deltaRadianClose;
  // 	    } else {
  // 	      jointValues[i] = component.closeMaxRadian; // limit
  // 	    }
  // 	  }
  // 	  if (component.opening) {
  // 	    console.log('finger-closer:',component.el.id,Date.now()-component.start,' opening joint',i, 'value:', jointValues[i]);
  // 	    if (component.openDirection * (jointValues[i] - component.openMaxRadian) > 0) {
  // 	      jointValues[i] -= component.openDirection * deltaRadianOpen;
  // 	    } else {
  // 	      jointValues[i] = component.openMaxRadian; // limit
  // 	    }
  // 	  }
  // 	}
  //     }
  //     component.el.axes.map((axisEl, idx) => {
  // 	const axis = axisEl.axis;
  // 	axisEl.object3D.setRotationFromAxisAngle(axis,
  // 						 jointValues[idx]);
  //     });
  //   }
  // }
});

      // console.warn('finger-closer:',this.el.id,' in tick', this.timer, '. axes length:',
      // 		   this.el?.axes?.length, 'jointValues:', this?.jointValues);

  //   if (this.el?.axes && this.jointValues && (this.opening || this.closing)) {
  //     const jointValues = this.jointValues;
  //     const deltaRadianOpen = (this.data.openSpeed * timeDelta) / 1000.0;
  //     const deltaRadianClose = (this.data.closeSpeed * timeDelta) / 1000.0;
  //     for (let i = 0; i < jointValues.length; i++) {
  // 	if (!this.data.stationaryJoints.includes(i)) {
  // 	  console.log(`joint ${i} value before: ${jointValues[i]}`);
  // 	  if (this.opening) {
  // 	    if (this.openDirection * (jointValues[i] - this.openMaxRadian) < 0) {
  // 	      jointValues[i] -= this.openDirection * deltaRadianOpen;
  // 	    } else {
  // 	      jointValues[i] = this.openMaxRadian; // limit
  // 	    }
  // 	  }
  // 	  if (this.closing) {
  // 	    if (this.openDirection * (jointValues[i] - this.closeMaxRadian) > 0) {
  // 	      jointValues[i] += this.openDirection * deltaRadianClose;
  // 	    } else {
  // 	      jointValues[i] = this.closeMaxRadian; // limit
  // 	    }
  // 	  }
  // 	}
  //     }
  //     this.el.axes.map((axisEl, idx) => {
  // 	const axis = axisEl.axis;
  // 	axisEl.object3D.setRotationFromAxisAngle(axis,
  // 						 jointValues[idx]);
  //     });
  //   }
  // }
