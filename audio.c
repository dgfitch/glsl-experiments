#include <stdio.h>
#include <stddef.h>
#include <unistd.h>
#include <stdlib.h>
#include <math.h>
#include <pulse/simple.h>
#include <pulse/error.h>

#define BUFSIZE 32
#define RATE 1000
#define AUDIO_DELAY 4000
// How fast is dropoff?
#define START_SLANT 0.001
// How fast is max dropoff?
#define MAX_SLANT 0.05
// How fast should we ramp up?
#define MAX_ACCEL 0.08
// What minimum floor should we ignore?
#define NOISE_FLOOR 0.15

// For outputting peak levels instead of exact current amplitude
#define PEAK true

// Audio buffer tracking
int16_t buffer[BUFSIZE];

static pa_simple *s = NULL;

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

/* Ended up not needing to do this? */
/*
int flush() {
  int error;
  pa_simple_flush(s, &error);
}
*/

void* amplitude(void* arg) {
	double result = 0.0;
  int time_since_peak = 0;
  double peak = 0.0;
  double slant = 0.0;
  double remaining = 0.0;

	while(1) {
		pulseaudio_read(buffer, 32);

		result = 0;
		for(int i = 0; i < 32; i++) {
			result += abs(buffer[i]);
		}
    result /= BUFSIZE;
    result = log(result);
    result /= 4.5;
    result -= 1.0;

    #ifdef PEAK
    if (result >= peak && result >= NOISE_FLOOR) {
      if (peak + MAX_ACCEL > result) {
        peak += MAX_ACCEL;
        remaining = result - MAX_ACCEL;
      } else {
        peak = result;
      }
      time_since_peak = 0;
    } else if (remaining > 0.0) {
      peak += MAX_ACCEL;
      remaining -= MAX_ACCEL;
    } else {
      time_since_peak += 1;
      if (peak < 0.0) {
        peak = 0.0;
      } else {
        slant = peak * START_SLANT * time_since_peak;
        if (slant >= MAX_SLANT) {
          slant = MAX_SLANT;
        }
        peak -= slant;
      }
    }
    printf("u_amp,%f\n", peak);
    #else
    printf("u_amp,%f\n", result);
    #endif

		usleep(AUDIO_DELAY);
  }
}

