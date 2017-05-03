#include <stdio.h>
#include <math.h>

#define PI 3.14159265

int main ()
{
  double count, val;

  count = 0;
	while(1) {
    count++;
		val = sin(count / 30.0) * 10.0 + 10.0;
		printf("u_amp,%lf\n", val);
	}
   
	return(0);
}
