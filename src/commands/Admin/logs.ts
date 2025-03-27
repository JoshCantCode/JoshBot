import { Pagination, PaginationType } from '@discordx/pagination';
import { Category } from '@discordx/utilities';
import { ApplicationCommandOptionType, Client, CommandInteraction, EmbedBuilder } from 'discord.js';
import { Punishment } from 'src/entities/Punishment';
import { Punishments } from 'src/services/Punishment';
import { PunishmentType } from 'src/utils/types/punishments';

import { Discord, Injectable, Slash, SlashOption } from '@/decorators';
import { env } from '@/env';
import { Guard, UserPermissions } from '@/guards';
import { Database, Logger, Stats } from '@/services';
import { chunkArray, resolveGuild } from '@/utils/functions';

@Discord()
@Injectable()
@Category('Admin')
export default class LogsCommand {

	constructor(
		private punishments: Punishments
	) {}

	@Slash({ name: 'logs' })
	@Guard(
		UserPermissions(['Administrator'])
	)
	async ban(
		interaction: CommandInteraction
	) {
		const guild = resolveGuild(interaction);

		const logs = await this.punishments.getAllPunishments();
		if (!logs.length) {
			return interaction.reply('No logs found');
		}

		const embeds = chunkArray(logs, 7).map((chunk, index) => {
			const embed = new EmbedBuilder()
				.setTitle(`Punishments`)
				.setColor('Red')
				.setFooter({ text: `Page ${index + 1}` });

			chunk.forEach((log) => {
				const moderator = guild?.members.cache.get(log.moderator);
				const user = guild?.members.cache.get(log.userId);
				embed.addFields({
					name: `${log.type} ${log.id} - User: ${user?.displayName}`,
					value: `Reason: ${log.reason}\nModerator: ${moderator?.displayName}`,
				});
			});

			return embed;
		});

		await new Pagination(
			interaction,
			embeds.map(embed => ({
				embeds: [embed],
			})),
			{
				type: PaginationType.Button,
			}
		).send();
	}

}
