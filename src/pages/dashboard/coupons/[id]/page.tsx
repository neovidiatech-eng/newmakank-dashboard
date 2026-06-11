

import { fetchData } from '@/api/global/fetchData';
import CouponDetailsPage from '@/components/pages/_coupons/CouponDetailsPage';
import { notFound } from '@/lib/navigation';

interface Params {
  id: string;
}

const page = async ({ params }: { params: Params }) => {
  const data = await fetchData(['coupons', Number((await params).id)]);

  if (!data?.data) {
    return notFound();
  }

  return <CouponDetailsPage data={data.data} />;
};

export default page;
