# Contributing

Do you enjoy Logic Pro, Javascript, the Logic Pro Scripter plugin or all three? Here's how we can help each other.

We love pull requests from everyone. By participating in this project, you agree
to abide by the LPXscripts [code of conduct](https://github.com/kabirnagral/LPXscripts/blob/master/CODE_OF_CONDUCT.md).

## Contents

[Git and GitHub](#git-and-github)

[Contributing Basics](#contributing-basics)
* [Contributing to the Library](#contributing-to-the-library)
* [Contributing to the Guide](#contributing-to-the-guide)
* [Submitting Changes](#submitting-changes)
* [Commit Messages](#commit-messages)
* [Making Changes Locally](#making-changes-locally)

[Coding Conventions](#coding-conventions)

[Reporting Issues](#reporting-issues)

[Resources](#resources)

## Git and Github

LPXscripts is an Open Source project. It uses [Git](https://git-scm.com/) and [GitHub](http://github.com/) to handle coordinating maintenance of the site and the publishing of new content and features.

Check out our [resources](#resources) for assistance.

## Contributing Basics

Fork this repository (Don't know how? Refer to the [resources](#resources)).

Clone your fork of this repository (Don't know how? Refer to the [resources](#resources)).

Make your changes locally on your system (more about that [here](#making-changes-locally)), while making sure that you follow our [coding conventions](#coding-conventions).

Test your changes to see if they work.

### Contributing to the Library

To contribute to the Library, you need to have Logic Pro X installed on your system (the system should run OS X, although there may be people who know workarounds). You need to access the Logic Pro Scripter plugin on a MIDI/software instrument through the MIDI FX options (see [here](https://kabirnagral.github.io/LPXscripts/#how-to-use-library) on how to get there). Once you are there, you can use regular JavaScript, the basic Apple tutorials and this [quick reference guide] (https://kabirnagral.github.io/LPXscripts/#reference-guide) to start developing your own plugins.

### Contributing to the Guide

The website is contained in the docs folder. To contribute to the website, you do not need to have Logic Pro (although that definitely helps). All you need is basic HTML/CSS experience. In fact, you don't even need any coding experience. You could raise issues you have with the website [here](https://github.com/kabirnagral/LPXscripts/issues/new), or even provide language translations for the website (raise an issue for the same).

### Submitting Changes

Add your changes and commit them, while keeping in mind our [policy on commit messages](#commit-messages).

Push your local repository to your remote repository.

Submit a pull request.

Please send a [GitHub Pull Request to LPXscripts](https://github.com/kabirnagral/LPXscripts/pull/new/master) with a clear list of what you've done. Please follow our [coding conventions](#coding-conventions).

Wait for us.
We try to at least comment on pull requests within one business day.
We may suggest changes.

### Commit Messages

Always write a clear log message for your commits. One-line messages are fine for small changes, but bigger changes should look like this:

    $ git commit -m "A brief summary of the commit
    > 
    > A paragraph describing what changed and its impact."

### Making Changes Locally

We suggest that you always make changes to your fork on a local repository on your system. This makes the testing process for both the script functions and the guide website much simpler. If you are only making documentation changes, then it is fine to make changes using GitHub's online editor.

## Coding conventions

Start reading our code and you'll get the hang of it. We optimize for readability:

  * We indent using two spaces (soft tabs)
  * We always put spaces after list items (`[1, 2, 3]`, not `[1,2,3]`) and method parameters (`[1, 2, 3]`, not `[1,2,3]`), around operators (`x += 1`, not `x+=1`), and around hash arrows.
  * This is open source software. Consider the people who will read your code, and make it look nice for them.
  * Our code must be accessible to all. Check out our [resources](#resources) for assistance.

## Reporting Issues

Raising and reporting issues is an incredible way to contribute to this project. If you find something you think you can improve or you want improved, please [raise an issue](https://github.com/kabirnagral/LPXscripts/issues/new). Read through [existing issues](https://github.com/kabirnagral/LPXscripts/issues) to make sure that you are not raising a new issue that is similar to an issue that already exists. If you have something that is related to an existent issue, you can comment on its thread.

## Resources

You can use and contribute to resources [here](https://github.com/kabirnagral/LPXscripts/blob/master/RESOURCES.md).
