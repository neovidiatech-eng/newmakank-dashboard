'use client';
import { useRouter, useSearchParams } from '@/lib/navigation';

export default function useTablePagination() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const oldSearchParams: any = {};
	searchParams.forEach((value, key) => {
		oldSearchParams[key] = value;
	});
	return {
		page: searchParams.get('page')
			? parseInt(searchParams.get('page') as string)
			: 1,
		per_page: searchParams.get('limit')
			? parseInt(searchParams.get('limit') as string)
			: 5,
		setPage: (page: number) => {
			router.push(
				`?${new URLSearchParams({ ...oldSearchParams, page }).toString()}`,
			);
		},
		setPer_page: (per_page: number) => {
			router.push(
				`?${new URLSearchParams({ ...oldSearchParams, limit: per_page }).toString()}`,
			);
		},
	};
}
