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

- [20180314](shows/20180314) - Disaster Passport @ High Noon Saloon
- [20180226](shows/20180226) - Drug Spider, Corridore, Dystopian Echo @ High Noon Saloon
- [20180202](shows/20180202) - And Illusions, IE, Louise Bock @ Williamson Magnetic Co.
- [20180114](shows/20180114) - Julian Lynch and Emili Earhart, Harper, Sleep Now Forever @ Williamson Magnetic Co.
- [20171114](shows/20171114) - Sleep Now Forever, Ada Babar, BLank, Emili Earhart @ Williamson Magnetic Co.
- [20170828](shows/20170828) - Judders, Cut Shutters, And Illusions @ Arts + Literature Laboratory
- [20170602](shows/20170602) - And Illusions, Pat Keen, Tippy @ Arts + Literature Laboratory
- [20170504](shows/20170504) - Glassmen, Maniac du Jour, Twelves @ Williamson Magnetic Co.

## Tools used:

- [glslViewer](https://github.com/patriciogonzalezvivo/glslViewer) for compile/display
- [vim](http://www.vim.org/) for quick editing
- My crappy uniform.c for tap tempo, audio, and MIDI input
  - You will need libpulse-dev or equivalent package to use this
  - I have no idea how to make this compile on OSX or Windows, sorry

## TODO

- mouse for dimming/amp adjust?
- vim macro improvements
  - "shader" mode, where binds become easier to hit until ESC
  - quick tints
  - quick undo N changes and save 
- uniform.c support for more things
  - random-er "glitch" mode
  - make it a real LFO
    - allow different wave shapes: sine, tri, saw
    - allow "bending" the wave toward early or late
- other ideas
  - stark masking
  - work from tiling example
  - work from organic fog example

## Misc 

[This garbage is licensed under the MIT license.](LICENSE)

