import { createAccessControl } from 'better-auth/plugins/access';
import { ownerAc, defaultStatements } from 'better-auth/plugins/organization/access';

const ac = createAccessControl(defaultStatements);

const ownerRole = ac.newRole(ownerAc.statements);
const adminRole = ac.newRole({
	member: ['create', 'update', 'delete'],
	invitation: ['create', 'cancel'],
	team: ['create', 'update', 'delete'],
});

// do not allow members to manage any organization related data
const memberRole = ac.newRole({});

export { ac, adminRole, memberRole, ownerRole };
