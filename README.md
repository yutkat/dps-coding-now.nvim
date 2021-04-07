# dps-coding-now

## Usage

1. You need create a [Personal access token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token) with correct permissions.
   This plugin requires Personal token permissions with user privileges.
1. Export an environment variable named `CODING_NOW_GITHUB_TOKEN` containing your Personal Access Token. (eg. Write it in your ~/.zshenv.local or something)
`export CODING_NOW_GITHUB_TOKEN=<YOUR PERSONAL ACCESS TOKEN>`
1. Install this plugin and denops
```
Plug 'vim-denops/denops.vim'
Plug 'yutkat/dps-coding-now.nvim'
```
