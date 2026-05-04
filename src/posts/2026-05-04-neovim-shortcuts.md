---
title: '두고두고 쓰는 Neovim 단축키 모음'
date: '2026-05-04'
tag: ['Neovim', 'Vim', '생산성']
---

## 개요

Neovim 을 일상 에디터로 쓰면서 "이건 진짜 매일 쓴다" 싶은 단축키만 추렸다. 모든 키를 외우려 하지 말고, 손에 익을 때까지 한 묶음씩 들고 다니면서 쓰는 게 빠르다.

표기는 다음 규칙을 따른다.

- `<C-x>`: Ctrl + x
- `<S-x>`: Shift + x
- `<leader>`: 리더 키 (보통 스페이스바)

## 이동: 페이지/단어 점프

화살표나 `hjkl` 한 칸씩 누르고 있는 시간을 줄이는 게 첫 번째 효율 향상이다.

| 단축키 | 동작 |
| --- | --- |
| `w` / `b` | 다음/이전 단어 시작으로 |
| `e` / `ge` | 다음/이전 단어 끝으로 |
| `0` / `^` / `$` | 줄 맨 앞 / 첫 글자 / 맨 뒤 |
| `gg` / `G` | 파일 맨 위 / 맨 아래 |
| `<C-u>` / `<C-d>` | 반 화면 위 / 아래 |
| `<C-o>` / `<C-i>` | 직전 위치로 / 다시 앞으로 (점프 히스토리) |
| `%` | 짝 괄호로 점프 |
| `*` / `#` | 커서 아래 단어와 같은 다음/이전 단어로 |

`<C-o>` 는 정의로 점프했다가 원래 위치로 돌아올 때 매일 쓴다. 외워두면 손해 안 본다.

## 줄 단위 이동: f / t / ;

한 줄 안에서 마우스로 클릭하던 동작을 대체한다.

| 단축키 | 동작 |
| --- | --- |
| `f{char}` | 줄 안에서 다음 `{char}` 위로 |
| `F{char}` | 줄 안에서 이전 `{char}` 위로 |
| `t{char}` | 다음 `{char}` 바로 앞으로 |
| `;` / `,` | 같은 검색 다음/이전 |

`dt,` (다음 콤마 직전까지 지우기) 같은 조합이 자연스러워지면 편집 속도가 한 번 더 도약한다.

## 편집: 텍스트 객체 (Text Objects)

Vim 의 진짜 무기. `{operator}{text-object}` 패턴으로 동작한다.

| 단축키 | 의미 |
| --- | --- |
| `iw` / `aw` | 단어 안 / 단어 + 공백 |
| `i"` / `a"` | 따옴표 안 / 따옴표 포함 |
| `i(` / `a(` | 괄호 안 / 괄호 포함 (`i)`, `i{`, `i[` 동일) |
| `it` / `at` | HTML/JSX 태그 안 / 태그 포함 |
| `ip` / `ap` | 문단 안 / 문단 포함 |

조합 예시:

- `ci"` : 따옴표 안 내용을 지우고 입력 모드 (Change Inside `"`)
- `da(` : 괄호와 안의 내용까지 통째로 삭제
- `yi}` : 중괄호 안 내용 yank
- `vit` : 태그 안 내용 비주얼 선택

이 패턴 하나로 "끝까지 화살표 눌러서 선택 → 지우기" 사이클이 사라진다.

## Undo / Redo / 반복

| 단축키 | 동작 |
| --- | --- |
| `u` / `<C-r>` | 실행 취소 / 다시 실행 |
| `.` | 직전 변경 반복 |
| `q{a-z}` ... `q` / `@{a-z}` | 매크로 녹화 / 실행 |
| `@@` | 마지막 매크로 다시 실행 |

`.` 는 "같은 편집을 여러 군데 반복"할 때 매크로보다 가볍게 쓸 수 있다. 검색 + `n` + `.` 조합이 의외로 강력하다.

## 검색·치환

| 단축키 / 명령 | 동작 |
| --- | --- |
| `/pattern` / `?pattern` | 정방향 / 역방향 검색 |
| `n` / `N` | 다음 / 이전 매치 |
| `:%s/old/new/g` | 파일 전체 치환 |
| `:%s/old/new/gc` | 매번 확인하며 치환 |
| `:s/old/new/g` | 현재 줄에서 치환 |
| `gd` / `gD` | 지역 / 전역 정의로 점프 |

비주얼 모드에서 영역을 잡고 `:s/old/new/g` 를 치면 선택 영역 안에서만 치환된다.

## 비주얼 모드

| 단축키 | 동작 |
| --- | --- |
| `v` / `V` / `<C-v>` | 문자 / 줄 / 블록 비주얼 |
| `gv` | 직전 비주얼 선택 영역 복원 |
| `o` | 비주얼 선택의 양 끝을 토글 |
| `>` / `<` | 들여쓰기 / 내어쓰기 |
| `=` | 자동 들여쓰기 정렬 |

블록 비주얼(`<C-v>`) + `I` 또는 `A` 조합은 여러 줄 시작/끝에 동일 텍스트를 한 번에 삽입할 때 쓰인다.

