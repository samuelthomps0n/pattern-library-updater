const argv = require('yargs').argv
const path = require('path')
const fs   = require('fs')
const env  = require('dotenv').load()

const projectPath = argv.project || process.env.PROJECT_PATH
const libPath = argv.library || process.env.LIBRARY_PATH
const scope = argv.scope || process.env.SCOPE

let projectPackageJSON = require(path.join(projectPath, '/package.json'))

for(var dependency in projectPackageJSON.dependencies){
	if(dependency.startsWith(scope)) {

		const packagePath = path.join(libPath, 'packages', dependency.replace(scope + "/", ""), '/package.json')

		if (fs.existsSync(packagePath)) {
			const packageJson = require(packagePath)
			console.log("Changing version of " + dependency + ": " + projectPackageJSON.dependencies[dependency] + " -> " + packageJson.version)
			projectPackageJSON.dependencies[dependency] = packageJson.version
		}
	}
}

savePackageJSON(projectPackageJSON, projectPath)

/**
 * @param  {Object} packageJSON
 * @param  {string} projectPath 
 */
function savePackageJSON(packageJson, projectPath) {
	packageJson = JSON.stringify(packageJson, null, 2)

	fs.writeFile(path.join(projectPath, '/package.json'), packageJson, function(err) {
		if(err) {
			return console.log(err)
		}

		console.log("The package.json was update")
	})
}