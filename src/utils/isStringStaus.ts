export function isStringStaus(status: string): boolean {
	return (
		status === 'active' ||
		status === 'inactive' ||
		status === 'pending' ||
		status === 'completed' ||
		status === 'cancelled' ||
		status === 'deleted' ||
		status === 'published' ||
		status == 'pendingPaymentTimeout' ||
		status == 'disabled'
	);
}
