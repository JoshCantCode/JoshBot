import { Punishment } from 'src/entities/Punishment';
import { Punishments } from 'src/services/Punishment';

import { Database } from '@/services';

import { resolveDependency } from './dependency';

export default async function checkExpiredPunishments() {
	const punishmentService = await resolveDependency(Punishments);
	const db = await resolveDependency(Database);
	const punishmentRepo = db.get(Punishment);
	const punishments = await punishmentRepo.find({ active: true });

	for (const punishment of punishments) {
    	if (punishment.duration) {
    		const now = Date.now();
    		if (now >= punishment.createdAt.getTime() + new Date(punishment.duration).getTime()) {
				await punishmentService.removePunishment(punishment.id);
    		}
    	}
	}
}
