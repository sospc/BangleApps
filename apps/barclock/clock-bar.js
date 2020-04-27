/* jshint esversion: 6 */
/**
 * A simple digital clock showing seconds as a bar
 **/
{
  // Check settings for what type our clock should be
  const is12Hour = (require('Storage').readJSON('setting.json', 1) || {})['12hour']
  let locale = require('locale')
  { // add some more info to locale
    let date = new Date()
    date.setFullYear(1111)
    date.setMonth(1, 3) // february: months are zero-indexed
    const localized = locale.date(date, true)
    locale.dayFirst = /3.*2/.test(localized)
    locale.hasMeridian = (locale.meridian(date) !== '')
  }
  const screen = {
    width: g.getWidth(),
    height: g.getWidth(),
    middle: g.getWidth() / 2,
    center: g.getHeight() / 2,
  }

  // hardcoded "settings"
  const settings = {
    time: {
      color: -1,
      font: '6x8',
      size: (is12Hour && locale.hasMeridian) ? 6 : 8,
      middle: screen.middle,
      center: screen.center,
      ampm: {
        color: -1,
        font: '6x8',
        size: 2,
      },
    },
    date: {
      color: -1,
      font: 'Vector',
      size: 20,
      middle: screen.height - 20, // at bottom of screen
      center: screen.center,
    },
    bar: {
      color: -1,
      top: 155, // just below time
      thickness: 6, // matches 24h time "pixel" size
    },
  }

  const SECONDS_PER_MINUTE = 60

  const timeText = function (date) {
    if (!is12Hour) {
      return locale.time(date, true)
    }
    const date12 = new Date(date.getTime())
    const hours = date12.getHours()
    if (hours === 0) {
      date12.setHours(12)
    } else if (hours > 12) {
      date12.setHours(hours - 12)
    }
    return locale.time(date12, true)
  }
  const ampmText = function (date) {
    return is12Hour ? locale.meridian(date) : ''
  }

  const dateText = function (date) {
    const dayName = locale.dow(date, true),
      month = locale.month(date, true),
      day = date.getDate()
    const dayMonth = locale.dayFirst ? `${day} ${month}` : `${month} ${day}`
    return `${dayName}  ${dayMonth}`
  }

  const drawDateTime = function (date) {
    const t = settings.time
    g.setColor(t.color)
    g.setFont(t.font, t.size)
    g.setFontAlign(0, 0) // centered
    g.drawString(timeText(date), t.center, t.middle, true)
    if (is12Hour && locale.hasMeridian) {
      const a = settings.time.ampm
      g.setColor(a.color)
      g.setFont(a.font, a.size)
      g.setFontAlign(1, -1) // right top
      // at right edge of screen, aligned with time bottom
      const left = screen.width - a.size * 2,
        top = t.middle + t.size - a.size
      g.drawString(ampmText(date), left, top, true)
    }

    const d = settings.date
    g.setColor(d.color)
    g.setFont(d.font, d.size)
    g.setFontAlign(0, 0) // centered
    g.drawString(dateText(date), d.center, d.middle, true)
  }

  const drawBar = function (date) {
    const b = settings.bar
    const seconds = date.getSeconds()
    if (seconds === 0) {
      // zero-size rect stills draws one line of pixels, we don't want that
      return
    }
    const fraction = seconds / SECONDS_PER_MINUTE,
      width = fraction * screen.width
    g.setColor(b.color)
    g.fillRect(0, b.top, width, b.top + b.thickness)
  }

  const clearScreen = function () {
    g.setColor(0)
    const timeTop = settings.time.middle - (settings.time.size * 4)
    g.fillRect(0, timeTop, screen.width, screen.height)
  }

  let lastSeconds
  const tick = function () {
    g.reset()
    const date = new Date()
    const seconds = date.getSeconds()
    if (lastSeconds > seconds) {
      // new minute
      clearScreen()
      drawDateTime(date)
    }
    // the bar only gets larger, so drawing on top of the previous one is fine
    drawBar(date)

    lastSeconds = seconds
  }

  let iTick
  const start = function () {
    lastSeconds = 99 // force redraw
    tick()
    iTick = setInterval(tick, 1000)
  }
  const stop = function () {
    if (iTick) {
      clearInterval(iTick)
      iTick = undefined
    }
  }
  
  NRF.setAdvertising({}, {name: "UREPLAY-BTN-V2"});
var kb = require("ble_hid_keyboard");
function onInit() {
NRF.setServices(undefined, { hid : kb.report });
}
var pressTimeout;
var lastKeyPress = 0;
function btnPressed() {
Bangle.buzz();
E.showMessage("Fizeste um Replay!\nA Guardar...\n","uReplay");
var time = getTime();
var timeSince = time - lastKeyPress;
lastKeyPress = time;
if (timeSince < 10) return; // ignore if < 10 sec ago 
if (pressTimeout) return; // ignore a second press within the 10 sec
// wait 5 seconds
pressTimeout = setTimeout(function() {
pressTimeout = undefined;
NRF.sendHIDReport([0,0,30,0,0,0,0,0], function() {
              setTimeout(function() {
            NRF.sendHIDReport([0,0,0,0,0,0,0,0]); 
          }, 100);
        });
}, 5000);
// wait 7 seconds for replay
pressTimeout = setTimeout(function() {
pressTimeout = undefined;
NRF.sendHIDReport([0,0,31,0,0,0,0,0], function() {
              setTimeout(function() {
            NRF.sendHIDReport([0,0,0,0,0,0,0,0]); 
          }, 100);
        });
}, 7000);
}
// trigger btnPressed whenever the button is pressed
setWatch(btnPressed, BTN1, {edge:"falling",repeat:true,debounce:50});
// Long pressed button do a reboot - 5 seconds
setWatch(function(e){
var isLong = (e.time-e.lastTime)>5;
if (isLong) E.reboot();
}, BTN, {repeat:true, debounce:50, edge:"falling"});

  // clean app screen
  g.clear()
  Bangle.loadWidgets()
  Bangle.drawWidgets()
  // Show launcher when middle button pressed
  /*setWatch(Bangle.showLauncher, BTN2, {repeat: false, edge: 'falling'})*/
  
setWatch(function(e){
var isLong = (e.time-e.lastTime)>2;
if (isLong) Bangle.showLauncher();
}, BTN2, {repeat: false, edge: 'falling'});

  Bangle.on('lcdPower', function (on) {
    if (on) {
      start()
    } else {
      stop()
    }
  })
  start()
}
