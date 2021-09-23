import inquirer from "inquirer";

/**
 * Get text from command line
 *
 * @param  {string}          message Message to show in prompt
 * @return {Promise<string>}
 */

export async function getText(message = '') {
	const res = await inquirer.prompt([{
		name: 'input',
		message: message,
		validate: (name) => {
			return Boolean(name.trim());
		}
	}])
	return res.input;
}


/**
 * Get text from command line
 *
 * @param  {string}          message Message to show in prompt
 * @return {Promise<string>}
 */

export async function confirm(message = '') {
	const res = await inquirer.prompt([{
		type: 'confirm',
		message: message,
		default: 'N',
		name: 'isConfirm'
	}])
	return res.isConfirm;
}
