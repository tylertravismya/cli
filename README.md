# realMethods Node.js CLI

A Node.js command line interface (CLI) to interact with the realMethods Application Generation Platform.

This CLI helps you manage models and technology stacks to generate, commit, and archive fully functional applications.

Use realMethods to bootstrap DevOps by generating all the core code and services an applications needs.

Model support includes:

Current technology stacks support includes:

## Installation

```
npm install realmethods_cli
```

## Validation

Validate the install by typing _realmethods_cli_.  A list of command options should appear.

## Getting Started

### realMethods Initialization

```
realmethods_cli init <token>
```

where token is your unique token assigned when you signed up for an account at http://www.realmethods.com

If you do not have a token, you will be prompted to provide one. 


## Available Commands

### User Commands

#### User Information

```
user_info
```

Gets information about the signed in user.

#### Example:

To display the current user information:

```
realmethods_cli user_info
```

----------------------------

### Model Commands

#### List of Models

```
model_list [options] [scope] [filter]
```

List available models. 

scope: __public, private, community__. Providing no value returns all.
filter: __emf, sqlscript, uml, xmi, pojo, json__ Providing no value returns all.

#### Example:

To display all public models using pretty print:
```
realmethods_cli model_list public --output pretty
```

To display all your public and private models as json [default]:
```
realmethods_cli model_list
```

To display all community sql script models as json:
```
realmethods_cli model_list community -f sqlscript
```

----------------------------

#### Validate a Model

```
model_validate <filepath>
```

Validate a model for usage later on.

#### Example:

To validate a UML XMI file:

```
realmethods_cli model_validate ./models/myuml.xmi
```

----------------------------

#### Publish a Model

```
model_publish <yaml_file> [scope]
```

Publish a model to make it available to others (public) and during application generation.

Publish a model using YAML directives. Scope: public or private[default].

#### Example:

To publish a model as private:

```
realmethods_cli model_publish ./save-my-model.ecore
```

To publish a model as public:

```
realmethods_cli model_publish ./save-my-model.ecore public
```

----------------------------

#### Download a Model

```
model_download <app_id> <output_file_path>
```

Download a model file.  Only owned or public models can be downloaded.

#### Example:

To download a model:

```
realmethods_cli model_download 2 ./tmp/archive/mymodel.xmi'
```

----------------------------

#### Promote a Model

Any private model you own can be promoted to public.  Making it public allows it to be accessed by others. 

```
model_promote <id>
```

Promote an owned model from private scope to public. Promotion cannot be undone. Confirmation is required

#### Example:

To promote a model from being private to public, referenced by id=1000:

```
realmethods_cli model_promote 1000
```

----------------------------

#### Delete a Model

```
model_delete <id>
```

Delete a model.  Can only delete an owned private model.  Deletion cannot be undone.

#### Example:

To delete a model referenced by id=12, prompted to confirm:

```
realmethods_cli model_delete 12    
```


### Technology Stack Package Commands

#### List of Technology Stack Packages

```
stack_list [options] [scope] [filter]
```

List available tech stacks.
Scope: _public, private, community_
Filter: _serverless, webapp, restfulapi, mobile_

Default returns all of your technology stack packages.

#### Example:

To display all your public tech stacks using pretty print:

```
realmethods_cli stack_list private --output pretty
```

To display all your serverless type technology stack packages as json

```
realmethods_cli stack_list -f serverless
```

----------------------------

#### Download a Technology Stack Package Options

```
stack_options <id>
```

Available technology stack package application options, modifiable to allow customization of a generated application.  Download as JSON
and provide as JSON during application generation.

#### Example:

To download the application options for the associated technology stack package, piped into a file as JSON with output turn to quiet:

```
realmethods_cli stack_options --quiet true 1 > app.options.json
```

----------------------------

#### Validate a Technology Stack

```
stack_validate <filepath>
```

Validates the structure and contents of a technology stack package (ZIP file).  Download an existing technology stack package to view its contents
to understand what is required.

#### Example:

To validate a technology stack package:

```
realmethods_cli stack_validate './samples/techstacks/AWS_Lambda_RDS_Modified.zip'
```

----------------------------

#### Publish a Technology Stack

```
stack_publish <yaml_file> [scope]
```
Publish a technology stack package to make it available to others (public) and during application generation.

Publish using YAML directives. Scope: public or private [default].

A published technology stack package is first validated and if found to be valid it is published, otherwise it is rejected.

#### Example:

To publish a technology stack package as public:
   
```
realmethods_cli stack_publish ./yamls/save-my-techstack.yml public'
```

----------------------------

#### Download a Technology Stack

```
stack_download <app_id> <output_file_path>
```

Download a technology stack package as a ZIP file.  Only owned or public stacks can be downloaded. 

If interested in creating and publishing a technology stack, it is best to first try to locate and download 
an existing technology stack that closest meets your requirements.

#### Example:

To download a technology stack package referenced by id=15:

