# GLSL Lighting Experiments

Work in progress.

The main tool I'm using is [uniform.c](uniform.c), which pipes a tap-tempo
`u_beat` uniform and an audio amplitude `u_amp` amplitude into 
glslViewer.

If you want to learn how to use this stuff, or how GLSL works, I recommend 
[The Book of Shaders](https://thebookofshaders.com/) where you can learn and 
experiment right in your browser. (Chrome probably works best?) 
[Gibber](http://gibber.cc/) is also a whole bundle of fun, only a browser 
needed to learn GLSL and make generative music along with it.

## Shows

- [20170504](shows/20170504) - Glassmen, Maniac du Jour, Twelves @ Williamson Magnetic Co.
- [20170602](shows/20170602) - And Illusions, Pat Keen, Tippy @ Arts + Literature Laboratory

## Tools used:

- [glslViewer](https://github.com/patriciogonzalezvivo/glslViewer) for compile/display
- [vim](http://www.vim.org/) for quick editing
- My crappy uniform.c for tap tempo and audio input
  - You will need libpulse-dev or equivalent package to use this
  - I have no idea how to make this compile on OSX or Windows, sorry

## TODO

- xmodmap or autokey binding stuff 
  - chromebook function keys 
  - capslock combos?
    - `setxkbmap -option caps:escape`
- vim macro improvements
  - quick tints
  - quick undo N changes and save 
  - imap equivalents so no need to swap out of insert mode
- it would be cool to keep revision history of evolution through a set in realtime 
  - git autocommit works but is kind of clumsy
- uniform.c support for more things
  - random-er "glitch" mode
  - make it a real LFO
    - allow different wave shapes: sine, tri, saw
    - allow "tipping" the wave toward early or late
  - MIDI input
    - sudo aconnect -i
    - sudo aseqdump -p <PORT>

## Misc 

[This garbage is licensed under the MIT license.](LICENSE)

