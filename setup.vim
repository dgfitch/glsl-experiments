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

nnoremap <Leader>o `O:SaveActive()<CR>
nnoremap <Leader>p `P:SaveActive()<CR>
nmap <Leader>b /\/\/ BEAT<CR>gc}:SaveActive()<CR>``
nmap <Leader>a /\/\/ AMP<CR>gc}:SaveActive()<CR>``
nmap <Leader>t /\/\/ TIME<CR>gc}:SaveActive()<CR>``
nnoremap <Leader><Leader> :SaveActive()<CR>
nnoremap <Leader>[ u:SaveActive()<CR>
nnoremap <Leader>] <C-R>:SaveActive()<CR>
nnoremap <Leader><Space> <C-W><C-P>:SaveActive()<CR>

inoremap <Leader><Leader> <Esc>:SaveActive()<CR>i

