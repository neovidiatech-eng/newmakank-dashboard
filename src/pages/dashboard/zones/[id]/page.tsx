
import { fetchData } from '@/api/global/fetchData';
import DefaultItemDetailsCreator from '@/components/common/DefaultItemDetailsComponents/DefaultItemDetailsCreator';

async function page({ params }: { params: Params }): Promise<JSX.Element> {
  const data = await fetchData(['zones', Number((await params).id)]);

  return (
    <DefaultItemDetailsCreator
      data={data?.data}
    />
  );
}

export default page;
