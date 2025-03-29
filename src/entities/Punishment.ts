import { randomUUID } from 'node:crypto';

import { Entity, EntityRepositoryType, PrimaryKey, Property } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/sqlite';
import { PunishmentType } from 'src/utils/types/punishments';

import { CustomBaseEntity } from './BaseEntity';

// ===========================================
// ================= Entity ==================
// ===========================================

@Entity({ repository: () => PunishmentRepository })
export class Punishment extends CustomBaseEntity {

	[EntityRepositoryType]?: PunishmentRepository;

	@PrimaryKey({ autoincrement: false })
    id: string = randomUUID().substring(0, 8);

	@Property({ nullable: false, type: 'string', default: 'Being an asshole' })
    reason: string;

	@Property()
    userId: string;

	@Property()
    guildId: string;

	@Property()
    moderator: string;

	@Property()
    active: boolean = true;

	@Property({ nullable: true, type: 'bigint' })
	duration?: bigint;

	@Property({ type: 'string' })
	type: PunishmentType;

}

// ===========================================
// =========== Custom Repository =============
// ===========================================

export class PunishmentRepository extends EntityRepository<Punishment> {}
