import { Category } from '@discordx/utilities';
import { ApplicationCommandOptionType, Client, CommandInteraction, GuildMember, TextChannel } from 'discord.js';
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
export default class PruneCommand {

	constructor(
		private stats: Stats,
		private logger: Logger
	) {}

	@Slash({ name: 'prune' })
	@Guard(
		UserPermissions(['Administrator'])
	)
	async prune(
        @SlashOption({
        	name: 'amount',
        	description: 'The amount of messages to prune',
        	type: ApplicationCommandOptionType.Integer,
        	required: true,
        }) amount: number,
        @SlashOption({
        	name: 'user',
        	description: 'The user to prune',
        	type: ApplicationCommandOptionType.User,
        	required: false,
        }) user: GuildMember,
        interaction: CommandInteraction
	) {
		if (user) syncUser(user.user);

		if (amount > 100) return interaction.followUp({ content: 'You can only prune 100 messages at a time', ephemeral: true });
		if (amount < 1) return interaction.followUp({ content: 'You must prune at least 1 message', ephemeral: true });

		const channel = interaction.channel as TextChannel;
		if (!channel) return interaction.followUp({ content: 'This command can only be used in a text channel', ephemeral: true });

		const messages = await channel.messages.fetch({ limit: amount });

		messages.forEach(async (message) => {
			if (!message.deletable) return;
			await message.delete();
		});

		simpleSuccessEmbed(interaction, `Pruned ${messages.size} messages from ${channel.name}`);

		// Log
		this.stats.register('MESSAGE_PRUNE', amount.toString());
		this.logger.log(
            `Pruned ${messages.size} messages from ${channel.name}`,
            'info',
            false
		);
	}

}