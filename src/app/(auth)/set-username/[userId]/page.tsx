import {SetUsernamePage} from '@/modules/auth/set-username';

type PageParams = {
  userId: string;
};
export default async function Page({params}: {params: Promise<PageParams>}) {
  const {userId} = await params;
  return <SetUsernamePage params={{userId}} />;
}
