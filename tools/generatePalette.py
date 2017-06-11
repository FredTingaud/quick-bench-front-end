#!/usr/bin/python2
import sys
import getopt

try:
	import hsluv
except ImportError:
	import pip
	pip.main(['install', 'hsluv'])
	import hsluv

def colorMaker(refColor, maxNum):
	def nextColor(val):
		nextHue = (refColor[0] + val * 360 / maxNum) % 360
		return hsluv.hsluv_to_hex([nextHue, refColor[1], refColor[2]])
	return nextColor

def generateGrowingList(refColor, maxNum):
	nextColor = colorMaker(refColor, maxNum)
	return list(map(nextColor, range(1, maxNum)))

def quotes(line):
	return '"' + line + '"'

def printPalette(palette):
	print('const PALETTE = [')
	print(",\n".join(map(quotes, palette)))
	print('];')

def cssPrinter(color, i):
	return '.linked-code-decoration-inline-' + str(i) + ' {\n    background: ' + color + ' !important;\n}\n'

def printCSS(palette):
	print( "\n".join([cssPrinter(x, i) for i,x in enumerate(palette)]))

usage = 'Usage: generatePalette.py -c <referencecolor> -n <number>'

def main(argv):
	color = "#5ed9cd"
	number = 5
	try:
		opts, args = getopt.getopt(argv,"hc:n:",["color=","number="])
	except getopt.GetoptError:
		print(usage)
		sys.exit(2)
	for opt, arg in opts:
		if opt == '-h':
			print(usage)
			sys.exit()
		elif opt in ("-c", "--color"):
			color = '#' + arg
		elif opt in ("-n", "--number"):
			number = int(arg)

	refColor = hsluv.hex_to_hsluv(color)
	palette = [color] + generateGrowingList(refColor, number)
	printPalette(palette)
	print('')
	printCSS(palette)

if __name__ == "__main__":
	main(sys.argv[1:])