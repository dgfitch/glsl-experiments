# GLSL Lighting Experiments

A work in progress for realtime livecoding visuals in raw GLSL.

The main tool I'm using is [uniform.c](uniform.c), which pipes a tap-tempo
`u_beat` uniform and an audio amplitude `u_amp` amplitude into 
glslViewer.

If you want to learn how to use this stuff, or how GLSL works, I recommend 
[The Book of Shaders](https://thebookofshaders.com/) where you can learn and 
experiment right in your browser. (Chrome probably works best?) 
[Gibber](http://gibber.cc/) is also a whole bundle of fun, only a browser 
needed to learn GLSL and make generative music along with it.

## Shows

- [20181201](shows/2018/1201) - Algorave w/ Tarek Sabbar @ Communication
- [20181120](shows/2018/1120) - Yellowstone Apocalypse, Tubal Cain, Threadmaker @ Communication
- [20181005](shows/2018/1005) - Combat Naps, David Poole, Seal Eggs, Lynch / Earhart / Bible @ Communication
- [20180823](shows/2018/0823) - Asumaya, Lamon Manuel, Skech185 @ Communication
- [20180810](shows/2018/0810) - Rox Lee, Gentle Leader XIV, Threadmaker @ Communication
- [20180622](shows/2018/0622) - Cap Alan, Brekher / Lynch / Rodriguez, DB Pedersen as TBA @ Communication
- [20180530](shows/2018/0530) - Louise Bock, Ka Baird @ Communication
- [20180413](shows/2018/0413) - Drug Spider, Cribshitter, Labrador, L.A. Manatee @ Art In
- [20180314](shows/2018/0314) - Disaster Passport @ High Noon Saloon
- [20180226](shows/2018/0226) - Drug Spider, Corridore, Dystopian Echo @ High Noon Saloon
- [20180202](shows/2018/0202) - And Illusions, IE, Louise Bock @ Williamson Magnetic Co.
- [20180114](shows/2018/0114) - Julian Lynch and Emili Earhart, Harper, Sleep Now Forever @ Williamson Magnetic Co.
- [20171114](shows/2017/1114) - Sleep Now Forever, Ada Babar, BLank, Emili Earhart @ Williamson Magnetic Co.
- [20170828](shows/2017/0828) - Judders, Cut Shutters, And Illusions @ Arts + Literature Laboratory
- [20170602](shows/2017/0602) - And Illusions, Pat Keen, Tippy @ Arts + Literature Laboratory
- [20170504](shows/2017/0504) - Glassmen, Maniac du Jour, Twelves @ Williamson Magnetic Co.

## Tools used:

- [glslViewer](https://github.com/patriciogonzalezvivo/glslViewer) for compile/display
- [vim](http://www.vim.org/) for quick editing
- My crappy uniform.c for tap tempo, audio, and MIDI input
  - You will need libpulse-dev or equivalent package to use this
  - I have no idea how to make this compile on OSX or Windows, sorry

## TODO

- batch automation mode
  - find a decent args parser? or use a json format or something?
  - maintain active.frag from uniform.c, pass in directory to rotate through, alpha sort or random
  - external sourced measure-scale uniform values that uniform.c can control with beat * 4 lfo... section-scale that's measure*4
- vim macro improvements
  - "shader" mode, where binds become easier to hit until ESC
  - tmux "swap to beat" things
- uniform.c support for more things
  - amplitude FFT for hi/lo amplitude peaks (test if laptop speaker good enough)
  - LFO mods
    - allow "firing" the LFO in a really slow 10-30s fade
    - allow "bending" the wave toward early or late
    - allow beat multiplier "patterns" like 4 normal beats and one that is 4 times as long
- other ideas
  - spirograph style
  - stark masking
  - work from tiling example
  - work from organic fog example
  - `u_mouse` for dimming/amp adjust?
  - mess with `u_time` in more ways
    - sine wave
    - add beat

## Misc 

[This garbage is licensed under the MIT license.](LICENSE)

