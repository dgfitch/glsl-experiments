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
int beat_type = 2;

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

void bpm_increase() {
  bpm += 2.0;
  uspb = calc_uspb(bpm);
}

void bpm_decrease() {
  bpm -= 2.0;
  uspb = calc_uspb(bpm);
}

void bpm_default() {
  bpm = 120.0;
  uspb = calc_uspb(bpm);
}

/* The main beat loop */

void* beat(void* arg) {
  struct timeval beat, current, dt;
  float us_passed;
  float beat_value = 1.0;
  float beat_progress = 0.0;

  gettimeofday(&beat, NULL);
	while(1) {
    gettimeofday(&current, NULL);
    timersub(&current, &beat, &dt);
    us_passed = dt.tv_sec * 1000000 + dt.tv_usec;
    beat_progress = us_passed / uspb;

    switch(beat_type) {
      case 1:
        // Sawtooth down
        if (beat_progress > 1.0) {
          beat = current;
          beat_value = 1.0;
        } else {
          beat_value = 1.0 - beat_progress;
        }
        break;

      case 2:
        // Sawtooth up
        if (beat_progress > 1.0) {
          beat = current;
          beat_value = 1.0;
        } else {
          beat_value = beat_progress;
        }
        break;

      case 3:
        // Sine wave
        if (beat_progress > 1.0) {
          beat = current;
          beat_value = 1.0;
        } else {
          // normalize a sin wave between 0.0 and 1.0 that peaks at the beat
          beat_value = (sin(beat_progress * 2.0 * M_PI + (M_PI / 2.0)) + 1.0) / 2.0;
        }
        break;
    }

    #if DEBUG
    printf("uspb is %f\n", uspb);
    #else
    printf("u_beat,%f\n", beat_value);
    #endif
		usleep(BEAT_DELAY);
  }
}

