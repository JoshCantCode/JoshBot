import { Category } from '@discordx/utilities';
import { ApplicationCommandOptionType, Client, CommandInteraction, GuildMember, User } from 'discord.js';
import { Punishment } from 'src/entities/Punishment';
import { Punishments } from 'src/services/Punishment';
import { PunishmentType } from 'src/utils/types/punishments';

import { Discord, Injectable, Slash, SlashOption } from '@/decorators';
import { env } from '@/env';
import { Guard, UserPermissions } from '@/guards';
import { Logger, Stats } from '@/services';
import { resolveGuild, simpleSuccessEmbed } from '@/utils/functions';

@Discord()
@Injectable()
@Category('Admin')
export default class WarnCommand {

	constructor(
		private punishments: Punishments,
		private stats: Stats,
		private logger: Logger
	) {}

	@Slash({ name: 'warn' })
	@Guard(
		UserPermissions(['Administrator'])
	)
	async warn(
        @SlashOption({
        	name: 'user',
        	description: 'The user to warn',
        	type: ApplicationCommandOptionType.User,
        	required: true,
        }) user: GuildMember,
        @SlashOption({
        	name: 'reason',
        	description: 'The reason for the warn',
        	type: ApplicationCommandOptionType.String,
        	required: false,
        }) reason: string,
        interaction: CommandInteraction
	) {
		const guild = resolveGuild(interaction);
		const warn = new Punishment();
		warn.reason = reason;
		warn.guildId = guild?.id || env.TEST_GUILD_ID;
		warn.userId = user.id;
		warn.moderator = interaction.user.id;
		warn.type = PunishmentType.WARN;

		await this.punishments.registerPunishment(warn);
		simpleSuccessEmbed(interaction, `User ${user.displayName} has been warned for ${reason ?? `Being an asshole`}`);

		// Log everything necessary
		await this.stats.registerPunishment(warn);
		const moderator = await interaction.guild?.members.fetch(interaction.user.id);
		this.logger.logPunishment(warn, user, moderator!);
	}

}