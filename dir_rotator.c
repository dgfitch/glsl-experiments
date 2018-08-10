#include <stdio.h>
#include <sys/types.h>
#include <dirent.h>
#include <stddef.h>
#include <unistd.h>
#include <stdlib.h>
#include <signal.h>
#include <math.h>
#include <string.h>

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

void*
dir_rotator(void* arg) {
  char *dirpath = (char*) arg;
  struct dirent **eps;
  int n;

  fprintf(stderr, "Scanning for fragment files at path %s\n", dirpath);
  n = scandir (dirpath, &eps, frag, alphasort);
  fprintf(stderr, "Found %i fragment files\n", n);

  int current = 0;

  if (n <= 0) {
    perror ("Couldn't open the directory or no frag files");
	}

  char * file;
  char command[300];
	while(1) {
    if (current >= n) {
      current = 0;
    }

    file = eps[current]->d_name;

    snprintf(command, sizeof(command), "cp %s/%s current/active.frag", dirpath, file);
    fprintf(stderr, "Switching to file %s using command %s\n", file, command);
    system(command);

		sleep(10);
    current++;
  }

  return 0;
}
