#!/usr/bin/env node

const chalk     		= require('chalk');
const clear   			= require('clear');
const figlet   			= require('figlet');
const realmethods		= require('realmethods');
const inquirer			= require('./lib/inquire');
var constants 			= require("./lib/constants");
const Configstore 		= require('configstore');
const conf 				= new Configstore(constants.REALMETHODS);
const Table   			= require('cli-table')

////////////////////////////////////////////////////
// Function Definitions
////////////////////////////////////////////////////

////////////////////////////////////////////////////
// handles the authentication of the user, requiring
// the user to provide their unique token, assigned
// within their profile during registration
////////////////////////////////////////////////////

var program = require('commander');

program
.version('0.1.7', '-v, --version')
.option('-q, --quiet <arg>', 'true or [false] to minimize output to only results.');

program
.command('init [token]')
.description('Must run first to initialize the realMethods. If you do not provide a token, you will be prompted for one')
.action(async function(token){
	console.log( chalk.blue(
		    figlet.textSync('realMethods', { horizontalLayout: 'default', verticalLayout: "default" })
		)
	);

	var theToken;
	if ( token != null ) {
		theToken = token;
	}
	else {
		token = await inquirer.askCredentials();		// ask for the token
		theToken = token.tokenInput;
	}

	realmethods.authenticate(theToken)
			.then(function(result) {
				console.log( result );
			}).catch(err => console.log(err));
});

////////////////////////////////////////////////////
// user related options
////////////////////////////////////////////////////

program
.command('user_info')
.description('Information about the signed in user.')
.action(function(){
	realmethods.userInfo()
		.then(function(data) {
			console.log( data );
		}).catch(err => console.log(err));
}).on('--help', function() {
    console.log('');
    console.log('Gets information about the signed in user.');
    console.log('');
    console.log('Example to get current user information:');
    console.log('');
    console.log('  $ realmethods_cli user_info');
    console.log('');
    
});

////////////////////////////////////////////////////
// model related options
////////////////////////////////////////////////////

program
.command('model_list [scope]')
.description('List available models. Scope: public, private, community. Empty returns all.')
.option('-o, --output [value]', '[json] or pretty for pretty print')
.option('-f, --filter [value]', 'emf, sqlscript, uml, xmi, pojo, json')
.action(function(scope, options){
	realmethods.listModels(scope, options.filter)
		.then(function(data) {
			var models = JSON.parse(data.result);
			if ( options.output == constants.PRETTY_PRINT_OUTPUT) {
				const tbl 		= new Table({
											head: ['id', 'name', 'description', 'contributor', 'type', 'scope'], 
											colWidths: [10, 30, 30, 25, 15, 15]
										});
				var saveParams;
				for(var index = 0; index < models.length; index++ ) {
					saveParams = JSON.parse(models[index].saveParams);
						tbl.push( 
								[
									models[index].id, 
									saveParams.name, 
									saveParams.description, 
									models[index].contributor,
									models[index].modelType,
									models[index].scopeType
								]);
				}
				console.log(tbl.toString());
			}
			else {
					console.log(models);
			} 
	}).catch(err => console.log(err));
	
}).on('--help', function() {
    console.log('');
    console.log('Example to display all public models using pretty print:');
    console.log('');
    console.log('  $ realmethods_cli model_list public --output pretty');
    console.log('');
    console.log('Example to display all your public and private models as json [default]:');
    console.log('');
    console.log('  $ realmethods_cli model_list');
    console.log('Example to display all community sql script models as json :');
    console.log('');
    console.log('  $ realmethods_cli model_list community -f sqlscript');    
});


program
.command('model_validate <filepath>')
.description('Validate a model for possible usage later on.')
.action(function(filepath){
	realmethods.validateModel(filepath)
		.then(function(data) {
			console.log(data);
		}).catch(err => console.log(err));
}).on('--help', function() {
    console.log('');
    console.log('Loads and validates a model uaing a supported model parser.');
    console.log('');
    console.log('Example to validate a UML XMI file:');
    console.log('');
    console.log('  $ realmethods_cli model_validate ./models/myuml.xmi');
    console.log('');
    
});

program
.command('model_publish <yaml_file> [scope]')
.description('Publish a model using a YAML directives. Scope: public or private[default].')
.action(function(yaml_file, scope){
	realmethods.registerModel(yaml_file, scope)
		.then(function(data) {
			console.log(data);
		}).catch(err => console.log(err));
}).on('--help', function() {
    console.log('');
    console.log('Example to publish a model as private:');
    console.log('');
    console.log('  $ realmethods_cli model_publish ./save-my-model.ecore');
    console.log('');
    console.log('Example to publish a model as public:');
    console.log('');
    console.log('  $ realmethods_cli model_publish ./save-my-model.ecore public');
    console.log('');
    
});

