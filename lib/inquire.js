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
      }
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