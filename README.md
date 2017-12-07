# pattern-library-updater
Node updater for Lerna pattern library versions in to projects

This simple script will read your projects package.json and pull through any new version numbers from a source project. New package still have to be manually added.

## How to install

To install, run `npm install` and set the `.env` variables if you want.

## How to use

Make sure that the pattern library project is up to date (checkout master and make sure you've done a pull)

#### - Simple
```
node index.js
```

#### - With options

```
node index.js --project <path to project> --library <path to project> --scope <npm scope>
```

## .env

You can also add a `.env` file and put the options in there. Copy the `.env-example` file and add your own values.

```
PROJECT_PATH=/full/path/to/project
LIBRARY_PATH=/full/path/to/pattern-library
SCOPE=@company
```
