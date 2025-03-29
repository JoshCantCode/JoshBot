import { Category } from '@discordx/utilities';
import { CommandInteraction } from 'discord.js';
import { Punishment } from 'src/entities/Punishment';
import { Punishments } from 'src/services/Punishment';
import { PunishmentType } from 'src/utils/types/punishments';

import { Discord, Injectable, Slash, SlashChoice } from '@/decorators';
import { env } from '@/env';
import { Guard, UserPermissions } from '@/guards';
import { Database, Logger, Stats } from '@/services';
import { parseDuration, resolveGuild, simpleErrorEmbed, simpleSuccessEmbed, syncUser } from '@/utils/functions';

@Discord()
@Injectable()
@Category('Admin')
export default class UnbanCommand {

	constructor(
		private punishments: Punishments,
		private stats: Stats,
		private logger: Logger
	) {}

	private async getPunishmentChoices(): Promise<string[]> {
		return (await this.punishments.getAllPunishments()).map(punishment => punishment.id);
	}

	@Slash({ name: 'unban' })
	@Guard(
		UserPermissions(['Administrator'])
	)
	async unban(
		@SlashChoice(
			async () => await this.getPunishmentChoices()
		) id: string,
			interaction: CommandInteraction
	) {
		const guild = resolveGuild(interaction);
		const punishment = await this.punishments.getPunishmentById(id);

		if (!punishment) {
			return simpleErrorEmbed(interaction, 'Couldn\'t find that punishment. Please contact an admin.');
		}
	}

}