# laessig

_laessig_ (a german word (lässig) which stands for 'casual') is a small tool belt which provides helpers for your day-to-day work with the css preprocessor [LESS](http://lesscss.org/).

## Installation

In order to install _laessig_ you need a working [Node.js](http://nodejs.org/) environment. Please consider the great documentation in the [Node.js Github-Wiki](https://github.com/joyent/node/wiki) for a brief explanation about the installation steps.

You have to install _laessig_ with root privileges via the NPM package system:

    $ sudo npm install laessig -g

## Commands

I've talked about a small tool belt, well, currently there is one command, but, a very important one. Maybe there will be more commands in the future. Let me know if you need a functionality in the context of working with LESS :)

### Observe

Observes a defined LESS file. If there are local changes, _laessig_ will compile it into the respective css file. Note that the tool observes the whole directory. So if you have some other LESS files which will be imported into the observed one, _laessig_ will also trigger the compile mechanism.

**Usage:**

    $ laessig observe /the/path/to/your/file.less

You can also add a minify flag. If set _laessig_ will compress your css output:

    $ laessig observe /the/path/to/your/file.less -m

## Important!
Enjoy! :)

## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)

## Author

Copyright (c) 2012, [André König](http://iam.andrekoenig.info)