```
realmethods_cli stack_download 15 ./tmp/archive/mystack.zip'
```
----------------------------

```
stack_delete <id>
```

Delete a technology stack package.  Can only delete an owned private technology stack package.  Confirmation is required.

#### Example:

To delete a technology stack package referenced by id=256:

```
realmethods_cli stack_delete 256    
```

----------------------------

#### Promote a Technology Stack

```
stack_promote <id>
```

Promote an owned technology stack package from private scope to public.  Making it public gives it community access.

Promotion cannot be undone. Confirmation is required.

#### Example:

To promote a technology stack package referenced by id=24:

```
realmethods_cli stack_promote 24    
```

### Application Commands

#### Generate an Application

```
app_generate <yaml_file>
```

Generates an application using the directives of a YAML file. This YAML files allows the listing of
one ore more application directives including a model identifier, technology stack identifier, Git options and more.

#### Example:

To generate multiple applications using the directives of a YAML file:

```
realmethods_cli app_generate ./sample.yamls/generate.apps.yml
```
----------------------------

#### Download an Application

```
app_download <app_id> <output_file_path>
```

Download a previously generated archived application ZIP file.  Only owned or public applications can be downloaded.

#### Example:

To download an application archive file with identifier of 55 to a local file:

```
realmethod_cli app_download 55 ./myapplication.zip
```

----------------------------

#### Delete an Application

```
app_delete <id>
```

Delete a previously generated app.  Can only delete an owned private application.  Confirmation is required.

#### Example:

To delete an application with id of 256:

```
realmethods_cli app_delete 256
```

----------------------------

#### Promote an Application

```
app_promote <id>
```

Promote an owned application from private scope to public.  Promotion cannot be undone.  Confirmation is required.

#### Example:

To promote the application referenced by id=78:

```
realmethods_cli app_promote 78    
```

----------------------------

#### List of Applications

```
app_list [options] [scope]
```

List previously generated applications that have been archive. Scope: public, private, community. Empty returns all.

#### Example:

To display all community archived applications using pretty print:

```
realmethods_cli app_list public --output pretty
```

To display all your publicly archived applications as json [default]:

```
realmethods_cli list_app public'
```

To display all your archived applications using pretty print:

```
realmethods_cli list_app -o pretty
```

To display all community archived applications using pretty print:

```
realmethods_cli list_app community -o pretty
```

-----------------------

## Options


### -v, --version
Output the version number

### -q, --quiet <arg>
Set <arg> to true or [false] to minimize output to only results with no status messages. Use this to pipe JSON output to a file.

### -h, --help                                         
Output usage information for the total system or for each command as follows:

```
realmethods_cli model_list -h
```

to display the help for the *model_list* command

## Important YAML Configuration Files

As outlined above, certain commands require a YAML file.  The following details the structure of each YAML file.

### Git Configuration Parameters

This YAML file contains one or more groupings of parameters to control committing an application's files (code, Maven files, Dockerfile, etc..) to GitHub.  This file is referenced by an application generation YAML file.  

Example Contents:

```
gitParams:
  - name:          bitbucket_test
	username:      xxxxxxxxx
	password:      xxxxxxxxx    
	repository:    bb-demo  # public repository
	tag:           latest
	host:          bitbucket.org
	
  - name:          git-hub-test 
	username:      xxxxxxxxx
	password:      xxxxxxxxx    
	repository:    github-demo # public repository
	tag:           latest
	host:          github.com
	```

View an example within the installed package in sub-directory _./samples/github/_

### Application Generation Configuration Parameters

This YAML file contains the directives required to generate an application using a specified model, technology stack, application options, and GitHub entry of an entry found in a specified YAML file.

Example Contents:

```
apps:
    - techStackId:       3
      modelId:           1
      appOptionsFile:    ./samples/options/aws.lambda.rdbms.options.json
      gitHubParams:      
         entry:          app-1-params
         file:           ./samples/github/demo.github.params.yml
      saveParams:
         name:           Bowling App v0.01
         description:    Sprint 1 version of Serverless using Bowling EMF Model

    - techStackId:       AWSLambdaRDS
      modelId:           2
      appOptionsFile:    ./samples/options/aws.lambda.rdbms.options.json
      gitHubParams:      
         entry:          app-2-params
         file:           ./samples/github/demo.github.params.yml
      saveParams:
         name:           Bowling App v0.02
         description:    Sprint 2 version of Serverless using Bowling EMF Model

```

View an example within sub-directory _./samples/yamls/_

### Stack and Model Publish Parameters

This YAML file contains the location of the reference file to publish, along with save and version related details.

Example Contents:

```
version:            1.0
saveParams:
    name:           AWS Lambda RDS Upgraded
    description:    Sprint 2 version of Bowling EMF
stackPath:          ./samples/techstacks/
stackFile:			AWS_Lambda_RDS_Upgraded.zip
```
View an example within sub-directory  _./samples/yamls/_

