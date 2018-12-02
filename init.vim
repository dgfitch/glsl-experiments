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
  write!
  write! ~/git/glsl/current/active.frag
  "call AutoCommit()
endfunction

command! -nargs=+ SaveActive :call SaveActive(<q-args>)

nmap <Leader>q `QzOgc}:SaveActive()<CR>
nmap <Leader>w `WzOgc}:SaveActive()<CR>

nmap <Leader>y `Y:SaveActive()<CR>
nmap <Leader>u `U:SaveActive()<CR>
nmap <Leader>i `I:SaveActive()<CR>
nmap <Leader>p `P:SaveActive()<CR>

nmap <Leader>b /\/\/ BEAT<CR>gc}:SaveActive()<CR>``
nmap <Leader>a /\/\/ AMP<CR>gc}:SaveActive()<CR>``
nmap <Leader>t /\/\/ TIME<CR>gc}:SaveActive()<CR>``
nmap <Leader>o /\/\/ OPTION<CR>gc}:SaveActive()<CR>``
nmap <Leader>x /\/\/ SYM X<CR>gc}:SaveActive()<CR>``
nmap <Leader>z /\/\/ SYM Y<CR>gc}:SaveActive()<CR>``
nmap <Leader>r /\/\/ ROTATE BEFORE<CR>gc}:SaveActive()<CR>``
nmap <Leader>e /\/\/ ROTATE AFTER<CR>gc}:SaveActive()<CR>``

nmap <Leader>j <C-x>:SaveActive()<CR>
nmap <Leader>k <C-a>:SaveActive()<CR>

nmap <Leader><CR> gc}:SaveActive()<CR>
nmap <Leader><Backspace> gcc:SaveActive()<CR>
vmap <Leader><CR> gc:SaveActive()<CR>
vmap <Leader><Backspace> gc:SaveActive()<CR>

nnoremap <Leader><Leader> :SaveActive()<CR>
nnoremap <Leader>[ u:SaveActive()<CR>
nnoremap <Leader>] <C-R>:SaveActive()<CR>

inoremap <Leader><Leader> <Esc>:SaveActive()<CR>i

let s:hidden_all = 0
function! ToggleHiddenAll()
    if s:hidden_all  == 0
        let s:hidden_all = 1
        set noshowmode
        set noruler
        set laststatus=0
        set noshowcmd
    else
        let s:hidden_all = 0
        set showmode
        set ruler
        set laststatus=2
        set showcmd
    endif
endfunction

nnoremap <S-h> :call ToggleHiddenAll()<CR>
