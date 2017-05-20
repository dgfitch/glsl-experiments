/*
 * beat.c
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
#include <pulse/simple.h>
#include <pulse/error.h>
#include <pthread.h>
#include <termios.h>
#include <assert.h>

#define BUFSIZE 32
#define RATE 1000
#define AUDIO_DELAY 4000
#define BEAT_DELAY 40000
#define MAIN_DELAY 100000
//#define DEBUG

// For debugging peak levels
//#define PEAK

// Beat tracking
float bpm;
float uspb;

// Audio tracking
int16_t buffer[BUFSIZE];

static pa_simple *s = NULL;
static char name_buf[] = "PulseAudio default device";

int pulseaudio_standby(int sfreq, void *dummy) {
  return 0;
}
 
int pulseaudio_begin(char *arg) {
  int error;

  static const pa_sample_spec ss = {
  	.format = PA_SAMPLE_S16LE,
  	.rate = RATE,
  	.channels = 1
  };
  
  if (!(s = pa_simple_new(NULL, "Boguspath", PA_STREAM_RECORD, NULL, "record", &ss, NULL, NULL, &error))) {
    printf("Error: pulseaudio: pa_simple_new() failed: %s\n", pa_strerror(error));
    return 1;
  }
  return 0;
}

int pulseaudio_end() {
  if (s != NULL) {
    pa_simple_free(s);
    s = NULL;
  }
  return 0;
}

int pulseaudio_read (int16_t *buf, int sampnum) {
  int error;
  int cnt, bufsize;

  bufsize = sampnum * sizeof(int16_t);
  if (bufsize > BUFSIZE) bufsize = BUFSIZE;

  if (pa_simple_read(s, buf, bufsize, &error) < 0) {
        printf("Error: pa_simple_read() failed: %s\n", pa_strerror(error));
  }
  cnt = bufsize / sizeof(int16_t);
  return (cnt);
}

int flush() {
  int error;
  pa_simple_flush(s, &error);
}

void* amplitude(void* arg) {
	double result = 0.0;
	double last_result = 0.0;
  double peak = 0.0;

	while(1) {
		pulseaudio_read(buffer, 32);
    //flush();

		// TODO: better smart falloff or averaging
    // of some kind to deal with low-end noise

		result = 0;
		for(int i = 0; i < 32; i++) {
			result += abs(buffer[i]);
		}
    result /= BUFSIZE;
    result = log(result) / 10.0;
    if (result < 0.2) {
      result = result / 3.0;
    } else if (result < 0.4) {
      result = result / 2.0;
    }

    #ifdef PEAK
    if (result >= peak) {
      printf("New peak: %f\n", result);
      peak = result;
    }
    #else
      printf("u_amp,%f\n", result);
    #endif

		usleep(AUDIO_DELAY);
  }
}



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

  pthread_t beat_thread;
  pthread_create(&beat_thread, NULL, beater, NULL);

  pthread_t audio_thread;
  pthread_create(&audio_thread, NULL, amplitude, NULL);

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
