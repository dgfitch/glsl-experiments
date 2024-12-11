# Pass a directory of fragment files, e.g. shows/2018/0810/threadmaker
make && ./bin/uniform -d $1 -r 10 | glslViewer --nocursor --noncurses --audio 1 current/active.frag
