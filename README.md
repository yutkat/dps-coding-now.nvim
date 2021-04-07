# dps-coding-now

![2021-04-07_11-16](https://user-images.githubusercontent.com/8683947/113802988-9d026300-9796-11eb-941e-0523ef99d2a9.png)

## Usage

1. You need create a
   [Personal access token](docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)
   with correct permissions. This plugin requires Personal token permissions
   with user privileges.
2. Export an environment variable named `CODING_NOW_GITHUB_TOKEN` containing
   your Personal Access Token. (eg. Write it in your ~/.zshenv.local or
   something)`export CODING_NOW_GITHUB_TOKEN=<YOUR PERSONAL ACCESS TOKEN>`
3. Install this plugin and denops

```vim
Plug 'vim-denops/denops.vim'
Plug 'yutkat/dps-coding-now.nvim'
```
