import { Category } from '@discordx/utilities';
import { ApplicationCommandOptionType, Client, CommandInteraction, GuildMember } from 'discord.js';
import { Punishment } from 'src/entities/Punishment';
import { Punishments } from 'src/services/Punishment';
import { PunishmentType } from 'src/utils/types/punishments';

import { Discord, Injectable, Slash, SlashOption } from '@/decorators';
import { env } from '@/env';
import { Guard, UserPermissions } from '@/guards';
import { Database, Logger, Stats } from '@/services';
import { parseDuration, resolveGuild, simpleSuccessEmbed, syncUser } from '@/utils/functions';

@Discord()
@Injectable()
@Category('Admin')
export default class KickCommand {

	constructor(
		private punishments: Punishments,
		private stats: Stats,
		private logger: Logger
	) {}

	@Slash({ name: 'kick' })
	@Guard(
		UserPermissions(['Administrator'])
	)
	async kick(
        @SlashOption({
        	name: 'user',
        	description: 'The user to kick',
        	type: ApplicationCommandOptionType.User,
        	required: true,
        }) user: GuildMember,
		@SlashOption({
        	name: 'reason',
        	description: 'The reason for the kick',
        	type: ApplicationCommandOptionType.String,
        	required: false,
		}) reason: string,
		interaction: CommandInteraction
	) {
		const guild = resolveGuild(interaction);
		await syncUser(user.user);
		const kick = new Punishment();
		kick.reason = reason;
		kick.guildId = guild?.id || env.TEST_GUILD_ID;
		kick.userId = user.id;
		kick.moderator = interaction.user.id;
		kick.type = PunishmentType.KICK;

		simpleSuccessEmbed(interaction, `User ${user.displayName} has been kicked for \`${reason ?? 'Being an asshole'}\``);

		// Log everything necessary
		await this.stats.registerPunishment(kick);
		const moderator = await interaction.guild?.members.fetch(interaction.user.id);
		this.logger.logPunishment(kick, user, moderator!);

		this.punishments.registerPunishment(kick);
		await interaction.guild?.members.kick(user, reason);
	}

}