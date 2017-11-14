function! AutoCommit()
  call system('git rev-parse --git-dir > /dev/null 2>&1')
  if v:shell_error
    return
  endif
  let message = 'Updated ' . expand('%:.')
  call system('git add ' . expand('%:p'))
  call system('git commit -m ' . shellescape(message, 1))
endfun

"autocmd BufWritePost */git/glsl/* call AutoCommit()


function! SaveActive(...)
  write! ~/git/glsl/current/active.frag
endfunction

command! -nargs=+ SaveActive :call SaveActive(<q-args>)

nmap <Leader>q `QzOgc}:SaveActive()<CR>
nmap <Leader>w `WzOgc}:SaveActive()<CR>
nmap <Leader>e `EzOgc}:SaveActive()<CR>
nmap <Leader>r `RzOgc}:SaveActive()<CR>

nmap <Leader>y `Y:SaveActive()<CR>
nmap <Leader>u `U:SaveActive()<CR>
nmap <Leader>i `I:SaveActive()<CR>
nmap <Leader>p `P:SaveActive()<CR>

nmap <Leader>b /\/\/ BEAT<CR>gc}:SaveActive()<CR>``
nmap <Leader>a /\/\/ AMP<CR>gc}:SaveActive()<CR>``
nmap <Leader>t /\/\/ TIME<CR>gc}:SaveActive()<CR>``
nmap <Leader>o /\/\/ OPTION<CR>gc}:SaveActive()<CR>``

nmap <Leader><CR> gc}:SaveActive()<CR>
nmap <Leader><Backspace> gcc:SaveActive()<CR>
vmap <Leader><CR> gc:SaveActive()<CR>
vmap <Leader><Backspace> gc:SaveActive()<CR>

nnoremap <Leader><Leader> :SaveActive()<CR>
nnoremap <Leader>[ u:SaveActive()<CR>
nnoremap <Leader>] <C-R>:SaveActive()<CR>

inoremap <Leader><Leader> <Esc>:SaveActive()<CR>i

