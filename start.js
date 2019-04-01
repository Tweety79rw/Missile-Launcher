let usb = require('usb');
if(!usb){
  console.log('could not find usb');
  return;
}
const MOVEMENTS = {
    'right': [0x02,0x08,0x00,0x00,0x00,0x00,0x00,0x00],
    'left' : [0x02,0x04,0x00,0x00,0x00,0x00,0x00,0x00],
    'up'   : [0x02,0x02,0x00,0x00,0x00,0x00,0x00,0x00],
    'down' : [0x02,0x01,0x00,0x00,0x00,0x00,0x00,0x00],
    'stop' : [0x02,0x20,0x00,0x00,0x00,0x00,0x00,0x00],
    'fire' : [0x02,0x10,0x00,0x00,0x00,0x00,0x00,0x00]
};
class Rocket {
  constructor() {
    this.duration = 0.05;
    this.device = usb.findByIds(0x2123, 0x1010);
    this.device.open();
  }
  MoveRight() {
    this.Move('right',0.5);
  }
  MoveLeft() {
    this.Move('left',0.5);
  }
  MoveUp() {
    this.Move('up',0.5);
  }
  MoveDown() {
    this.Move('down',0.5);
  }
  MoveStop() {
    this.Move('stop');
  }
  MoveFire() {
    this.Move('fire');
  }
  Move(key, duration) {
    let _this = this;
    duration = duration || this.duration;
    this.device.controlTransfer(0x21,0x09,0,0,Buffer.from(MOVEMENTS[key]));
    if(['stop','fire'].indexOf(key) == -1)
      setTimeout(function() {_this.MoveStop();},duration);
    setTimeout(function(){},0.15);
  }
}
const readline = require('readline');
let rocket = new Rocket();
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    process.exit();
  } else {
    if(key.name == 'space') {
      rocket.MoveFire();
    } else {
      rocket.Move(key.name, 10);
    }
    console.log(`You pressed the "${str}" key`);
    console.log();
    console.log(key);
    console.log();
  }
});