program
.command('model_download <model_id> <output_file_path>')
.description('Download a model file.  Only owned or public models can be downloaded.' )
.action(function(model_id, output_file_path){
	realmethods.downloadModel(model_id, output_file_path)
		.then(function(data){
			console.log(data);
		}).catch(err => console.log(err));
}).on('--help', function() {
    console.log('');
    console.log('Example to download an delete:');
    console.log('');
    console.log('  $ realmethods_cli model_download 2 ./tmp/archive/mymodel.xmi');
    
});

program
.command('model_promote <id>')
.description('Promote an owned model from private scope to public.')
.action(async function(id){
	var confirm = await inquirer.confirmation();		// ask for confirmation;
	if ( confirm.query == true )
		realmethods.promoteModel(id)
			.then(function(data){
				console.log(data);
		}).catch(err => console.log(err));
}).on('--help', function() {
    console.log('');
    console.log('Example to promote a model referenced by id=1000:');
    console.log('');
    console.log('  $ realmethods_cli model_promote 1000');    
});

program
.command('model_demote <id>')
.description('Demote an owned model from public scope to private.')
.action(async function(id){
	var confirm = await inquirer.confirmation();		// ask for confirmation;
	if ( confirm.query == true )
		realmethods.demoteModel(id)
			.then(function(data){
				console.log(data);
			}).catch(err => console.log(err));
}).on('--help', function() {
    console.log('');
    console.log('Example to demote a model referenced by id=1000:');
    console.log('');
    console.log('  $ realmethods_cli model_demote 1000');    
});

program
.command('model_delete <id>')
.description('Delete a model.  Can only delete an owned private model.')
.action(async function(id){
	var confirm = await inquirer.confirmation();		// ask for confirmation;
	if ( confirm.query == true )
		realmethods.deleteModel(id)
			.then(function(data){
				console.log(data);
			}).catch(err => console.log(err));				
}).on('--help', function() {
    console.log('');
    console.log('Example to delete a model referenced by id=12:');
    console.log('');
    console.log('  $ realmethods_cli model_delete 12');    
});

////////////////////////////////////////////////////
// tech stack related options
////////////////////////////////////////////////////
    	
program
.command('stack_list [scope]')
.description('List available tech stacks : Scope: public, private, community. Default returns all of yours.')
.option('-o, --output [type]', '[json] or pretty for pretty print')
.option('-f, --filter [value]', 'serverless, webapp, restfulapi, mobile')
.action(function(scope, options, filter){
	realmethods.listTechStacks(scope, options.filter)
	.then(function(data) {
		var pkgs = JSON.parse(data.result);
		if ( options.output == constants.PRETTY_PRINT_OUTPUT) {
			const tbl 		= new Table({
										head: ['id', 'name','version', 'contributor', 'scope', 'type', 'status'], 
										colWidths: [5, 35, 10, 30, 15, 15, 15]
									});
			var saveParams;
			for(var index = 0; index < pkgs.length; index++ ) {
				saveParams = JSON.parse(pkgs[index].saveParams);
				tbl.push( 	
							[
								pkgs[index].id, 
								saveParams.name, 
								pkgs[index].version,
								pkgs[index].contributor,
								pkgs[index].scope,
								pkgs[index].type, 
								pkgs[index].status
							] );
			}
			console.log(tbl.toString());
		}
		else {
				console.log(pkgs);
		} 
	});
}).on('--help', function() {
    console.log('');
    console.log('Example to display all your public tech stacks using pretty print:');
    console.log('');
    console.log('  $ realmethods_cli stack_list private --output pretty');
    console.log('');
    console.log('Example to display all your serverless type tech stacks as json:');
    console.log('');
    console.log('  $ realmethods_cli stack_list -f serverless');
    
});

program
.command('stack_options <id>')
.description('Available stack application options, modifiable to allow customization of a generated app.')
.action(function(id){
	realmethods.stackOptions(id)
		.then(function(data){
			if ( program.quiet == 'true' )
				console.log(data.result);
			else
				console.log(data);
	}).catch(err => console.log(err));
}).on('--help', function() {
    console.log('');
    console.log('Example to download the app options for the associated tech stack');
    console.log('into a JSON file:');
    console.log('');
    console.log('  $ realmethods_cli stack_options --quiet true 1 > app.options.json');
    console.log('');    
});

