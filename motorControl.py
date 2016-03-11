#!/usr/bin/python
from Adafruit_MotorHAT import Adafruit_MotorHAT, Adafruit_DCMotor

import time
import atexit
import sys, json

# create a default object, no changes to I2C address or frequency
mh = Adafruit_MotorHAT(addr = 0x60)
# recommended for auto-disabling motors on shutdown!
def turnOffMotors():
        mh.getMotor(1).run(Adafruit_MotorHAT.RELEASE)
        mh.getMotor(2).run(Adafruit_MotorHAT.RELEASE)
        mh.getMotor(3).run(Adafruit_MotorHAT.RELEASE)
        mh.getMotor(4).run(Adafruit_MotorHAT.RELEASE)

def runMotor(n, spd):
	myMotor = mh.getMotor(n)

	if spd < 0 and spd >= -255:
		myMotor.run(Adafruit_MotorHAT.BACKWARD)

	elif spd > 0 and spd <= 255:
		myMotor.run(Adafruit_MotorHAT.FORWARD)

	else:
        	myMotor.run(Adafruit_MotorHAT.RELEASE)
	
	absSpeed = abs(spd)
	myMotor.setSpeed(absSpeed)

# accept commands
for line in sys.stdin:
    command = json.loads(line[:-1])
    motor = command['motor']
    speed = command['speed']
    runMotor(motor, speed)
    print 'ya did it'
