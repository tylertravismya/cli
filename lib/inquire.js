const inquirer   	= require('inquirer');
const constants		= require('./constants');

module.exports = {

  askCredentials: () => {
    const questions = [
      {
        name: 'tokenInput',
        type: 'input',
        message: 'Enter your token, available from your account at ' + constants.REALMETHODS_DOMAIN + ':',
        validate: function( value ) {
        	return value ? true : false;
        }
      },
      {
          name: 'hostUrl',
          type: 'input',
          message: 'Enter host url or leave empty to use realMethods SaaS Platform:',
          validate: function( value ) {
          	return true;
          }
        },
      
    ];
    return inquirer.prompt(questions);
  },
  
  confirmation: () => {
    const confirm = [
      {
        name: 'query',
        type: 'confirm',
        message: 'Are you sure you?',
        validate: function( value ) {
        	return value ? true : false;
        }
      }
    ];
    return inquirer.prompt(confirm);
  }

}