program
.command('stack_validate <filepath>')
.description('Validate a tech stack for usage later on.')
.action(function(filepath){
	realmethods.validateTechStack(filepath)
		.then(function(data){
			console.log(data);
	}).catch(err => console.log(err));

}).on('--help', function() {
    console.log('');
    console.log('Validates the structure and contents of a tech stack package (ZIP file).');
    console.log('');
    console.log('Example to validate a tech stack zip file:');
    console.log('');
    console.log("  $ realmethods_cli stack_validate './samples/techstacks/AWS_Lambda_RDS_Modified.zip'");
    console.log('');
    
});

program
.command('stack_publish <yaml_file> [scope]')
.description('Publish a stack using YAML directives. Scope: public or private [default].')
.action(function(yaml_file, scope){
	realmethods.registerTechStack(yaml_file, scope)
		.then(function(data){
			console.log(data);
	}).catch(err => console.log(err));
	
}).on('--help', function() {
    console.log('');
    console.log('Example to publish a tech stack as public:');
    console.log('');
    console.log('  $ realmethods_cli stack_publish ./yamls/save-my-techstack.yml public');
    console.log('');
    
});

program
.command('stack_download <stack_id> <output_file_path>')
.description('Download a tech stack as a ZIP file.  Only owned or public apps can be downloaded.' )
.action(function(app_id, output_file_path){
	realmethods.downloadStack(app_id, output_file_path)
		.then(function(data){
			console.log(data);
	}).catch(err => console.log(err));
	
}).on('--help', function() {
    console.log('');
    console.log('Example to download a tech stack referenced by id=15:');
    console.log('');
    console.log('  $ realmethods_cli stack_download 15 ./tmp/archive/mystack.zip');
    
});


program
.command('stack_promote <id>')
.description('Promote an owned tech stack from private scope to public.')
.action(async function(id){
	var confirm = await inquirer.confirmation();		// ask for confirmation;
	if ( confirm.query == true ) {
		realmethods.promoteStack(id)
			.then(function(data){
				console.log(data);
		}).catch(err => console.log(err));
		
	}
}).on('--help', function() {
    console.log('');
    console.log('Example to promote a tech stack referenced by id=24:');
    console.log('');
    console.log('  $ realmethods_cli stack_promote 24');    
});


program
.command('stack_demote <id>')
.description('Demote an owned tech stack from public scope to private.')
.action(async function(id){
	var confirm = await inquirer.confirmation();		// ask for confirmation;
	if ( confirm.query == true ) {
		realmethods.demoteStack(id)
			.then(function(data){
				console.log(data);
		}).catch(err => console.log(err));
		
	}
}).on('--help', function() {
    console.log('');
    console.log('Example to promote a tech stack referenced by id=24:');
    console.log('');
    console.log('  $ realmethods_cli stack_promote 24');    
});

program
.command('stack_delete <id>')
.description('Delete a tech stack.  Can only delete an owned private tech stack.')
.action(async function(id){
	var confirm = await inquirer.confirmation();		// ask for confirmation;
	if ( confirm.confirm == true ) {
		realmethods.deleteStack(id)
			.then(function(data){
				console.log(data);
		}).catch(err => console.log(err));
	}
}).on('--help', function() {
    console.log('');
    console.log('Example to delete a tech stack referenced by id=256:');
    console.log('');
    console.log('  $ realmethods_cli stack_delete 256');    
});


////////////////////////////////////////////////////
// app related options
////////////////////////////////////////////////////

program
.command('app_generate <yaml_file>')
.description('Generates an app using the directives of a YAML file.')
.option('-g, --gitFile [value]', 'Git settings in YAML file, overrides appOptionsFile setting in the generation YAML file')
.option('-o, --optionsFile [value]', 'App options in JSON file, overrides gitParams setting in the generation YAML file')
.option('-m, --modelIdentifier [value]', 'Either a model file or the id of a previously used/registered model, overrides modelId setting in the generation YAML file')
.action(function(yaml_file, options){
	console.log( 'git file input arg is ' + options.gitFile);
	realmethods.generateApp(yaml_file, options.gitFile, options.optionsFile, options.modelIdentifier)
		.then(function(data){
			console.log(data);
	}).catch(err => console.log(err)); 
}).on('--help', function() {
    console.log('');
    console.log('');
    console.log('Example to generate an app using the directives of a YAML file, which include the git and app options file locations:');
    console.log('');
    console.log('  $ realmethods_cli app_generate ./sample.yamls/generate.apps.yml');
    console.log('');
    console.log('');
    console.log('Example to generate an app using the directives of a YAML file, the Git and app options files, and a model file');
    console.log('');
    console.log('  $ realmethods_cli app_generate ./sample.yamls/generate.apps.yml -g ./samples/git/test.git.yml -o ./samples/options/remote/Angular7MongoDB.options.json -m samples/model/reference_management.xmi');
    console.log('');
});


