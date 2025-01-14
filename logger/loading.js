const { colors } = require('../func/colors.js');
const moment = require("moment-timezone");
const characters = '';
const getCurrentTime = () => colors.gray(moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss DD/MM/YYYY'));

function logError(prefix, message) {
	if (message === undefined) {
		message = prefix;
		prefix = "JUBAYER ERROR";
	}
	process.stderr.write(`\r${`${getCurrentTime()} ${colors.redBright(`${characters} ${prefix}:`)} ${message}`}`);
}

module.exports = {
	err: logError,
	error: logError,
	warn: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "JUBAYER WARN";
		}
		process.stderr.write(`\r${`${getCurrentTime()} ${colors.yellowBright(`${characters} ${prefix}:`)} ${message}`}`);
	},
	info: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "JUBAYER INFO";
		}
		process.stderr.write(`\r${`${getCurrentTime()} ${colors.greenBright(`${characters} ${prefix}:`)} ${message}`}`);
	},
	succes: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "JUBAYER SUCCES";
		}
		process.stderr.write(`\r${`${getCurrentTime()} ${colors.cyanBright(`${characters} ${prefix}:`)} ${message}`}`);
	},
	master: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "BAYJID MASTER";
		}
		process.stderr.write(`\r${`${getCurrentTime()} ${colors.hex("#eb6734", `${characters} ${prefix}:`)} ${message}`}`);
	}
};
