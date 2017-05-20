// attempt to read out from pulseaudio source and turn into uniform CSV for glslViewer

#include <stdio.h>
#include <errno.h>
#include <string.h>
#include <stddef.h>
#include <unistd.h>
#include <stdlib.h>
#include <math.h>
#include <pulse/simple.h>
#include <pulse/error.h>
#include <pthread.h>

#define BUFSIZE 32

//#define RATE 44100
#define RATE 1000

#define DELAY 4000

// For debugging peak levels
//#define PEAK


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

float calc_bpus(float bpm) {
  return 1000000.0 / (bpm / 60.0);
}


int main() {
  setbuf(stdout, NULL);
  setbuf(stdin, NULL);

	double result = 0.0;
	double last_result = 0.0;
  double peak = 0.0;

	pulseaudio_begin("nothing");

	while(1) {
		pulseaudio_read(buffer, 32);
    //flush();

		// TODO: do smart falloff or averaging
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

		usleep(DELAY);
	}

	finish:
	pulseaudio_end();

	return 0;
}
