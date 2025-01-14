const { getTime, drive } = global.utils;
if (!global.temp.welcomeEvent)
	global.temp.welcomeEvent = {};

module.exports = {
	config: {
		name: "welcome",
		version: "1.7",
		author: "NTKhang",
		category: "events"
	},

	langs: {
		vi: {
			session1: "sáng",
			session2: "trưa",
			session3: "chiều",
			session4: "tối",
			welcomeMessage: "Cảm ơn bạn đã mời tôi vào nhóm!\nPrefix bot: %1\nĐể xem danh sách lệnh hãy nhập: %1help",
			multiple1: "bạn",
			multiple2: "các bạn",
			defaultWelcomeMessage: "Xin chào {userName}.\nChào mừng bạn đến với {boxName}.\nChúc bạn có buổi {session} vui vẻ!"
		},
		en: {
			session1: "morning",
			session2: "noon",
			session3: "afternoon",
			session4: "evening",
			welcomeMessage: "━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n❁𝐉𝐔𝐁𝐀𝐘𝐄𝐑𓇽𝐊𝐎𝐎𝐊𝐈𝐄☔︎ 𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗘𝗗 𝗦𝗨𝗖𝗖𝗘𝗦𝗙𝗨𝗟𝗟\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n𝗕𝗢𝗧 𝗔𝗗𝗠𝗜𝗡: 𝐌𝐎𝐇𝐀𝐌𝐌𝐀𝐃 𝐉𝐔𝐁𝐀𝐘𝐄𝐑\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞: https://www.facebook.com/xnxx.chrome\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n𝗪𝗛𝗔𝗧𝗦 𝗔𝗣𝗣: wa.me/+8801*******65\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n𝗧𝗘𝗟𝗘𝗚𝗥𝗔𝗠: t.me/𝐌𝐎𝐇𝐀𝐌𝐌𝐀𝐃𝐉𝐔𝐁𝐀𝐘𝐄𝐑\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━ ",
			multiple1: "you",
			multiple2: "you guys",
			defaultWelcomeMessage: `𝗔𝗦𝗦𝗔𝗟𝗔𝗠𝗨 𝗔𝗟𝗔𝗜𝗞𝗨𝗠-﷼-!💫       {userName}.\n𝗔𝗠𝗔𝗗𝗘𝗥 𝗚𝗥𝗢𝗨𝗣 𝗔      {multiple}   𝗔𝗣𝗡𝗔𝗥 𝗦𝗔𝗚𝗢𝗧𝗢𝗠-!!༉‧₊˚.😍:           \n{boxName}        \n𝗪𝗘𝗟𝗖𝗢𝗠𝗘ೄྀ࿐ ˊˎ-          !  「 ✦ {session} ✦ 」  💫`
		}
	},

	onStart: async ({ threadsData, message, event, api, getLang }) => {
		if (event.logMessageType == "log:subscribe")
			return async function () {
				const hours = getTime("HH");
				const { threadID } = event;
				const { nickNameBot } = global.GoatBot.config;
				const prefix = global.utils.getPrefix(threadID);
				const dataAddedParticipants = event.logMessageData.addedParticipants;
				// if new member is bot
				if (dataAddedParticipants.some((item) => item.userFbId == api.getCurrentUserID())) {
					if (nickNameBot)
						api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
					return message.send(getLang("welcomeMessage", prefix));
				}
				// if new member:
				if (!global.temp.welcomeEvent[threadID])
					global.temp.welcomeEvent[threadID] = {
						joinTimeout: null,
						dataAddedParticipants: []
					};

				// push new member to array
				global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);
				// if timeout is set, clear it
				clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

				// set new timeout
				global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
					const threadData = await threadsData.get(threadID);
					if (threadData.settings.sendWelcomeMessage == false)
						return;
					const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
					const dataBanned = threadData.data.banned_ban || [];
					const threadName = threadData.threadName;
					const userName = [],
						mentions = [];
					let multiple = false;

					if (dataAddedParticipants.length > 1)
						multiple = true;

					for (const user of dataAddedParticipants) {
						if (dataBanned.some((item) => item.id == user.userFbId))
							continue;
						userName.push(user.fullName);
						mentions.push({
							tag: user.fullName,
							id: user.userFbId
						});
					}
					// {userName}:   name of new member
					// {multiple}:
					// {boxName}:    name of group
					// {threadName}: name of group
					// {session}:    session of day
					if (userName.length == 0) return;
					let { welcomeMessage = getLang("defaultWelcomeMessage") } =
						threadData.data;
					const form = {
						mentions: welcomeMessage.match(/\{userNameTag\}/g) ? mentions : null
					};
					welcomeMessage = welcomeMessage
						.replace(/\{userName\}|\{userNameTag\}/g, userName.join(", "))
						.replace(/\{boxName\}|\{threadName\}/g, threadName)
						.replace(
							/\{multiple\}/g,
							multiple ? getLang("multiple2") : getLang("multiple1")
						)
						.replace(
							/\{session\}/g,
							hours <= 10
								? getLang("session1")
								: hours <= 12
									? getLang("session2")
									: hours <= 18
										? getLang("session3")
										: getLang("session4")
						);

					form.body = welcomeMessage;

					if (threadData.data.welcomeAttachment) {
						const files = threadData.data.welcomeAttachment;
						const attachments = files.reduce((acc, file) => {
							acc.push(drive.getFile(file, "stream"));
							return acc;
						}, []);
						form.attachment = (await Promise.allSettled(attachments))
							.filter(({ status }) => status == "fulfilled")
							.map(({ value }) => value);
					}
					message.send(form);
					delete global.temp.welcomeEvent[threadID];
				}, 1500);
			};
	}
};
