import { Pagination, PaginationType } from '@discordx/pagination';
import { Category } from '@discordx/utilities';
import { CommandInteraction, EmbedBuilder } from 'discord.js';
import { Punishments } from 'src/services/Punishment';

import { Discord, Injectable, Slash } from '@/decorators';
import { Guard, UserPermissions } from '@/guards';
import { chunkArray, resolveGuild, simpleErrorEmbed } from '@/utils/functions';

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
	async logs(
		interaction: CommandInteraction
	) {
		const guild = resolveGuild(interaction);

		const logs = await this.punishments.getAllPunishments();
		if (!logs.length) {
			simpleErrorEmbed(interaction, 'No logs found');
		}

		const embeds = chunkArray(logs, 7).map((chunk, index) => {
			const embed = new EmbedBuilder()
				.setTitle(`Punishments`)
				.setColor('Red')
				.setFooter({ text: `Page ${index + 1}` });

			chunk.forEach((log) => {
				const moderator = guild?.members.cache.get(log.moderator);
				const user = guild?.members.cache.get(log.userId);
				console.log(log.duration);
				embed.addFields({
					name: `${log.type} ${log.id} - ${user?.displayName}`,
					value: `Reason: \`${log.reason}\`\nModerator: ${moderator?.displayName} (${moderator})\nExpires: ${log.duration ? `<t:${log.duration}:R>` : 'No'}`,
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
