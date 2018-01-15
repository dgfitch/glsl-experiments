uniform:
	gcc -o bin/uniform uniform.c audio.c midi.c -Wall `pkg-config --cflags --libs libpulse,libpulse-simple` -lasound -lm -lpthread

all: uniform exp

exp:
	gcc -Wall experiments/test.c -o bin/test -lm
	gcc -o bin/audio experiments/audio.c `pkg-config --cflags --libs libpulse,libpulse-simple` -lm
	gcc -o bin/beat experiments/beat.c -lm -lpthread

