// Internal dependencies
const path = require('path')
const fs   = require('fs')

// External dependencies
const env  = require('dotenv').load()
const argv = require('yargs').argv
const prompt = require('prompt-sync')({
	sigint: true
})

// Env variables
const projectPath = argv.project || process.env.PROJECT_PATH
const libPath = argv.library || process.env.LIBRARY_PATH
const scope = argv.scope || process.env.SCOPE
const confirm = argv.prompt || false

let projectPackageJSON = require(path.join(projectPath, '/package.json'))

for (var dependency in projectPackageJSON.dependencies){
	if (dependency.startsWith(scope)) {

		const packagePath = path.join(libPath, 'packages', dependency.replace(scope + "/", ""), '/package.json')

		if (fs.existsSync(packagePath)) {
			const packageJson = require(packagePath)
			if (packageJson.version !== projectPackageJSON.dependencies[dependency]) {
				
				let ok = 'y'

				if (confirm) {
					ok = prompt('Update ' + dependency + ' from ' + projectPackageJSON.dependencies[dependency] + ' to ' + packageJson.version + '? (y/n) ', 'n')
				}

				if (ok === 'y') {
					updatePackage(dependency, packageJson)
				} else {
					console.log("Skipping " + dependency)
				}
			}
		}
	}
}

savePackageJSON(projectPackageJSON, projectPath)

/**
 * @param  {string} dependency
 * @param  {Object} packageJson 
 */
function updatePackage(dependency, packageJson) {
	console.log("\x1b[32m\u2713\x1b[0m ",dependency + "...", projectPackageJSON.dependencies[dependency], "->", packageJson.version)
	projectPackageJSON.dependencies[dependency] = packageJson.version
}

/**
 * @param  {Object} packageJSON
 * @param  {string} projectPath 
 */
function savePackageJSON(packageJson, projectPath) {
	packageJson = JSON.stringify(packageJson, null, 2)

	fs.writeFile(path.join(projectPath, '/package.json'), packageJson, function(err) {
		if (err) {
			return console.log(err)
		}

		console.log("The package.json was update")
	})
}