program
.command('app_download <app_id> <output_file_path>')
.description('Download an application ZIP file archived.  Only owned or public apps can be downloaded.' )
.action(function(app_id, output_file_path){
	realmethods.downloadApp(app_id, output_file_path)
		.then(function(data){
			console.log(data);
	}).catch(err => console.log(err));

}).on('--help', function() {
    console.log('');
    console.log('Example to download the application referred to by id=2:');
    console.log('');
    console.log('  $ realmethods_cli app_download 2 ./tmp/archive/myapp.zip');
    
});

program
.command('app_delete <id>')
.description('Delete a previously generated app.  Can only delete an owned private app.')
.action(function(id){
	realmethods.deleteApp(id)
		.then(function(data){
			console.log(data);
	}).catch(err => console.log(err));
}).on('--help', function() {
    console.log('');
    console.log('Example to delete an app:');
    console.log('');
    console.log('  $ realmethods_cli app_delete 256');    
});

program
.command('app_promote <id>')
.description('Promote an owned application from private scope to public.')
.action(function(id){
	realmethods.promoteApp(id)
		.then(function(data){
			console.log(data);
	}).catch(err => console.log(err));
}).on('--help', function() {
    console.log('');
    console.log('Promote an owned applicaton from private scope to public.');
    console.log('');
    console.log('Example to promote the app referenced by id=78:');
    console.log('');
    console.log('  $ realmethods_cli app_promote 78');    
});

program
.command('app_demote <id>')
.description('Demote an owned application from public scope to private.')
.action(function(id){
	realmethods.demoteApp(id)
		.then(function(data){
			console.log(data);
	}).catch(err => console.log(err));
}).on('--help', function() {
    console.log('');
    console.log('Demote an owned applicaton from public scope to private.');
    console.log('');
    console.log('Example to demote the app referenced by id=78:');
    console.log('');
    console.log('  $ realmethods_cli app_demote 78');    
});

program
.command('app_list [scope]')
.description('List previously generated apps that have been archive. Scope: public, private, community. Empty returns all.')
.option('-o, --output [type]', '[json] or pretty for pretty print')
.action(function(scope, options){
	realmethods.listApps(scope)
	.then(function(data) {
		var archives = JSON.parse(data.result);
		if ( options.output == constants.PRETTY_PRINT_OUTPUT) {
    		const table 		= new Table({
    									head: ['id', 'name', 'date-time', 'contributor', 'scope'], 
    									colWidths: [10, 30, 30, 30, 20]
    								});
    		var saveParams;
    		var name;
    		for(var index = 0; index < archives.length; index++ ) {
    			//console.log(archives[index]);
    			name = JSON.parse(archives[index].saveParams).name;
    			if ( name === undefined )
    				name = "";
    			table.push( 
    						[
    							archives[index].id, 
    							name, 
    							archives[index].dateTime,
    							archives[index].contributor,
    							archives[index].scopeType
    						] );
    		}
    		console.log(table.toString());
		}
		else {
    		console.log(archives);
		} 
		
	})
}).on('--help', function() {
    console.log('');
    console.log('Example to display all community archived apps using pretty print:');
    console.log('');
    console.log('  $ realmethods_cli app_list public --output pretty');
    console.log('');
    console.log('Example to display all your public archived apps as json [default]:');
    console.log('');
    console.log('  $ realmethods_cli app_list public');
    console.log('');
    console.log('Example to display all your apps using pretty print:');
    console.log('');
    console.log('  $ realmethods_cli app_list -o pretty');
    console.log('');
    console.log('Example to display all community apps using pretty print:');
    console.log('');
    console.log('  $ realmethods_cli app_list community -o pretty');
    
});

program.parse(process.argv);


// if no args (actually no second arg or more, output the help
if (!process.argv.slice(2).length) {
	program.outputHelp();
}

if (program.quiet == 'false' || program.quiet == undefined) {
	conf.set( constants.QUIET_MODE, false );
}
else {
	// set the global indicator to be quiet about output
	conf.set( constants.QUIET_MODE, true );
}
