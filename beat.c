/*
 * beat.c
 *
 * A truly stupid way to generate and pipe values
 * into glslViewer.
 *
 * Current features:
 * - beat uniform from tapping inputs
 *
 */

#include <stdio.h>
#include <errno.h>
#include <string.h>
#include <stddef.h>
#include <stdint.h>
#include <unistd.h>
#include <math.h>
#include <sys/time.h>
#include <pthread.h>

#define DELAY 40000
//#define DEBUG



float calc_uspb(float bpm) {
  return 1000000.0 / (bpm / 60.0);
}

float bpm;
float uspb;

void* beater(void* arg) {
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
    #else
    printf("u_beat,%f\n", beat_value);
    #endif
		usleep(DELAY);
  }
}

int main() {
  setbuf(stdout, NULL);

  bpm = 120.0;
  // microseconds per beat
  uspb = calc_uspb(bpm);

  struct timeval t1, t2, w1, w2, dt;
  int64_t microseconds;

  #if DEBUG
  printf("starting uspb: %f\n", uspb);
  #endif

  pthread_t thread;
  pthread_create(&thread, NULL, beater, NULL);

	while(1) {
    start:
    getchar();
    // TODO: diff chars how?

    gettimeofday(&t1, NULL);
    for(int i=0; i<3; i++) {
      gettimeofday(&w1, NULL);
      getchar();
      gettimeofday(&w2, NULL);
      timersub(&w2, &w1, &dt);
      if (dt.tv_sec > 2.0) {
        goto start;
      }
    }
    gettimeofday(&t2, NULL);
    timersub(&t2, &t1, &dt);
    microseconds = dt.tv_sec * 1000000 + dt.tv_usec;

    // we take 4 taps
    uspb = microseconds / 3.0;
    #ifdef DEBUG
    printf("uspb is now %f\n", uspb);
    #endif

		usleep(DELAY);
	}

	return 0;
}
