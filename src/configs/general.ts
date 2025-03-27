import { env } from '@/env'

export const generalConfig: GeneralConfigType = {

	name: 'JoshBot', // the name of your bot
	description: 'The all purpose discord bot, but perfect, just like Josh <3', // the description of your bot
	defaultLocale: 'en', // default language of the bot, must be a valid locale
	ownerId: env.BOT_OWNER_ID,
	timezone: 'Europe/Paris', // default TimeZone to well format and localize dates (logs, stats, etc)

	simpleCommandsPrefix: 'j!', // default prefix for simple command messages (old way to do commands on discord)
	automaticDeferring: true, // enable or not the automatic deferring of the replies of the bot on the command interactions

	// useful links
	links: {
		invite: '.',
		supportServer: '.',
		gitRemoteRepo: '.',
	},

	automaticUploadImagesToImgur: false, // enable or not the automatic assets upload

	devs: ['784457955156033556'], // discord IDs of the devs that are working on the bot (you don't have to put the owner's id here)

	// define the bot activities (phrases under its name). Types can be: PLAYING, LISTENING, WATCHING, STREAMING
	activities: [
		{
			type: 'PLAYING',
			text: 'Marvel Rivals',
		},
	],

}

// global colors
export const colorsConfig = {
	primary: '#2F3136',
}
