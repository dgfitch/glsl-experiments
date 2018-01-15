#include <stdio.h>
#include <stddef.h>
#include <unistd.h>
#include <stdlib.h>
#include <signal.h>
#include <math.h>
#include <alsa/asoundlib.h>

#define MIDI_DELAY 10000

static snd_seq_t *seq;
static int port_count;
static snd_seq_addr_t *ports;

/* A bunch of crap taken from aseqdump.c */

static void fatal(const char *msg, ...)
{
  va_list ap;

  va_start(ap, msg);
  vfprintf(stderr, msg, ap);
  va_end(ap);
  fputc('\n', stderr);
  exit(EXIT_FAILURE);
}

/* memory allocation error handling */
static void check_mem(void *p)
{
    if (!p)
          fatal("Out of memory");
}

/* error handling for ALSA functions */
static void check_snd(const char *operation, int err)
{
    if (err < 0)
          fatal("Cannot %s - %s", operation, snd_strerror(err));
}

static void init_seq(void)
{
  int err;

  /* open sequencer */
  err = snd_seq_open(&seq, "default", SND_SEQ_OPEN_DUPLEX, 0);
  check_snd("open sequencer", err);

  /* set our client's name */
  err = snd_seq_set_client_name(seq, "uniform");
  check_snd("set client name", err);
}

static void parse_ports(const char *arg)
{
	char *buf, *s, *port_name;
	int err;

	/* make a copy of the string because we're going to modify it */
	buf = strdup(arg);
	check_mem(buf);

	for (port_name = s = buf; s; port_name = s + 1) {
		/* Assume that ports are separated by commas.  We don't use
		 * spaces because those are valid in client names. */
		s = strchr(port_name, ',');
		if (s)
			*s = '\0';

		++port_count;
		ports = realloc(ports, port_count * sizeof(snd_seq_addr_t));
		check_mem(ports);

		err = snd_seq_parse_address(seq, &ports[port_count - 1], port_name);
		if (err < 0)
			fatal("Invalid port %s - %s", port_name, snd_strerror(err));
	}

	free(buf);
}

static void create_port(void) {
  int err;

  err = snd_seq_create_simple_port(seq, "uniform",
        SND_SEQ_PORT_CAP_WRITE |
        SND_SEQ_PORT_CAP_SUBS_WRITE,
        SND_SEQ_PORT_TYPE_MIDI_GENERIC |
        SND_SEQ_PORT_TYPE_APPLICATION);
  check_snd("create port", err);
}

static void connect_ports(void)
{
	int i, err;

	for (i = 0; i < port_count; ++i) {
		err = snd_seq_connect_from(seq, 0, ports[i].client, ports[i].port);
		if (err < 0)
			fatal("Cannot connect from port %d:%d - %s",
			      ports[i].client, ports[i].port, snd_strerror(err));
	}
}

/* Now the real workhorse to dump midi to uniforms */

static void dump_event(const snd_seq_event_t *ev)
{
	switch (ev->type) {
	case SND_SEQ_EVENT_NOTEON:
		if (ev->data.note.velocity) {
			printf("u_midi_note,%f\n", ev->data.note.note / 2.0);
			printf("u_midi_velocity,%f\n", ev->data.note.velocity / 127.0);
		} else {
			printf("u_midi_note,0.0\n");
			printf("u_midi_velocity,0.0\n");
		}
		break;
	case SND_SEQ_EVENT_NOTEOFF:
		printf("u_midi_velocity,0.0\n");
		break;
	case SND_SEQ_EVENT_KEYPRESS:
		printf("u_midi_note,%f\n", ev->data.note.note / 2.0);
		printf("u_midi_velocity,%f\n", ev->data.note.velocity / 127.0);
		break;
	case SND_SEQ_EVENT_CONTROLLER:
	case SND_SEQ_EVENT_CONTROL14:
		printf("u_midi_cc_%i,%f\n", ev->data.control.param, ev->data.control.value / 127.0);
		break;
	case SND_SEQ_EVENT_PGMCHANGE:
		printf("Program change         %2d, program %d\n",
		       ev->data.control.channel, ev->data.control.value);
		break;
	case SND_SEQ_EVENT_CHANPRESS:
		printf("Channel aftertouch     %2d, value %d\n",
		       ev->data.control.channel, ev->data.control.value);
		break;
	case SND_SEQ_EVENT_PITCHBEND:
		printf("u_midi_pitch,%f\n", (ev->data.control.value + 1.0) / 8192.0);
		break;
	case SND_SEQ_EVENT_SETPOS_TICK:
		break;
	case SND_SEQ_EVENT_SETPOS_TIME:
		break;
	case SND_SEQ_EVENT_TEMPO:
		break;
	case SND_SEQ_EVENT_CLOCK:
		break;
	case SND_SEQ_EVENT_TICK:
		break;
	case SND_SEQ_EVENT_QUEUE_SKEW:
		break;
	case SND_SEQ_EVENT_TUNE_REQUEST:
		break;
	case SND_SEQ_EVENT_RESET:
		break;
	case SND_SEQ_EVENT_SYSEX:
		{
			unsigned int i;
			printf("System exclusive          ");
			for (i = 0; i < ev->data.ext.len; ++i)
				printf(" %02X", ((unsigned char*)ev->data.ext.ptr)[i]);
			printf("\n");
		}
		break;
	}
}

/* And the startup thread function */

void* midi(void* arg) {
	double result = 0.0;
  int err;

  init_seq();
  create_port();
  parse_ports("24");
  connect_ports();

  err = snd_seq_nonblock(seq, 1);
  check_snd("set nonblock mode", err);

	struct pollfd *pfds;
	int npfds;

	npfds = snd_seq_poll_descriptors_count(seq, POLLIN);
	pfds = alloca(sizeof(*pfds) * npfds);

	while(1) {
    // TODO: What do I actually want to define for midi uniforms?
    //printf("u_midi,%f\n", result);

		snd_seq_poll_descriptors(seq, pfds, npfds, POLLIN);
		if (poll(pfds, npfds, -1) < 0)
			break;
		do {
			snd_seq_event_t *event;
			err = snd_seq_event_input(seq, &event);
			//if (err < 0)
			//	break;
			if (event)
				dump_event(event);
		} while (err > 0);

		usleep(MIDI_DELAY);
  }
}

