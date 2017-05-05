import time
import math

def main():
    count = 0.0
    while True:
        count += 1
        sample = math.sin(count / 30.0) * 10.0 + 10.0
        print 'u_amp,%d' % (sample)
        time.sleep(0.03)


if __name__ == '__main__':
    main()
