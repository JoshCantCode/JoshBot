import { EntityRepository } from '@mikro-orm/core';
import { Client } from 'discordx';
import { Punishment } from 'src/entities/Punishment';
import { PunishmentType } from 'src/utils/types/punishments';
import { delay, inject } from 'tsyringe';

import { Service } from '@/decorators';
import { Database } from '@/services';

@Service()
export class Punishments {

	private punishmentRepo: EntityRepository<Punishment>;

	constructor(
		private db: Database,
        @inject(delay(() => Client)) private client: Client
	) {
		this.punishmentRepo = this.db.get(Punishment);
	}

	async registerPunishment(punishment: Punishment) {
		await this.db.em.persistAndFlush(punishment);
	}

	async getAllPunishments() {
		return await this.punishmentRepo.findAll();
	}

	async getPunishments(type: PunishmentType, active: boolean = true) {
		return await this.punishmentRepo.find({ type, active });
	}

	async getPunishmentById(id: string) {
		return await this.punishmentRepo.findOne({ id });
	}

	async getPunishmentsByUserId(userId: string) {
		return await this.punishmentRepo.find({ userId });
	}

	async removePunishment(id: string) {
		const punishment = await this.getPunishmentById(id);
		if (!punishment) return;
		punishment.active = false;
		await this.db.em.persistAndFlush(punishment);
	}

}
