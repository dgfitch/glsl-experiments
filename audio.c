#include <stdio.h>
#include <errno.h>
#include <string.h>
#include <stddef.h>
#include <unistd.h>
#include <math.h>
#include <pulse/simple.h>
#include <pulse/error.h>

#define BUFSIZE 32

//#define RATE 44100
#define RATE 16000

#define DELAY 100
#define SCALE BUFSIZE * 256

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


int main() {
	int result;
  float bpm = 120.0;
  float bpus = 100000.0 / (bpm / 60.0);
  int count_beat = 0;
  float beat = 1.0;

	pulseaudio_begin("nothing");

	while(1) {
		pulseaudio_read(buffer, 32);
    flush();

		// TODO: average the array or do smart falloff of some kind

		result = 0;
		for(int i = 0; i < 32; i++) {
			result += abs(buffer[i]);
		}
		result /= SCALE;

    // Hack-ass beat tap tempo
    beat *= 0.98;
    count_beat += DELAY;
    if (count_beat >= bpus) {
      beat = 1.0;
      count_beat = 0;
    }

		printf("u_amp,%i\n", abs(result));
		printf("u_beat,%f\n", beat);

		usleep(DELAY);
	}

	finish:
	pulseaudio_end();

	return 0;
}
