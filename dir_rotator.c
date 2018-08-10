#include <stdio.h>
#include <sys/types.h>
#include <dirent.h>
#include <stddef.h>
#include <unistd.h>
#include <stdlib.h>
#include <signal.h>
#include <math.h>
#include <string.h>

#include "arguments.h"

struct frag_files {
  char *dirpath;
  struct dirent **eps;
  int count;
};

int
string_ends_with(const char * str, const char * suffix) {
  int str_len = strlen(str);
  int suffix_len = strlen(suffix);

  return 
    (str_len >= suffix_len) &&
    (0 == strcmp(str + (str_len-suffix_len), suffix));
}

static int
frag (const struct dirent *x)
{
	// Check if file ends in frag
  return string_ends_with(x->d_name, ".frag");
}

void
scan_directory(struct frag_files *state) {
#if DEBUG
  fprintf(stderr, "Scanning for fragment files at path %s\n", state->dirpath);
#endif

  state->count = scandir (state->dirpath, &state->eps, frag, alphasort);

  if (state->count <= 0) {
    perror ("Couldn't open the directory or no frag files");
  } else {
#if DEBUG
    fprintf(stderr, "Found %i fragment files\n", state->count);
#endif
	}
  return;
}

void*
dir_rotator(void* in) {
  struct arguments *arg = (struct arguments*) in;

  struct frag_files state = {
    .dirpath = arg->dir
  };

  int current = 0;
  char * file;
  char command[300];
	while(1) {
    scan_directory(&state);
    if (current >= state.count) {
      current = 0;
    }

    file = state.eps[current]->d_name;

    snprintf(command, sizeof(command), "cp %s/%s current/active.frag", state.dirpath, file);
    fprintf(stderr, "Switching to file %s\n", file);
    system(command);

		sleep(arg->rotation_speed);
    current++;
  }

  return 0;
}
