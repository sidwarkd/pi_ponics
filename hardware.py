import RPi.GPIO as GPIO
import spidev
from time import sleep, localtime, strftime, time
import sys
import smbus

class PiHardware(object):

  def __init__(self):

    GPIO.setmode(GPIO.BOARD)

    # Setup the LED pin as an output and to have an initial 
    # state of high which turns the LED off
    GPIO.setup(12, GPIO.OUT, initial=GPIO.HIGH)

    # Setup the switch pin as an input
    GPIO.setup(16, GPIO.IN)

    # Setup the button pin as an input
    GPIO.setup(18, GPIO.IN)

    # Setup spi module
    self.spi = spidev.SpiDev()
    self.spi.open(0,0)

    # Setup i2c module
    self.i2c = smbus.SMBus(1)

    # Setup motion sensor
    GPIO.setup(22, GPIO.IN)



  def get_temp(self):
    temp = self.i2c.read_word_data(0x48, 0)
    byte1_mask = 0b0000000011111111
    byte2_mask = 0b1111111100000000
    byte1 = (temp & byte1_mask) << 4
    byte2 = (temp & byte2_mask) >> 12
    temp_c = byte2 | byte1
    temp_c *= .0625
    temp_f = temp_c*1.80 + 32.00
    return temp_f

  def spi_send(self, data):
    xfer_list = []
    if type(data) == str:
      for c in data:
        xfer_list.append(ord(c))
    elif type(data) == list:
      xfer_list += data
    elif type(data) == int:
      xfer_list.append(data)
    else:
      print "Unsupported type passed to spi_send. Must be str, int, or list"

    self.spi.xfer2(xfer_list, 250000)

  def clear_display(self):
    self.spi_send([0x76])

  def display_time(self):
    t = strftime("%H%M", localtime())
    self.clear_display()
    self.spi_send(t)
    self.spi_send([0x77, 0x10])

  def display_temp(self, temp):
    # Display temp with one decimal of precision
    temp_str = "{:4.1f}f".format(round(temp,1))
    display_val = temp_str.replace('.','')
    self.clear_display()
    self.spi_send(display_val)
    # Turn on the decimal and the apostrophe
    self.spi_send([0x77, 0x22])

  def set_led(self, state):
    GPIO.output(12, state);

  def cleanup(self):
    GPIO.output(12, GPIO.HIGH)
    GPIO.cleanup()
    self.clear_display()
    self.spi.close()
  