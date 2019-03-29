# Contributing

_Welcome!_

Bug fixes, features, docs, and issue support are all contributions. We love it when people help out and are more than willing to give you advice, guidance, or just be a 🐥 debugger for you.
## Global Dependencies

If you're reading this, you might be interested in pitching in from a code point of view.

The `weex-toolkit` is powered by Node (7.6 or above). Install Node using `brew` (if on macOS) or by following the instructions here: [https://nodejs.org/en/download/current/](https://nodejs.org/en/download/current/)

Also install yarn: `brew install yarn` or [https://yarnpkg.com](https://yarnpkg.com).

## Installing `weex-toolkit`

Next, fork the repo [on Github](https://github.com/weexteam/weex-toolkit) and clone down your repo.

```sh
git clone git@github.com/<yourusername>/weex-toolkit
```

Install all the dependencies.

```
cd weex-toolkit
yarn
```

Weex Cli's source files are outside of the `./packages` folder and written in Javascript.

Others modules were put into the `./packages` and are written in [TypeScript](www.typescriptlang.org).

Documentation lives in `/docs`.

## Features & Fixes

```sh
git branch feature/fun
yarn test
yarn lint
git commit -m "feat(core): add some funny features"
git push -u origin --HEAD
```
Your commit log should fellow the rules on [scripts/verifyCommitMessage.js](https://github.com/weexteam/weex-toolkit/blob/master/scripts/verifyCommitMessage.js).

The commit log should be consistent with the following:

```
feat(compile): commit message
fix(module): commit message (close #28)
docs(getting-started): update installation description
...
```

## Submitting a Pull Request

Go to Github and open your fork, Switch to the branch with your new changes, click `new pull request` button, choose the `compare across forks` option and
open a PR against `master` of [weexteam/weex-toolkit](https://github.com/weexteam/weex-toolkit).

If there has no code conflicts, you can submit this pull request.

Then submit the pull request.


## Keeping up to date

You want your fork's `master` to be the same as `weex-toolkit/master`.

```sh
# just once, run this to track our repo as `upstream`
git remote add upstream https://github.com/weexteam/weex-toolkit.git

# then when you need to update
git checkout master
git fetch upstream
git rebase upstream/master

# and here's where you'd create your branch
git checkout -b feature/mybranch
```
