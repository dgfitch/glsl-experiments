/*
 * uniform.c
 *
 * A truly stupid way to generate and pipe values
 * into glslViewer.
 *
 * Current features:
 *
 * - u_beat from tapping inputs
 *    - ENTER 4 or more times to set tempo
 *    - [ or h to halve
 *    - ] or l to double
 *    - = or k to increase
 *    - - or j to decrease
 *    - p to saw down (classic!)
 *    - o to saw up
 *    - i to sine
 *    - u to triangle
 *
 * - u_amp from audio amplitude (crappy but working)
 *
 * - optional u_midi from midi driver
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
#include <stdbool.h>
#include "audio.h"
#include "beat.h"
#include "midi.h"

#define MAIN_DELAY 100000
#define DEBUG true

#define ENABLE_AUDIO
#define ENABLE_BEAT
//#define ENABLE_MIDI

// Stupid terminal hacking to be able to get raw input
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

  set_bpm(120.0);

  struct timeval t1, t2, w1, w2, dt;
  int64_t microseconds;
  char input;

  #ifdef ENABLE_BEAT
  pthread_t beat_thread;
  pthread_create(&beat_thread, NULL, beat, NULL);
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
    input = getchar();
    switch (input) {
      // p sets sawtooth down
      case 112:
        set_beat_type(1);
        break;

      // o sets sawtooth up
      case 111:
        set_beat_type(2);
        break;

      // i sets sine wave
      case 105:
        set_beat_type(3);
        break;

      // u sets triangle
      case 117:
        set_beat_type(4);
        break;

      // Left bracket or h halves tempo
      case 91:
      case 104:
        bpm_double();
        break;

      // Right bracket or l doubles tempo
      case 93:
      case 108:
        bpm_halve();
        break;

      // Minus or j decreases tempo
      case 61:
      case 106:
        bpm_decrease();
        break;

      // Equals or k increases tempo
      case 45:
      case 107:
        bpm_increase();
        break;

      // Backslash resets tempo to default
      case 92:
        bpm_default();
        break;

      // Tap tempo with enter
      case 10:
        gettimeofday(&t1, NULL);
        bool too_slow = 0;
        for(int i=0; i<3; i++) {
          gettimeofday(&w1, NULL);
          getchar();
          gettimeofday(&w2, NULL);
          timersub(&w2, &w1, &dt);
          if (dt.tv_sec > 2.0) {
            too_slow = true;
            break;
          }
        }
        if (!too_slow) {
          gettimeofday(&t2, NULL);
          timersub(&t2, &t1, &dt);
          microseconds = dt.tv_sec * 1000000 + dt.tv_usec;

          // we take 4 taps
          set_uspb(microseconds / 3.0);
        }
    }

		usleep(MAIN_DELAY);
	}

  terminal_shutdown();
	return 0;
}
