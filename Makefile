all:
	gcc -Wall test.c -o test -lm
	gcc -o audio audio.c `pkg-config --cflags --libs libpulse,libpulse-simple`

