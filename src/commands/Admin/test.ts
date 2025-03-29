import { Category } from '@discordx/utilities';
import { ApplicationCommandOptionType, Client, CommandInteraction, GuildMember, User } from 'discord.js';
import { Punishment } from 'src/entities/Punishment';
import { Punishments } from 'src/services/Punishment';
import { PunishmentType } from 'src/utils/types/punishments';

import { Discord, Injectable, Slash, SlashOption } from '@/decorators';
import { env } from '@/env';
import { Guard, UserPermissions } from '@/guards';
import { Logger, Stats } from '@/services';
import { parseDuration, resolveGuild, simpleSuccessEmbed } from '@/utils/functions';

@Discord()
@Injectable()
@Category('Admin')
export default class TestCommand {

	constructor(
		private punishments: Punishments,
		private stats: Stats,
		private logger: Logger
	) {}

	@Slash({ name: 'test' })
	@Guard(
		UserPermissions(['Administrator'])
	)
	async test(interaction: CommandInteraction) {
		await interaction.followUp(
            `
            1d: ${parseDuration('1d')}
            1m: ${parseDuration('1m')}
            1w: ${parseDuration('1w')}
            1s: ${parseDuration('1s')}
            Now: ${Date.now()}
            `
		);
	}

}