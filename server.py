from bottle import route, run, static_file, request
from hardware import PiHardware
import atexit

hw = PiHardware()
atexit.register(hw.cleanup)

@route('/')
def home():
    return static_file('app.html', root='./')

@route('/bootstrap/<filepath:path>')
def bootstrap_content(filepath):
  return static_file(filepath, root='./bootstrap')

@route('/images/<filepath:path>')
def image_content(filepath):
  return static_file(filepath, root='./images')

@route('/css/<filepath:path>')
def css_content(filepath):
  return static_file(filepath, root='./css')

@route('/js/<filepath:path>')
def js_content(filepath):
  return static_file(filepath, root='./js')

@route('/led', method='POST')
def set_led_state():

  state = request.json.get('state')
  if state != None:
    hw.set_led(state)

@route('/temp')
def get_temp():
  return {'temp': hw.get_temp()}

run(host='0.0.0.0', port=80, debug=True)