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
#include <argp.h>

#include "arguments.h"
#include "audio.h"
#include "beat.h"
#include "midi.h"
#include "dir_rotator.h"

#define MAIN_DELAY 100000
#define DEBUG true

//#define ENABLE_AUDIO
//#define ENABLE_BEAT
//#define ENABLE_MIDI

const char *argp_program_version = "uniform.c 0.1";

static char doc[] = "Uniform.c - a program to wrap glslViewer with various weird features";
static char args_doc[] = "";

static struct argp_option options[] = {
  {"verbose",  'v', 0,      0,  "Produce verbose output" },
  {"quiet",    'q', 0,      0,  "Don't produce any output" },
  {"silent",   's', 0,      OPTION_ALIAS },
  {"dir",      'd', "DIR",  0,  "Rotate through a directory" },
  {"rotation-speed", 'r', "S", 0, "Rotation speed in seconds" },
  {"bpm",      'b', "BPM",  0,  "Set a starting bpm value" },
  { 0 }
};

static error_t
parse_opt (int key, char *arg, struct argp_state *state)
{
  /* Get the input argument from argp_parse, which we
     know is a pointer to our arguments structure. */
  struct arguments *arguments = state->input;

  switch (key)
    {
    case 'q': case 's':
      arguments->silent = 1;
      break;
    case 'v':
      arguments->verbose = 1;
      break;
    case 'd':
      arguments->dir = arg;
      break;
    case 'r':
      arguments->rotation_speed = strtol(arg, NULL, 10);
      break;
    case 'b':
      arguments->bpm = strtof(arg, NULL);
      break;

    case ARGP_KEY_ARG:
      if (state->arg_num >= 1)
        /* Too many arguments. */
        argp_usage (state);

      //arguments->args[state->arg_num] = arg;

      break;

    case ARGP_KEY_END:
      if (state->arg_num < 0)
        /* Not enough arguments. */
        argp_usage (state);
      break;

    default:
      return ARGP_ERR_UNKNOWN;
    }
  return 0;
}

static struct argp argp = { options, parse_opt, args_doc, doc };

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


int main(int argc, char **argv) {
  setbuf(stdout, NULL);
  terminal_init();
	pulseaudio_begin("nothing");

  struct arguments arguments;

  /* Default values. */
  arguments.silent = 0;
  arguments.verbose = 0;
  arguments.bpm = 120.0;
  arguments.dir = "";
  arguments.rotation_speed = 30;

  argp_parse(&argp, argc, argv, 0, 0, &arguments);

  set_bpm(arguments.bpm);

  struct timeval t1, t2, w1, w2, dt;
  int64_t microseconds;
  char input;

  // TODO: Allow defining multiple LFO threads from args?
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

  if (strlen(arguments.dir) > 0) {
		pthread_t dir_thread;
		pthread_create(&dir_thread, NULL, dir_rotator, (void*) &arguments);
	}

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
