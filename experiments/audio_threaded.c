#include <stdio.h>
#include <string.h>
#include <assert.h>
#include <pulse/pulseaudio.h>

// TODO - yet to port
#define BUFSIZE 1024
#define SOURCE_NAME "cras-source" // edit to match your source
#define METER_RATE 60
#define MAX_SAMPLE_VALUE 127
#define DEBUG 0
#define SMOOTH 0

#define FORMAT PA_SAMPLE_U8
#define RATE 44100

void context_state_cb(pa_context* context, void* mainloop);
void source_info_cb(pa_context *context, const pa_source_info *i, int eol, void *userdata);
void stream_read_callback(pa_stream *s, size_t length, void *userdata);

typedef struct pa_devicelist {
        uint8_t initialized;
        char name[512];
        uint32_t index;
        char description[256];
} pa_devicelist_t;

int main(int argc, char *argv[]) {
    pa_threaded_mainloop *mainloop;
    pa_mainloop_api *mainloop_api;
    pa_context *context;

    // Get a mainloop and its context
    mainloop = pa_threaded_mainloop_new();
    assert(mainloop);
    mainloop_api = pa_threaded_mainloop_get_api(mainloop);
    context = pa_context_new(mainloop_api, "c_peak_demo");
    assert(context);

    // Set a callback so we can wait for the context to be ready
    pa_context_set_state_callback(context, &context_state_cb, mainloop);

    // Lock the mainloop so that it does not run and crash before the context is ready
    pa_threaded_mainloop_lock(mainloop);

    // Start the mainloop
    assert(pa_threaded_mainloop_start(mainloop) == 0);
    assert(pa_context_connect(context, NULL, PA_CONTEXT_NOAUTOSPAWN, NULL) == 0);

		printf("Started mainloop\n");

    // Wait for the context to be ready
    while(1) {
				printf("Checking context state\n");
        pa_context_state_t context_state = pa_context_get_state(context);
        assert(PA_CONTEXT_IS_GOOD(context_state));
        if (context_state == PA_CONTEXT_READY) break;
        pa_threaded_mainloop_wait(mainloop);
    }

		printf("Context ready\n");
		printf("Running op\n");

		pa_operation *op;
		pa_devicelist_t input[16];
	  memset(input, 0, sizeof(pa_devicelist_t) * 16);
		op = pa_context_get_source_info_list(context, &source_info_cb, input);
		pa_operation_unref(op);
		printf("Waiting\n");

    // Go until we get a character
    getc(stdin);
		return(0);
}

void context_state_cb(pa_context* context, void* mainloop) {
    pa_threaded_mainloop_signal(mainloop, 0);
}

void source_info_cb(pa_context *context, const pa_source_info *i, int eol, void *userdata) {
		if (i->name == SOURCE_NAME) {
				static const pa_sample_spec ss = {
						.format = PA_SAMPLE_U8,
						.rate = RATE,
						.channels = 1
				};
				pa_stream *stream = NULL;
				stream = pa_stream_new(context, "peak detect demo", &ss, NULL);
			  const int *index = &(i->index);
			  pa_stream_set_read_callback(stream, &stream_read_callback, &index);
				pa_stream_connect_record(stream, NULL, NULL, PA_STREAM_PEAK_DETECT);
		}
}

void stream_read_callback(pa_stream *s, size_t length, void *userdata) {
    const void *data;
    assert(s);
    assert(length > 0);
		pa_stream_peek(s, &data, &length);

    assert(s);
    assert(length > 0);

		// TODO - do something with data
		printf("Data is %p", data);

		pa_stream_drop(s);
}

