'use client';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {TabsContent} from '@/components/ui/tabs';
import {Tooltip} from '@/components/ui/tooltip';
import {Comments, Posts, Sections} from '@/constants/data';
import {BellRing} from 'lucide-react';
import {FC, Fragment, useState} from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {useQuery} from '@tanstack/react-query';
import {adminPostService} from '../../actions/post-service/post';
import {adminService} from '../../actions/user';
import {COLORS} from '../../data';

type OverviewProps = {
  searchTerm: string;
  filterSection: string;
  filterStatus: string;
  tabValue: string;
  setCurrentTab: (current: string) => void;
};

export const OverViewTab: FC<OverviewProps> = ({
  searchTerm,
  setCurrentTab,
  filterSection,
  filterStatus,
  tabValue,
}) => {
  const [searchTerms, setSearchTerms] = useState('');
  const [viewContentDialog, setViewContentDialog] = useState(false);

  const [selectedReportContent, setSelectedReportContent] =
    useState<string>('');
  const [selectedReportType, setSelectedReportType] = useState<string>('');

  const {
    isLoading: loadingUserStats,
    error,
    data: usersData,
  } = useQuery({
    queryKey: ['user-distribution-and-stats'],
    queryFn: () => adminService.getUserDistributionAndStats(),
    retry: true,
  });
  console.log('should query', error);

  console.log(usersData, 'should query dataa');

  const {
    isLoading: loadingSectionStats,
    error: sectionErr,
    data: sectionData,
  } = useQuery({
    queryKey: ['section-post-comment-stats'],
    queryFn: () => adminPostService.getSectionPostCommentStats(),
    retry: true,
  });
  console.log('section data', sectionErr);

  console.log(sectionData, 'section dataa');

  const {
    isLoading: loadingPostStats,
    error: postStatsErr,
    data: postStatsData,
  } = useQuery({
    queryKey: ['post-stats'],
    queryFn: () => adminPostService.getPostStats(),
    retry: true,
  });
  console.log('poststats err', postStatsErr);

  console.log(postStatsData, 'postStat dataa');

  const pendingAds = [
    {
      id: '1',
      title: 'New Fitness Program',
      description: 'Transform your body in 30 days with our proven program',
      sponsor: 'FitLife Inc',
      type: 'banner',
      section: '5',
      duration: '30',
      submitted: new Date(2023, 4, 1),
      status: 'pending',
    },
    {
      id: '2',
      title: 'Summer Tech Sale',
      description: 'Huge discounts on all electronic devices this summer',
      sponsor: 'TechWorld',
      type: 'post',
      section: '1',
      duration: '14',
      submitted: new Date(2023, 4, 2),
      status: 'pending',
    },
  ];

  const userActivityData = [
    {name: 'New Users', value: 45},
    {name: 'Active Users', value: 125},
    {name: 'Inactive', value: 30},
  ];

  const sectionData2 = Sections.map(cat => ({
    name: cat.ch,
    posts: Posts.filter(post => post.sectionId === cat.id).length,
    comments: Posts.filter(post => post.sectionId === cat.id).reduce(
      (acc, post) => {
        const postComments = Comments.filter(c => c.postId === post.id).length;
        return acc + postComments;
      },
      0,
    ),
  }));

  const filteredAds = pendingAds.filter(ad => {
    const matchesSearch =
      searchTerm === '' ||
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.sponsor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSection =
      filterSection === 'all' || ad.section === filterSection;
    const matchesStatus = filterStatus === 'all' || ad.status === filterStatus;

    return matchesSearch && matchesSection && matchesStatus;
  });

  const {distribution, growth, totalUsers} = usersData ?? {};

  const userActivityDatas = distribution
    ? [
        {name: 'New Users', value: distribution.newUsers},
        {name: 'Active Users', value: distribution.activeUsers},
        {name: 'Inactive', value: distribution.inactiveUsers},
      ]
    : [];

  const userActivityDatass =
    distribution && totalUsers
      ? [
          {
            name: 'New Users',
            value: Math.round((distribution.newUsers / 100) * totalUsers),
          },
          {
            name: 'Active Users',
            value: Math.round((distribution.activeUsers / 100) * totalUsers),
          },
          {
            name: 'Inactive Users',
            value: Math.round((distribution.inactiveUsers / 100) * totalUsers),
          },
        ]
      : [];

  return (
    <Fragment>
      <TabsContent value={tabValue} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {growth}% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Active Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {postStatsData?.totalPosts}
              </div>
              <p className="text-xs text-muted-foreground">
                {postStatsData?.growth}% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Ads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredAds.length}</div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setCurrentTab('ads')}>
                Review
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Section Activity</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sectionData?.data}
                margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="posts" name="Posts" fill="#8884d8" />
                <Bar dataKey="comments" name="Comments" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userActivityDatas}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percent}) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value">
                  {userActivityDatas?.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 border-b pb-4">
                <BellRing className="text-app" />
                <div>
                  <p className="text-sm font-medium">New user registration</p>
                  <p className="text-xs text-muted-foreground">
                    Sarah Johnson joined the platform
                  </p>
                </div>
                <div className="ml-auto text-xs text-muted-foreground">
                  5m ago
                </div>
              </div>
              <div className="flex items-center gap-4 border-b pb-4">
                <BellRing className="text-app" />
                <div>
                  <p className="text-sm font-medium">
                    New advertisement submitted
                  </p>
                  <p className="text-xs text-muted-foreground">
                    TechWorld submitted a new ad
                  </p>
                </div>
                <div className="ml-auto text-xs text-muted-foreground">
                  20m ago
                </div>
              </div>
              <div className="flex items-center gap-4 border-b pb-4">
                <BellRing className="text-red-500" />
                <div>
                  <p className="text-sm font-medium">New content report</p>
                  <p className="text-xs text-muted-foreground">
                    A post was reported for inappropriate content
                  </p>
                </div>
                <div className="ml-auto text-xs text-muted-foreground">
                  1h ago
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* View Reported Content Dialog */}
      <Dialog open={viewContentDialog} onOpenChange={setViewContentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedReportType === 'post'
                ? 'Reported Post'
                : 'Reported Comment'}
            </DialogTitle>
            <DialogDescription>
              Review the reported content below.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 border rounded-md max-h-96 overflow-y-auto">
            {selectedReportContent}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewContentDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};
