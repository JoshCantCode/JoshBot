import { Category } from '@discordx/utilities';
import { ApplicationCommandOptionType, Client, CommandInteraction, GuildMember } from 'discord.js';
import { Punishment } from 'src/entities/Punishment';
import { Punishments } from 'src/services/Punishment';
import { PunishmentType } from 'src/utils/types/punishments';

import { Discord, Injectable, Slash, SlashOption } from '@/decorators';
import { env } from '@/env';
import { Guard, UserPermissions } from '@/guards';
import { Database, Logger, Stats } from '@/services';
import { parseDuration, resolveGuild, simpleErrorEmbed, simpleSuccessEmbed, syncUser } from '@/utils/functions';

@Discord()
@Injectable()
@Category('Admin')
export default class MuteCommand {

	constructor(
		private punishments: Punishments,
		private stats: Stats,
		private logger: Logger
	) {}

	@Slash({ name: 'mute' })
	@Guard(
		UserPermissions(['Administrator'])
	)
	async mute(
        @SlashOption({
        	name: 'user',
        	description: 'The user to mute',
        	type: ApplicationCommandOptionType.User,
        	required: true,
        }) user: GuildMember,
        @SlashOption({
        	name: 'duration',
        	description: 'The duration of the mute',
        	type: ApplicationCommandOptionType.String,
        	required: true,
        }) duration: string,
		@SlashOption({
        	name: 'reason',
        	description: 'The reason for the mute',
        	type: ApplicationCommandOptionType.String,
        	required: false,
		}) reason: string,
		interaction: CommandInteraction
	) {
		const guild = resolveGuild(interaction);
		await syncUser(user.user);
		const mute = new Punishment();

		if (parseDuration(duration) > 2419200000) {
			simpleErrorEmbed(interaction, `You can't mute for more than 28 days`);

			return;
		}

		mute.reason = reason;
		mute.guildId = guild?.id || env.TEST_GUILD_ID;
		mute.userId = user.id;
		mute.moderator = interaction.user.id;
		mute.type = PunishmentType.MUTE;
		mute.duration = (parseDuration(duration) + BigInt(Date.now()) / BigInt(1000));

		simpleSuccessEmbed(interaction, `User ${user.displayName} has been muted for \`${reason ?? 'Being an asshole'}\``);
		this.punishments.registerPunishment(mute);
		// Log everything necessary
		await this.stats.registerPunishment(mute);
		const moderator = await interaction.guild?.members.fetch(interaction.user.id);
		this.logger.logPunishment(mute, user, moderator!);
		await user.timeout(Number(mute.duration) * 1000, reason);
	}

}