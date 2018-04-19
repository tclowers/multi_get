# Multi-Get

This script downloads files from the internet in multiple chunks of a size specified by the user

### Installing

Installation is trivial with npm. Simply open a command prompt in the project directory and type:

```
$ npm install
```

### Usage

Execute the getter.js file with node:

```
$ node ./getter.js -u [file to download] -s [chunk size (defaults to 1MiB)] -f [output file]
```