## 윈도우 / 버퍼 / 탭

여러 파일을 동시에 보는 작업이 잦다면 이 묶음이 가장 체감이 크다.

| 단축키 | 동작 |
| --- | --- |
| `<C-w>s` / `<C-w>v` | 가로 / 세로 분할 |
| `<C-w>h/j/k/l` | 분할창 간 이동 |
| `<C-w>=` | 분할창 크기 균등화 |
| `<C-w>q` | 현재 분할창 닫기 |
| `:bn` / `:bp` | 다음 / 이전 버퍼 |
| `:bd` | 버퍼 닫기 |
| `gt` / `gT` | 다음 / 이전 탭 |

분할창 사이 이동은 `<C-w>` 를 매번 누르기 번거로워서 보통 다음처럼 매핑해 둔다.

```lua
vim.keymap.set('n', '<C-h>', '<C-w>h')
vim.keymap.set('n', '<C-j>', '<C-w>j')
vim.keymap.set('n', '<C-k>', '<C-w>k')
vim.keymap.set('n', '<C-l>', '<C-w>l')
```

## LSP (코드 인텔리전스)

`nvim-lspconfig` 가 붙어 있다면 다음이 손에 익을수록 IDE 가 부럽지 않다.

| 단축키 | 동작 |
| --- | --- |
| `gd` | 정의로 점프 |
| `gr` | 참조 목록 |
| `gi` | 구현부로 점프 |
| `K` | hover 문서 |
| `<C-k>` (insert) | 시그니처 도움말 |
| `<leader>rn` | 심볼 이름 변경 |
| `<leader>ca` | 코드 액션 (자동 import, quick fix 등) |
| `[d` / `]d` | 이전 / 다음 진단(diagnostic) |

기본 매핑이 아니므로 보통 `LspAttach` 이벤트에서 직접 걸어둔다.

```lua
vim.api.nvim_create_autocmd('LspAttach', {
  callback = function(args)
    local opts = { buffer = args.buf, silent = true }
    vim.keymap.set('n', 'gd', vim.lsp.buf.definition, opts)
    vim.keymap.set('n', 'gr', vim.lsp.buf.references, opts)
    vim.keymap.set('n', 'K', vim.lsp.buf.hover, opts)
    vim.keymap.set('n', '<leader>rn', vim.lsp.buf.rename, opts)
    vim.keymap.set('n', '<leader>ca', vim.lsp.buf.code_action, opts)
  end,
})
```

## Telescope (파일/심볼 탐색)

`telescope.nvim` 사용 기준. 한 번 익숙해지면 사이드바 트리 없이도 파일을 더 빨리 연다.

| 단축키 | 동작 |
| --- | --- |
| `<leader>ff` | 파일 찾기 (find_files) |
| `<leader>fg` | 프로젝트 전역 grep (live_grep) |
| `<leader>fb` | 열린 버퍼 목록 |
| `<leader>fh` | 도움말 검색 |
| `<leader>fs` | 문서 심볼 (lsp_document_symbols) |
| Telescope 안 `<C-q>` | 결과 전체를 quickfix 로 보내기 |

`<leader>fg` 결과를 `<C-q>` 로 quickfix 에 담아 두면 `:cdo s/old/new/g` 같은 전역 치환 워크플로가 자연스럽다.

## 자주 까먹는 자잘한 한 방

- `J` : 다음 줄을 현재 줄 끝에 붙이기
- `gJ` : 공백 추가 없이 줄 합치기
- `gq{motion}` : 모션 범위를 자동 줄바꿈 정렬
- `gu{motion}` / `gU{motion}` : 소문자 / 대문자 변환
- `~` : 한 글자 대소문자 토글
- `ggVG` : 파일 전체 비주얼 선택
- `"+y` / `"+p` : 시스템 클립보드 yank / paste
- `<C-a>` / `<C-x>` : 커서 아래 숫자 +1 / -1
- `:earlier 5m` / `:later 5m` : 5분 전 / 후 상태로 시간 여행

`<C-a>` 는 리스트 번호 일괄 수정이나 IP/포트 같은 숫자 미세 조정에 의외로 자주 쓰인다.

## 손에 붙이는 순서 추천

한 번에 다 욱여넣으면 아무것도 남지 않는다. 다음 순서로 한 묶음씩 일주일을 잡는 걸 권한다.

1. **이동**: `w b e 0 $ gg G <C-u> <C-d> <C-o>`
2. **텍스트 객체 + 연산자**: `ciw ci" ca( da{ yi]`
3. **검색·치환**: `/ n N * :%s//gc`
4. **윈도우/버퍼**: `<C-w>v <C-w>= :bn :bd`
5. **LSP / Telescope**: `gd K <leader>rn <leader>ff <leader>fg`

이 다섯 묶음이면 일상 작업의 90% 가 키보드만으로 굴러간다.

## 참고

- [Neovim 공식 문서](https://neovim.io/doc/)
- `:help` (Neovim 안에서) — 모든 단축키의 1차 출처
- [Vim Cheat Sheet](https://vim.rtorr.com/)
