#include <stdio.h>
#include <stddef.h>
#include <unistd.h>
#include <stdlib.h>
#include <math.h>
#include <sys/time.h>

#define BEAT_DELAY 40000

// Beat tracking variables
float bpm;
float uspb;

float calc_uspb(float b) {
  return 1000000.0 / (b / 60.0);
}

float set_uspb(float u) {
  uspb = u;
  return 1000000.0 * (bpm * 60.0);
}

void set_bpm(float b) {
  bpm = b;
  uspb = calc_uspb(bpm);
}

void bpm_double() {
  bpm *= 2.0;
  uspb = calc_uspb(bpm);
}

void bpm_halve() {
  bpm *= 0.5;
  uspb = calc_uspb(bpm);
}

void bpm_default() {
  bpm = 120.0;
  uspb = calc_uspb(bpm);
}

/* The main beat loop */

void* beat(void* arg) {
  struct timeval beat, current, dt;
  float beat_value = 1.0;

  gettimeofday(&beat, NULL);
	while(1) {
    gettimeofday(&current, NULL);
    timersub(&current, &beat, &dt);
    beat_value *= 0.95;
    if (dt.tv_sec * 1000000 + dt.tv_usec > uspb) {
      beat = current;
      beat_value = 1.0;
      #if DEBUG
      printf("Beat with uspb %f\n", uspb);
      #endif
    }
    #if DEBUG
    printf("uspb is %f\n", uspb);
    #else
    printf("u_beat,%f\n", beat_value);
    #endif
		usleep(BEAT_DELAY);
  }
}

