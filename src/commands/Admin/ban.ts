import { Category } from '@discordx/utilities';
import { ApplicationCommandOptionType, Client, CommandInteraction, GuildMember } from 'discord.js';
import { Punishment } from 'src/entities/Punishment';
import { Punishments } from 'src/services/Punishment';
import { PunishmentType } from 'src/utils/types/punishments';

import { Discord, Injectable, Slash, SlashOption } from '@/decorators';
import { env } from '@/env';
import { Guard, UserPermissions } from '@/guards';
import { Database, Logger, Stats } from '@/services';
import { resolveGuild, simpleSuccessEmbed } from '@/utils/functions';

@Discord()
@Injectable()
@Category('Admin')
export default class BanCommand {

	constructor(
		private bans: Punishments,
		private stats: Stats,
		private logger: Logger
	) {}

	@Slash({ name: 'ban' })
	@Guard(
		UserPermissions(['Administrator'])
	)
	async ban(
        @SlashOption({
        	name: 'user',
        	description: 'The user to ban',
        	type: ApplicationCommandOptionType.User,
        	required: true,
        }) user: GuildMember,
		@SlashOption({
        	name: 'reason',
        	description: 'The user to ban',
        	type: ApplicationCommandOptionType.String,
        	required: true,
		}) reason: string,
		@SlashOption({
        	name: 'duration',
        	description: 'An optional duration, (i.e. 1d, 1w, 1m, 1y)',
        	type: ApplicationCommandOptionType.String,
        	required: false,
		}) duration: string,
        	interaction: CommandInteraction
	) {
		const guild = resolveGuild(interaction);
		const ban = new Punishment();
		ban.reason = reason;
		ban.guildId = guild?.id || env.TEST_GUILD_ID;
		ban.userId = user.id;
		ban.moderator = interaction.user.id;
		ban.duration = duration;
		ban.type = PunishmentType.BAN;

		await this.bans.registerPunishment(ban);
		await interaction.guild?.members.ban(user, { reason });
		simpleSuccessEmbed(interaction, `User ${user.displayName} has been warned for ${reason ?? `Being an asshole`}`);

		// Log everything necessary
		await this.stats.registerPunishment(ban);
		const moderator = await interaction.guild?.members.fetch(interaction.user.id);
		this.logger.logPunishment(ban, user, moderator!);
	}

}