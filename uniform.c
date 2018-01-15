/*
 * uniform.c
 *
 * A truly stupid way to generate and pipe values
 * into glslViewer.
 *
 * Current features:
 *
 * - u_beat from tapping inputs
 *    - Hit ENTER 4 times to set tempo
 *    - Hit [ or h to halve
 *    - Hit ] or l to double
 *    - Hit + or k to increase
 *    - Hit - or j to decrease
 *
 * - u_amp from audio amplitude (crappy but working)
 *
 */

#include <stdio.h>
#include <errno.h>
#include <string.h>
#include <stddef.h>
#include <stdint.h>
#include <unistd.h>
#include <stdlib.h>
#include <math.h>
#include <sys/time.h>
#include <pthread.h>
#include <termios.h>
#include <assert.h>
#include "audio.h"
#include "midi.h"

#define BEAT_DELAY 40000
#define MAIN_DELAY 100000
//#define DEBUG

#define ENABLE_AUDIO
#define ENABLE_BEAT
#define ENABLE_MIDI


// Beat tracking
float bpm;
float uspb;



float calc_uspb(float bpm) {
  return 1000000.0 / (bpm / 60.0);
}

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
		usleep(BEAT_DELAY);
  }
}


// Stupid terminal hacking
struct termios org_opts, new_opts;

void terminal_init(void) {
  int res=0;
  //-----  store old settings -----------
  res=tcgetattr(STDIN_FILENO, &org_opts);
  assert(res==0);
  //---- set new terminal parms --------
  memcpy(&new_opts, &org_opts, sizeof(new_opts));
  new_opts.c_lflag &= ~(ICANON | ECHO | ECHOE | ECHOK | ECHONL | ECHOPRT | ECHOKE | ICRNL);
  tcsetattr(STDIN_FILENO, TCSANOW, &new_opts);
}

void terminal_shutdown(void) {
  int res=0;
  res=tcsetattr(STDIN_FILENO, TCSANOW, &org_opts);
  assert(res==0);
}



int main() {
  setbuf(stdout, NULL);
  terminal_init();
	pulseaudio_begin("nothing");

  // beats per minute
  bpm = 120.0;
  // microseconds per beat
  uspb = calc_uspb(bpm);

  struct timeval t1, t2, w1, w2, dt;
  int64_t microseconds;
  char input;

  #if DEBUG
  printf("starting uspb: %f\n", uspb);
  #endif

  #ifdef ENABLE_BEAT
  pthread_t beat_thread;
  pthread_create(&beat_thread, NULL, beater, NULL);
  #endif

  #ifdef ENABLE_AUDIO
  pthread_t audio_thread;
  pthread_create(&audio_thread, NULL, amplitude, NULL);
  #endif

  #ifdef ENABLE_MIDI
  pthread_t midi_thread;
  pthread_create(&midi_thread, NULL, midi, NULL);
  #endif

	while(1) {
    start:
    input = getchar();
    switch (input) {
      // Left bracket or h halves tempo
      case 91:
      case 104:
        uspb *= 2.0;
        break;

      // Right bracket or l doubles tempo
      case 93:
      case 108:
        uspb /= 2.0;
        break;

      // Backslash resets tempo to default
      case 92:
        uspb = calc_uspb(bpm);
        break;

      // Tap tempo with enter
      case 10:
        gettimeofday(&t1, NULL);
        for(int i=0; i<3; i++) {
          gettimeofday(&w1, NULL);
          getchar();
          gettimeofday(&w2, NULL);
          timersub(&w2, &w1, &dt);
          if (dt.tv_sec > 2.0) {
            // eeeeeevilllll jumps
            goto start;
          }
        }
        gettimeofday(&t2, NULL);
        timersub(&t2, &t1, &dt);
        microseconds = dt.tv_sec * 1000000 + dt.tv_usec;

        // we take 4 taps
        uspb = microseconds / 3.0;
    }

    #ifdef DEBUG
    printf("uspb is %f\n", uspb);
    #endif
		usleep(MAIN_DELAY);
	}

  finally:
  terminal_shutdown();
	return 0;
}
